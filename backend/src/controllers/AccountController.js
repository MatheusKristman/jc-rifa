const Account = require("../models/Account");
const Raffle = require("../models/Raffle");

const fs = require("fs");
const multer = require("multer");
const {
  registerValidate,
  loginValidate,
  updateValidate,
  updatePasswordValidate,
} = require("./validate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/data/uploads/");
  },
  filename: function (req, file, cb) {
    let fileExtension = file.originalname.split(".")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } });

module.exports = {
  upload,
  create: async (req, res) => {
    const { error } = registerValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const selectedUser = await Account.findOne({ tel: req.body.tel });

    if (selectedUser) {
      return res.status(400).send("Telefone Já cadastrado");
    }

    const user = {
      profileImage: {
        data: req.file ? fs.readFileSync("public/data/uploads/" + req.file.filename) : null,
        contentType: req.file ? req.file.mimetype : null,
      },
      name: req.body.name,
      cpf: req.body.cpf,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      tel: req.body.tel,
      cep: req.body.cep,
      address: req.body.address,
      number: req.body.number,
      neighborhood: req.body.neighborhood,
      complement: req.body.complement,
      uf: req.body.uf,
      city: req.body.city,
      reference: req.body.reference,
    };

    try {
      const userCreated = await Account.create(user);

      if (userCreated && req.file) {
        fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
        console.log("imagem removida com sucesso");
      }

      const selectedUser = await Account.findOne({ tel: req.body.tel });

      // console.log('selectedUser' + selectedUser);

      const daysToExpire = "15d";
      const token = jwt.sign(
        { _id: selectedUser._id, admin: selectedUser.admin },
        process.env.TOKEN_SECRET,
        { expiresIn: daysToExpire }
      );

      console.log(token);

      res.json(token);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    const id = req.user._id;

    if (id) {
      const user = await Account.findOne({ _id: id });
      return res.json(user);
    } else {
      return res.status(400).send("Acesso negado on controlador");
    }
  },
  update: async (req, res) => {
    const { error } = updateValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const user = await Account.findOne({ _id: req.body.id });

    console.log(user);

    const userData = {
      profileImage: {
        data: req.file
          ? fs.readFileSync("public/data/uploads/" + req.file.filename)
          : user.profileImage.data,
        contentType: req.file ? req.file.mimetype : user.profileImage.contentType,
      },
      name: req.body.name,
      email: req.body.email,
      tel: req.body.tel,
      cpf: req.body.cpf,
      cep: req.body.cep,
      address: req.body.address,
      number: req.body.number,
      neighborhood: req.body.neighborhood,
      complement: req.body.complement,
      uf: req.body.uf,
      city: req.body.city,
      reference: req.body.reference,
    };
    console.log(userData);

    try {
      const selectedUser = await Account.findOneAndUpdate({ _id: req.body.id }, userData);

      if (selectedUser && req.file) {
        fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
        console.log("imagem removida com sucesso");
      }

      const selectedUserUpdated = await Account.findById(req.body.id);

      return res.json(selectedUserUpdated);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
  updatePassword: async (req, res) => {
    const { error } = updatePasswordValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const id = req.body.id;

    const selectedUser = await Account.findOne({ _id: id });

    const passwordMatch = bcrypt.compareSync(req.body.password, selectedUser.password);

    console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).send("Senha incorreta");
    }

    try {
      await Account.updateOne({ _id: id }, { password: bcrypt.hashSync(req.body.newPassword, 10) });

      const userUpdated = await Account.findOne({ _id: id });

      return res.json(userUpdated);
    } catch (error) {
      res.status(409).send(error.message);
    }
  },
  login: async (req, res) => {
    const { error } = loginValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const selectedUser = await Account.findOne({ tel: req.body.tel });
    if (!selectedUser) {
      return res.status(400).send("Telefone ou senha incorretos");
    }

    const passwordAndUserMatch = bcrypt.compareSync(req.body.password, selectedUser.password);
    console.log(passwordAndUserMatch);

    if (!passwordAndUserMatch) {
      console.log(selectedUser.password);
      return res.status(400).send("Telefone ou senha incorretos");
    }

    console.log("passou validação");

    const daysToExpire = "15d";

    const token = jwt.sign(
      { _id: selectedUser._id, admin: selectedUser.admin },
      process.env.TOKEN_SECRET,
      { expiresIn: daysToExpire }
    );

    res.json(token);
  },
  buyRaffle: async (req, res) => {
    const { id, raffleId } = req.body;

    const selectedUser = await Account.findOne({ _id: id });

    if (!selectedUser) {
      return res.status(404).send("Usuário não encontrado");
    }

    const raffleSelected = await Raffle.findOne({ _id: raffleId });
    console.log(
      "🚀 ~ file: AccountController.js:217 ~ buyRaffle: ~ raffleSelected:",
      raffleSelected
    );

    if (!raffleSelected) {
      return res.status(404).send("Rifa não encontrada");
    }

    const numbersAvailableToBuy = [...raffleSelected.NumbersAvailable];
    console.log(
      "🚀 ~ file: AccountController.js:223 ~ buyRaffle: ~ numbersAvailableToBuy:",
      numbersAvailableToBuy
    );
    let numbersAlreadyBuyed = [...raffleSelected.BuyedNumbers];
    let numbersBuyed = [];

    for (let i = 0; i < req.body.numberQuant; i++) {
      const random = Math.floor(Math.random() * numbersAvailableToBuy.length);
      const chosenNumber = numbersAvailableToBuy.splice(random, 1)[0];
      numbersBuyed.push(chosenNumber);
    }
    console.log("🚀 ~ file: AccountController.js:237 ~ buyRaffle: ~ numbersBuyed:", numbersBuyed);
    console.log(
      "🚀 ~ file: AccountController.js:223 ~ buyRaffle: ~ numbersAvailableToBuy:",
      numbersAvailableToBuy
    );

    numbersAlreadyBuyed = [...numbersAlreadyBuyed, ...numbersBuyed];

    try {
      await Raffle.findOneAndUpdate(
        { _id: raffleId },
        {
          $set: {
            NumbersAvailable: numbersAvailableToBuy,
            BuyedNumbers: numbersAlreadyBuyed,
          },
        }
      );
    } catch (error) {
      return res.status(400).send(error.message);
    }

    const alreadyBuyedNumbers = await Account.find({
      "rafflesBuyed.raffleId": { $eq: raffleId },
      _id: id,
    });

    let actualNumbersBuyed = [];

    if (alreadyBuyedNumbers.length !== 0) {
      actualNumbersBuyed = [
        ...selectedUser.rafflesBuyed.filter((raffle) => raffle.raffleId === raffleId)[0]
          .numbersBuyed,
      ];

      console.log(
        "🚀 ~ file: AccountController.js:262 ~ buyRaffle: ~ actualNumbersBuyed:",
        actualNumbersBuyed
      );
    }

    const newRaffleBuyed = {
      raffleId: raffleId,
      title: raffleSelected.title,
      raffleImage: raffleSelected.raffleImage,
      pricePaid: Number(req.body.pricePaid) * Number(req.body.numberQuant),
      status: req.body.status,
      numberQuant: Number(req.body.numberQuant),
      numbersBuyed:
        actualNumbersBuyed.length !== 0 ? [...actualNumbersBuyed, ...numbersBuyed] : numbersBuyed,
    };
    console.log(
      "🚀 ~ file: AccountController.js:285 ~ buyRaffle: ~ newRaffleBuyed:",
      newRaffleBuyed.numberQuant
    );
    console.log(
      "🚀 ~ file: AccountController.js:285 ~ buyRaffle: ~ newRaffleBuyed:",
      newRaffleBuyed.numbersBuyed
    );

    if (alreadyBuyedNumbers.length !== 0) {
      try {
        console.log("rodando atualização");
        await Account.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              "rafflesBuyed.$[elem].numbersBuyed": newRaffleBuyed.numbersBuyed,
            },
            $inc: {
              "rafflesBuyed.$[elem].numberQuant": newRaffleBuyed.numberQuant,
              "rafflesBuyed.$[elem].pricePaid": Number(newRaffleBuyed.pricePaid),
            },
          },
          {
            arrayFilters: [
              {
                "elem.raffleId": newRaffleBuyed.raffleId,
              },
            ],
          }
        );
      } catch (error) {
        return res.status(400).send(error.message);
      }
    } else {
      try {
        console.log("rodando adição");
        await Account.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              rafflesBuyed: [
                {
                  paymentId: req.body.paymentId,
                  raffleId: newRaffleBuyed.raffleId,
                  title: newRaffleBuyed.title,
                  raffleImage: newRaffleBuyed.raffleImage,
                  pricePaid: newRaffleBuyed.pricePaid,
                  status: newRaffleBuyed.status,
                  numberQuant: newRaffleBuyed.numberQuant,
                  numbersBuyed: newRaffleBuyed.numbersBuyed,
                },
              ],
            },
          }
        );
      } catch (error) {
        return res.status(400).send(error.message);
      }
    }

    const userUpdated = await Account.findOne({ _id: id });

    res.json(userUpdated);
  },
  readUserBuyedNumbers: async (req, res) => {
    const { cpf } = req.params;

    const userSelected = await Account.findOne({ cpf });

    const userRafflesBuyed = userSelected.rafflesBuyed.map((raffle) => raffle);

    console.log(userSelected);

    res.send(userRafflesBuyed);
  },
  readPayment: async (req, res) => {
    const paymentId = req.query.collection_id;
    const id = req.query.external_reference;

    const alreadyHavePaymentId = await Account.findOne({ "rafflesBuyed.paymentId": paymentId });

    if (paymentId && id !== "null") {
      try {
        return res.send(paymentId);
      } catch (error) {
        return res.status(404).send(error.message);
      }
    } else {
      return res.status(400).send("Sem referencia");
    }
  },
};
