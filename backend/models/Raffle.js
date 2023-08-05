import mongoose from "mongoose";

const RaffleSchema = new mongoose.Schema({
  raffleImage: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  quantNumbers: { type: Number, required: true },
  quantBuyedNumbers: { type: Number, default: 0 },
  isFinished: { type: Boolean, default: false },
});

const Raffle = mongoose.model("Raffles", RaffleSchema);

export default Raffle;
