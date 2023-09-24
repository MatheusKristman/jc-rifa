import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  profileImage: { type: String, default: null },
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  email: { type: String, required: true },
  tel: { type: String, required: true },
  password: { type: String },
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
      paymentId: { type: String },
      raffleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Raffles",
        required: true,
      },
      qrCode: { type: String },
      pricePaid: { type: Number },
      status: { type: String },
      numberQuant: { type: Number },
      numbersBuyed: { type: Array },
    },
  ],
  admin: { type: Boolean, default: false },
});

const Account = mongoose.model("Accounts", AccountSchema);

export default Account;
