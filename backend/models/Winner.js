import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  raffleNumber: { type: String },
  raffleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Raffles",
    required: true,
  },
});

const Winner = mongoose.model("Winners", WinnerSchema);

export default Winner;
