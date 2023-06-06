const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./config/dbConfig");
require("./config/mercadoPagoConfig");

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File too large" });
  }
  next();
});
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/data/uploads"))
);
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
