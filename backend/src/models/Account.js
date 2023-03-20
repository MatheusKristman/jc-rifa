const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  profileImage: { data: Buffer, contentType: String },
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tel: { type: String, required: true },
  cep: { type: String },
  address: { type: String },
  number: { type: String },
  neighborhood: { type: String },
  complement: { type: String },
  uf: { type: String },
  city: { type: String },
  reference: { type: String },
  rafflesBuyed: [
    {
      paymentId: String,
      raffleId: String,
      title: String,
      raffleImage: { data: Buffer, contentType: String },
      pricePaid: { type: Number },
      status: { type: String },
      numberQuant: { type: Number },
      numbersBuyed: [String],
    },
  ],
  admin: { type: Boolean, default: false },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
});

module.exports = mongoose.model("Accounts", AccountSchema);
