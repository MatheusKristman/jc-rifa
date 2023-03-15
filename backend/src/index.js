const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");
const multer = require("multer");
const path = require("path");
const corsOptions = require("./config/corsOptions");

require("dotenv").config();
require("./config/dbConfig");
require("./config/mercadoPagoConfig");

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File too large" });
  }
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "public/data/uploads")));
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
