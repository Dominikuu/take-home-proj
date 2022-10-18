const express = require("express");

const controller = require("../controller");


function createRouter(dependencies) {
    const { db } = dependencies;
    if (!db) {
        throw new Error('db is empty');
    }
    const router = express.Router();

    router.get("/compensation_data", async(req, res, next) => { controller.listAllSalary(req, res, next, await db)})
    router.get("/compensation_data/:id", async(req, res, next) => { controller.findOneSalary(req, res, next, await db)})

    return router
}

module.exports = { createRouter };