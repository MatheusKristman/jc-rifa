const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
});

console.log(path.resolve("./src/resources/mail"));

transport.use(
    "compile",
    hbs({
        viewEngine: {
            extName: ".hbs",
            partialsDir: path.resolve("./src/resources/mail"),
            defaultLayout: false,
        },
        viewPath: path.resolve("./src/resources/mail"),
        extName: ".html",
    })
);

module.exports = transport;
