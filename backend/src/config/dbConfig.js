const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.set("debug", true);

const connection = mongoose
    .connect(process.env.URL_DATABASE)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

module.exports = connection;
