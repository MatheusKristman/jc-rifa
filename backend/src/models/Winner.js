const mongoose = require("mongoose");

const WinnerSchema = new mongoose.Schema({
    name: { type: String },
    tel: { type: String },
    email: { type: String },
    profileImage: { data: Buffer, contentType: String },
    raffleNumber: { type: String },
    raffleId: { type: String },
    raffleTitle: { type: String },
    raffleImage: { data: Buffer, contentType: String },
});

module.exports = mongoose.model("Winners", WinnerSchema);
