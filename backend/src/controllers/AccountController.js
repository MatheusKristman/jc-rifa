const Account = require("../models/Account");
const Raffle = require("../models/Raffle");

const fs = require("fs");
const multer = require("multer");
const {
  registerValidate,
  loginValidate,
  updateValidate,
  loginAdminValidate,
} = require("./validate");
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

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

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
        data: req.file
          ? fs.readFileSync("public/data/uploads/" + req.file.filename)
          : null,
        contentType: req.file ? req.file.mimetype : null,
      },
      name: req.body.name,
      cpf: req.body.cpf,
      email: req.body.email,
      tel: req.body.tel,
    };

    try {
      const userCreated = await Account.create(user);

      if (userCreated && req.file) {
        fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
        console.log("imagem removida com sucesso");
      }

      const selectedUser = await Account.findOne({ tel: req.body.tel });

      const daysToExpire = "15d";
      const token = jwt.sign(
        { _id: selectedUser._id, admin: selectedUser.admin },
        process.env.TOKEN_SECRET,
        {
          expiresIn: daysToExpire,
        }
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
        contentType: req.file
          ? req.file.mimetype
          : user.profileImage.contentType,
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
      const selectedUser = await Account.findOneAndUpdate(
        { _id: req.body.id },
        userData
      );

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
  login: async (req, res) => {
    const { error } = loginValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const selectedUser = await Account.findOne({ tel: req.body.tel });
    if (!selectedUser) {
      return res.status(400).send("Usuário incorreto");
    }

    if (selectedUser.admin) {
      return res.status(200).json({ isAdmin: true });
    }

    console.log("passou validação");

    const daysToExpire = "15d";

    const token = jwt.sign(
      { _id: selectedUser._id, admin: selectedUser.admin },
      process.env.TOKEN_SECRET,
      {
        expiresIn: daysToExpire,
      }
    );

    res.json({ token, isAdmin: false });
  },
  loginAdmin: async (req, res) => {
    const { error } = loginAdminValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const selectedUser = await Account.findOne({ tel: req.body.tel });

    if (!selectedUser) {
      return res.status(400).send("Usuário incorreto");
    }

    const passwordCompared = req.body.password === selectedUser.password;

    console.log("db: " + selectedUser.password);
    console.log("body: " + req.body.password);

    if (!passwordCompared) {
      return res.status(400).send("Usuário incorreto");
    }

    const daysToExpire = "15d";

    const token = jwt.sign(
      { _id: selectedUser._id, admin: selectedUser.admin },
      process.env.TOKEN_SECRET,
      {
        expiresIn: daysToExpire,
      }
    );

    res.json(token);
  },
  buyRaffle: async (req, res) => {
    const {
      id,
      raffleId,
      paymentId,
      numbersAvailableToBuy,
      numbersBuyed,
      pricePaid,
      status,
      numberQuant,
    } = req.body;

    console.log("req.body: ", req.body);

    const selectedUser = await Account.findOne({ _id: id });

    if (!selectedUser) {
      return res.status(404).send("Usuário não encontrado");
    }

    const raffleSelected = await Raffle.findOne({ _id: raffleId });

    if (!raffleSelected) {
      return res.status(404).send("Rifa não encontrada");
    }

    let numbersAlreadyBuyed = [...raffleSelected.BuyedNumbers];

    numbersAlreadyBuyed = [...numbersAlreadyBuyed, ...req.body.numbersBuyed];

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
        ...selectedUser.rafflesBuyed.filter(
          (raffle) => raffle.raffleId === raffleId
        )[0].numbersBuyed,
      ];
    }

    const newRaffleBuyed = {
      raffleId: raffleId,
      title: raffleSelected.title,
      raffleImage: raffleSelected.raffleImage,
      pricePaid: Number(pricePaid),
      paymentId: paymentId,
      status: status,
      numberQuant: Number(numberQuant),
      numbersBuyed:
        actualNumbersBuyed.length !== 0
          ? [...actualNumbersBuyed, ...numbersBuyed]
          : numbersBuyed,
    };

    if (alreadyBuyedNumbers.length !== 0) {
      try {
        await Account.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              "rafflesBuyed.$[elem].numbersBuyed": newRaffleBuyed.numbersBuyed,
              "rafflesBuyed.$[elem].paymentId": newRaffleBuyed.paymentId,
              "rafflesBuyed.$[elem].status": newRaffleBuyed.status,
            },
            $inc: {
              "rafflesBuyed.$[elem].numberQuant": newRaffleBuyed.numberQuant,
              "rafflesBuyed.$[elem].pricePaid": Number(
                newRaffleBuyed.pricePaid
              ),
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
        await Account.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              rafflesBuyed: [
                {
                  raffleId: newRaffleBuyed.raffleId,
                  title: newRaffleBuyed.title,
                  raffleImage: newRaffleBuyed.raffleImage,
                  pricePaid: newRaffleBuyed.pricePaid,
                  paymentId: newRaffleBuyed.paymentId,
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
    const paymentId = req.body.paymentId;
    const id = req.body.id;
    const status = req.body.status;

    if (paymentId && id) {
      try {
        const userSelected = await Account.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              "rafflesBuyed.$[elem].status": status,
            },
          },
          {
            arrayFilters: [
              {
                "elem.paymentId": paymentId,
              },
            ],
            new: true,
          }
        );

        return res.send(userSelected);
      } catch (error) {
        return res.status(404).send(error.message);
      }
    } else {
      return res.status(400).send("Sem referencia");
    }
  },
  paymentCanceled: async (req, res) => {
    const { id, paymentId, raffleId } = req.query;

    let userToModify = await Account.findOne({ _id: id });

    let newNumbersAvailable = userToModify.rafflesBuyed.filter(
      (raffle) => raffle.raffleId == raffleId
    )[0]?.numbersBuyed;

    userToModify = userToModify.rafflesBuyed.filter((raffle) => {
      return raffle.raffleId !== raffleId;
    });

    if (paymentId && id && newNumbersAvailable) {
      try {
        const userSelected = await Account.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              rafflesBuyed: userToModify,
            },
          },
          {
            new: true,
          }
        );

        return res.send({
          user: userSelected,
          rafflesBuyed: newNumbersAvailable,
        });
      } catch (error) {
        return res.status(400).send(error.message);
      }
    }
  },
  deleteCanceledNumbers: async (req, res) => {
    try {
      await Raffle.findOneAndUpdate(
        { _id: req.body.raffleId },
        {
          $set: {
            NumbersAvailable: req.body.numbersAvailableFromRaffle,
            BuyedNumbers: req.body.numbersBuyedFromRaffle,
          },
        }
      );

      return res.send();
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
