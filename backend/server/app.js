
const express = require("express");
const {PostgresSqlDao} = require("./service/postgresqldao")
const { createRouter: createRootRouter } = require('./router');
const app = express();

const client = new PostgresSqlDao({connectTo:{
  password: "password",
  user: "admin",
  host: "postgres",
  port: 5432,
  database: "pi-coin"
}})

const indexRouter = createRootRouter({ db: client });

app.use(express.static("public"));
app.use("/", indexRouter);


module.exports = app;
