const { validationResult } = require("express-validator");
const pathToRegexp = require("path-to-regexp");
const { AuthValidator } = require("./auth");

// const validateRules = [
//     ...AuthValidator
// ];

const validate = async(req, res, next, validateRules) => {
    const path = req.path,
        method = req.method;
    const validateRule = validateRules.find(x => {
        if (x.method !== method) return false;
        const regexp = pathToRegexp.pathToRegexp(x.path);
        return regexp.test(path);
    });
    if (!validateRule) return next();
    try {
        for (const func of validateRule.mw) {
            await func(req, res, () => void 0);
        }
    } catch (e) {
        return next(e);
    }
    const formatter = ({ location, msg, param, value, nestedErrors }) => {
        return `[${location}]${param}: ${msg}`;
    };
    const errors = validationResult(req).formatWith(formatter);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: 400,
            msg: errors.array({ onlyFirstError: true })[0]
        });
    } else {
        return next();
    }
};

module.exports = validate;