import mongoose from "mongoose";

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

const Winner = mongoose.model("Winners", WinnerSchema);

export default Winner;
