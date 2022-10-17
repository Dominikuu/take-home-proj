const validate = require("../middlewares/validator");
const express = require("express");

const controller = require("../controller");


function createRouter(dependencies) {
    const { db } = dependencies;
    if (!db) {
        throw new Error('db is empty');
    }
    const router = express.Router();

    router
        .route("/login")
        .get(controller.login)
        .post([validate], async(req, res, next) => { controller.doLogin(req, res, next, await db) });
    router.get("/verify-token", async(req, res, next) => { controller.verifySsoToken(req, res, next, await db)});
    router.get("/logout", controller.logout);
    router.route("/register").get(controller.register).post(async(req, res, next) => { controller.doRegister(req, res, next, await db) });
    router.route("/send-email").get(controller.sendEmailView).post(async(req, res, next) => { controller.doSendEmail(req, res, next, await db) });
    router.route("/reset-password").get(controller.resetPassword).post(async(req, res, next) => { controller.doResetPassword(req, res, next, await db) });

    // Social login
    // router.get('/auth/facebook', controller.getFbLogin)
    // router.get('/auth/facebook/callback', controller.handleFacebookLogin)
    // router.get('/auth/google', controller.getGoogleLogin)
    // router.get('/auth/google/callback', controller.handleGoogleLogin)
    // router.get('/auth/microsoft', controller.getMicrosoftLogin)
    // router.get('/auth/microsoft/callback', controller.handleMicrosoftLogin)

    return router
}

module.exports = { createRouter };