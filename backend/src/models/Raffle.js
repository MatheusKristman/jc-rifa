const mongoose = require('mongoose');

const RaffleSchema = new mongoose.Schema({
  raffleImage: { data: Buffer, contentType: String },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  price: { type: String },
  QuantNumbers: { type: Number },
  NumbersAvailable: { type: Array },
  BuyedNumbers: { type: Array, default: [] },
  isFinished: { type: Boolean, default: false },
});

module.exports = mongoose.model('Raffles', RaffleSchema);