const { body: validateBody } = require("express-validator");
const validate = require("./index")
const AuthValidator = [{
        path: "/login",
        method: "POST",
        mw: [
            validateBody("grant_type").equals("password").withMessage("must be 'password'"),
            validateBody("username").isAlphanumeric().isLength({ max: 320 }).withMessage("must be alphanumeric string length < 320"),
            validateBody("password").isMD5().withMessage("must be MD5"),
            validateBody("scope").isIn(["admin", "user"]).withMessage("must be one of 'admin', 'user'")
        ]
    },
    {
        path: "/register",
        method: "POST",
        mw: [
            validateBody("grant_type").equals("refresh_token").withMessage("must be 'refresh_token'"),
            validateBody("refresh_token").isJWT().withMessage("must be JWT")
        ]
    },
    {
        path: "/user/:id",
        method: "POST",
        mw: [
            validateBody("content").isJSON().withMessage("must be object")
        ]
    }
]

exports.modules = (req, res, next) => {
    return validate(AuthValidator)
}