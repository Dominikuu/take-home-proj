const { isEmpty, set } = require('lodash')
const axios = require('axios')
const uuidv4 = require("uuid/v4");
const Hashids = require("hashids");
const URL = require("url").URL;
const hashids = new Hashids();
const { genJwtToken } = require("./jwt_helper");
const bcrypt = require("bcrypt");
const { check, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const ba = require('binascii');
const crypto = require("crypto-js");
const { redisClient } = require('../service/redisdao');
const ejs = require("ejs");
const { url } = require('inspector');
const re = /(\S+)\s+(\S+)/;

// Note: express http converts all headers
// to lower case.
const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";
const EXPIRED_MIN = 2;

const loginReqValidate = [
    check('username', 'Username Must Be an Email Address').isEmail(),
    check('password').isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
]
const registerReqValidate = []

function parseAuthHeader(hdrValue) {
    if (typeof hdrValue !== "string") {
        return null;
    }
    const matches = hdrValue.match(re);
    return matches && { scheme: matches[1], value: matches[2] };
}

const fromAuthHeaderWithScheme = function(authScheme) {
    const authSchemeLower = authScheme.toLowerCase();
    return function(request) {
        let token = null;
        if (request.headers[AUTH_HEADER]) {
            const authParams = parseAuthHeader(request.headers[AUTH_HEADER]);
            if (authParams && authSchemeLower === authParams.scheme.toLowerCase()) {
                token = authParams.value;
            }
        }
        return token;
    };
};

const fromAuthHeaderAsBearerToken = function() {
    return fromAuthHeaderWithScheme(BEARER_AUTH_SCHEME);
};

const appTokenFromRequest = fromAuthHeaderAsBearerToken();

// app token to validate the request is coming from the authenticated server only.
const appTokenDB = {
    forum: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
};

const alloweOrigin = {
    "http://localhost:3000": true
};

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, "");
const encodedId = () => hashids.encodeHex(deHyphenatedUUID());

// A temporary cahce to store all the application that has login using the current session.
// It can be useful for variuos audit purpose

const originAppName = {
    "http://localhost:3000": "forum",
};

const customerRegisterApi = {
    forum: "http://nginx:808/user/registration"
}

// these token are for the validation purpose
// const intrmTokenCache = {};

const fillIntrmTokenCache = async(origin, id, intrmToken) => {
    await redisClient.setAsync('intrm_'+ intrmToken, JSON.stringify([id, originAppName[origin]]))
};
const storeApplicationInCache = async (origin, user_id, intrmToken) => {
    // if (sessionApp[id] == null) {
    //     sessionApp[id] = {
    //         [originAppName[origin]]: true
    //     };
    //     fillIntrmTokenCache(origin, id, intrmToken);
    // } else {
    //     sessionApp[id][originAppName[origin]] = true;
    //     fillIntrmTokenCache(origin, id, intrmToken);
    // }

    const sessionApp = await redisClient.hgetAsync('app_'+ user_id, originAppName[origin])
    await redisClient.hsetAsync('app_'+ user_id, originAppName[origin], true)
    await fillIntrmTokenCache(origin, user_id, intrmToken);

    // console.log({...sessionApp }, {...sessionUser }, { intrmTokenCache });
};

const generatePayload = async (ssoToken, db) => {
    const intrmTokenCache = await redisClient.getAsync('intrm_' + ssoToken)
    const globalSessionToken = JSON.parse(intrmTokenCache)[0]
    const appName = JSON.parse(intrmTokenCache)[1];
    const userEmail = await redisClient.getAsync('user_' + globalSessionToken);
    const [user] = await db.read('user', {email: userEmail})
    if (!user){
        return
    }
    const appPolicy = user.app_policy[appName];

    console.log(appPolicy)
    const email = appPolicy && appPolicy.shareEmail === true ? userEmail : undefined;
    const payload = {
        ... {...appPolicy },
        ... {
            email,
            shareEmail: undefined,
            uid: user.userId,
            // global SessionID for the logout functionality.
            globalSessionID: globalSessionToken
        }
    };
    return payload;
};

const register = (req, res, next) => {
    return res.render("register", {
        title: "SSO-Server | Registration"
    });
}

const doRegister = async(req, res, next, db) => {
    const { email, password, name, serviceURL } = req.body;
    // Check duplicate
    const isDulicated = !isEmpty(await db.read('user', { email }))
    if (isDulicated) {
        return res.status(400).json({ message: "EMAIL_DULICATED" });
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const saltedPwd = await bcrypt.hash(password, salt)
    const userContent = {
        email,
        password: saltedPwd,
        name,
        user_id: encodedId(),
        create_time: new Date(),
        app_policy: {
            sso_consumer: { role: "admin", shareEmail: true },
            simple_sso_consumer: { role: "user", shareEmail: false },
            forum: { role: "user", shareEmail: true }
        }
    }

    // Trigger customer service create user
    const targetProxyUrl =customerRegisterApi[originAppName[serviceURL]];

    if (targetProxyUrl) {
        try {
            const customerRegisteresult = await axios.post(targetProxyUrl, { email, name})
            console.log(customerRegisteresult)
        } catch(err){
            return res.status(400).json({ message: err })
        }
    }
    // Insert User to SSO DB
    try {
        await db.insert('user', userContent)
    } catch(err) {
        return res.status(400).json({ message: "REGISTER_FAILED" });
    }

    return res.status(200).json({ message: "REGISTER_SUCCESS" })

}

const verifySsoToken = async(req, res, next, db) => {
    const appToken = appTokenFromRequest(req);
    const { ssoToken } = req.query;
    // if the application token is not present or ssoToken request is invalid
    // if the ssoToken is not present in the cache some is
    // smart.
    const intrmTokenCache = await redisClient.getAsync('intrm_' + ssoToken)
    if (
        appToken == null ||
        ssoToken == null ||
        intrmTokenCache == null
    ) {
        return res.status(400).json({ message: "badRequest" });
    }

    // if the appToken is present and check if it's valid for the application
    const appName = JSON.parse(intrmTokenCache)[1];
    const globalSessionToken = JSON.parse(intrmTokenCache)[0];
    const sessionTargetApp = await redisClient.hgetAsync('app_'+globalSessionToken, appName)


    // If the appToken is not equal to token given during the sso app registraion or later stage than invalid
    if (
        appToken !== appTokenDB[appName] ||
        sessionTargetApp !== 'true'
    ) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    // checking if the token passed has been generated
    const payload = await generatePayload(ssoToken, db);
    const token = await genJwtToken(payload);
    // delete the itremCache key for no futher use,
    await redisClient.deleteAsync('intrm_' + ssoToken)
    return res.status(200).json(token);
};
const doLogin = async(req, res, next, db) => {
    const { email, password } = req.body;
    const [user] = await db.read('user', { email })
        // Validation
    if (!user) {
        return res.status(404).json({ message: "USER_NOT_EXISTED" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(404).json({ message: "INVALID_EMAIL_PASSWORD" });
    }
    const {serviceURL} = req.body;
    const id = encodedId();
    req.session.user = id;
    await redisClient.setAsync('user_'+id, email)
    if (!serviceURL) {
        return res.status(200).json({ message: "LOGIN_SUCCESS" });
    }
    const url = new URL(serviceURL);
    const intrmid = encodedId();
    await storeApplicationInCache(url.origin, id, intrmid);
    return res
        .status(200)
        .json({ ssoToken: intrmid});
};

const login = (req, res, next) => {
    // The req.query will have the redirect url where we need to redirect after successful
    // login and with sso token.
    // This can also be used to verify the origin from where the request has came in
    // for the redirection
    const { serviceURL } = req.query;
    // direct access will give the error inside new URL.
    if (serviceURL != null) {
        const url = new URL(serviceURL);
        if (alloweOrigin[url.origin] !== true) {
            return res
                .status(400)
                .json({ message: "Your are not allowed to access the sso-server" });
        }
    }
    console.log("[req.session.user]: ", req.session.user)
    if (req.session.user != null && serviceURL == null) {
        return res.redirect("/");
    }

    // if global session already has the user directly redirect with the token
    if (req.session.user != null && serviceURL != null) {
        const url = new URL(serviceURL);
        const intrmid = encodedId();
        storeApplicationInCache(url.origin, req.session.user, intrmid);
        return res.redirect(`${serviceURL}#/?ssoToken=${intrmid}`);
    }
    return res.render("login", {
        title: "SSO-Server | Login"
    });
};

//send email
async function sendEmail(targetEmail, resetToken, userId) {
    const kek = process.env.SMTP_CIPHER
    const secretKey = process.env.SMTP_SECRET_KEY
    const bytes = crypto.AES.decrypt(kek, ba.unhexlify(secretKey))
    const smtp_psw = bytes.toString(crypto.enc.Utf8);
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: smtp_psw
        },
    });

    const emailTemplate = await ejs.renderFile("views/forget-password-email.ejs", { targetEmail, resetUrl: process.env.RESET_URL.replace(/{token}/g, resetToken).replace(/{userId}/g, userId) });

    // send mail with defined transport object
    return await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: targetEmail || 'alanccl92@hotmail.com',
        subject: "Here's to Reset Password ✔ - Unitik",
        attachments: [{
            filename: 'logo.jpeg',
            path: 'views/images/logo.jpeg',
            cid: 'logo'
        }, {
            filename: 'reset.png',
            path: 'views/images/reset.png',
            cid: 'reset'
        }],
        html: emailTemplate
    });
}

const doSendEmail = async(req, res, next, db) => {
    const { email } = req.body
    const [user] = await db.read('user', { email })

    if (!user) {
        return res.status(404).json({ message: "USER_NOT_EXISTED" });
    }
    const random32 = crypto.lib.WordArray.random(32);
    const token = crypto.MD5(random32).toString()
    const token_expired = new Date(new Date().getTime() + EXPIRED_MIN * 60000);

    await db.update('user', { user_id: user.user_id }, { $set: { token, token_expired } })

    await sendEmail(email, token, user.user_id)
    return res
        .status(200)
        .json({ message: "SEND_SUCCESS" + token });
}

const sendEmailView = (req, res, next) => {
    return res.render("send-email", {
        title: "SSO-Server | Forget password"
    });
}

// Reset password
const resetPassword = (req, res, next) => {
    const { token, id } = req.query;
    if (!token || !id) {
        return res.redirect("/");
    }

    return res.render("reset-password", {
        title: "SSO-Server | Reset password"
    });
}

const doResetPassword = async(req, res, next, db) => {
    const { id, token, password } = req.body
    const [user] = await db.read('user', { user_id: id })

    if (!user) {
        return res.status(404).json({ message: "USER_NOT_EXISTED" });
    }
    if (
        (!user.token || !user.token_expired) ||
        user.token !== token ||
        (user.token === token && (new Date()).getTime() > user.token_expired.getTime())) {
        return res.status(404).json({ message: "INVALID_TOKEN_OR_TOKEN_EXPIRED" });
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const saltedPwd = await bcrypt.hash(password, salt)
        //Update password
    await db.update('user', { user_id: user.user_id }, { $set: { password: saltedPwd, token: null, token_expired: null } })
    return res
        .status(200)
        .json({ message: "RESET_SUCCESS" });
}

const logout = (req, res) => {
    
    
    return res
        .status(200)
        .json({ message: "RESET_SUCCESS" });
}

module.exports = Object.assign({}, {
    resetPassword,
    doResetPassword,
    doLogin,
    login,
    verifySsoToken,
    register,
    doRegister,
    doSendEmail,
    sendEmailView,
    logout,
});