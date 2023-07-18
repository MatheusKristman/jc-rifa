import mongoose from "mongoose";

const RaffleSchema = new mongoose.Schema({
    raffleImage: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    QuantNumbers: { type: Number, required: true },
    NumbersAvailable: { type: Array, required: true },
    BuyedNumbers: { type: Array, default: [] },
    isFinished: { type: Boolean, default: false },
});

const Raffle = mongoose.model("Raffles", RaffleSchema);

export default Raffle;
