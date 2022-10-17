const express = require("express");
const createError = require('http-errors');
const morgan = require("morgan");
const engine = require("ejs-mate");
const { createRouter: createRootRouter } = require('./router');

const { PostgresSqlDao} = require('./service/postgresqldao')

const cors = require('cors');
// var whitelist = ['http://localhost:3000', 'http://example2.com']
// var corsOptions = {
//     origin: function (origin, callback) {
//         console.log(origin)
//       if (whitelist.includes(origin)) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
//   }
const flash = require('express-flash-messages');
require('dotenv').config();

const app = express();
// DB connection
const url = 'mongodb://unitik:90699920@authdb:27017/auth';
const db =  PostgresSqlDao('pi-coin')
console.log(db)

const indexRouter = createRootRouter({ db });

app.use((req, res, next) => {
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/public", express.static('public'))

app.use(flash());

app.use("/api", indexRouter);
app.get("/", (req, res, next) => {
    const user = req.session.user || req.user && req.user.displayName;
    if (!user) {
        return res.redirect('/simplesso/login')
    }
    res.render("index", {
        what: `SSO-Server ${user}`,
        title: "SSO-Server | Home",
    });
});

app.use((req, res, next) => {
    // catch 404 and forward to error handler
    next(createError(404));
});

app.use((err, req, res, next) => {
    console.error(err.status, {
        message: err.message,
        error: err,
    });
    const statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (statusCode === 500) {
        message = "Internal Server Error";
    }
    res.status(statusCode).json({ message });
});

module.exports = app;