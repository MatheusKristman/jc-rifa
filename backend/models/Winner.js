import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  raffleNumber: { type: String },
  raffleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Raffle",
    required: true,
  },
});

const Winner = mongoose.model("Winners", WinnerSchema);

export default Winner;
