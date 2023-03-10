const Raffle = require("../models/Raffle");
const Account = require("../models/Account");
const { createNewRaffleValidate, updateRaffleValidate } = require("./validate");

const fs = require("fs");
const multer = require("multer");
const Winner = require("../models/Winner");

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
    const { error } = createNewRaffleValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const raffleAlreadyExists = await Raffle.findOne({ title: req.body.title });

    if (raffleAlreadyExists) {
      return res.status(400).send("Rifa já cadastrada");
    }

    function generateNumbers(quant) {
      let arrNumbers = [];
      let length = 0;

      if (quant <= 100) {
        arrNumbers.push("00");
        length = 2;
      } else if (quant <= 1000) {
        arrNumbers = ["000"];
        length = 3;
      } else if (quant <= 10000) {
        arrNumbers = ["0000"];
        length = 4;
      } else if (quant <= 100000) {
        arrNumbers = ["00000"];
        length = 5;
      }

      for (let i = 1; i < quant; i++) {
        let lastString = arrNumbers[i - 1];

        let newString = padNumber(parseInt(lastString) + 1, length);

        arrNumbers.push(newString);
      }

      return arrNumbers;
    }

    function padNumber(number, size) {
      let paddedNumber = number.toString();

      while (paddedNumber.length < size) {
        paddedNumber = "0" + paddedNumber;
      }

      return paddedNumber;
    }

    const raffle = {
      raffleImage: {
        data: req.file ? fs.readFileSync("public/data/uploads/" + req.file.filename) : null,
        contentType: req.file ? req.file.mimetype : null,
      },
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      price: req.body.price,
      QuantNumbers: req.body.QuantNumbers,
      NumbersAvailable: generateNumbers(req.body.QuantNumbers),
    };

    try {
      const raffleCreated = await Raffle.create(raffle);

      if (raffleCreated && req.file) {
        fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
        console.log("imagem removida com sucesso");
      }

      res.json(raffleCreated);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    try {
      const allRaffles = await Raffle.find({});

      res.json(allRaffles);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  readOne: async (req, res) => {
    const { id } = req.params;

    try {
      const raffleSelected = await Raffle.findOne({ _id: id });

      res.json(raffleSelected);
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
  readBuyedNumbers: async (req, res) => {
    const { id } = req.body;

    console.log(id);

    const selectedRaffle = await Raffle.findOne({ _id: id });

    try {
      await Account.updateMany(
        { "rafflesBuyed.raffleId": id },
        {
          "$set": {
            "rafflesBuyed.$.title": selectedRaffle.title,
            "rafflesBuyed.$.raffleImage": selectedRaffle.raffleImage,
          },
        }
      );
      const users = await Account.find({ "rafflesBuyed.raffleId": id });

      res.send(users);
    } catch (error) {
      console.log(error);
      res.status(404).send(error.message);
    }
  },
  update: async (req, res) => {
    const { error } = updateRaffleValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const raffle = await Raffle.findOne({ _id: req.body.id });

    console.log(raffle);

    const newRaffle = {
      raffleImage: {
        data: req.file
          ? fs.readFileSync("public/data/uploads/" + req.file.filename)
          : raffle.raffleImage.data,
        contentType: req.file ? req.file.mimetype : null,
      },
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      price: req.body.price,
    };

    try {
      const selectedRaffle = await Raffle.findOneAndUpdate({ _id: req.body.id }, newRaffle);

      if (selectedRaffle && req.file) {
        fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
        console.log("Imagem removida com sucesso");
      }

      const selectedRaffleUpdated = await Raffle.findById(req.body.id);

      return res.json(selectedRaffleUpdated);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
  finishRaffle: async (req, res) => {
    const { id, number } = req.body;

    const raffleSelected = await Raffle.findOne({ _id: id });

    const chosenNumberContainsOnRaffle = raffleSelected.BuyedNumbers.includes(number);

    if (!chosenNumberContainsOnRaffle) {
      return res.status(404).send("Número não foi comprado, insira outro número");
    }

    try {
      const winner = await Account.findOne({ "rafflesBuyed.numbersBuyed": number });

      console.log(winner);

      if (!winner) {
        return res.status(404).send("Usuário não encontrado, insira um novo número");
      }
      
      const winnerCreated = await Winner.create({
        name: winner.name,
        tel: winner.tel,
        email: winner.email,
        profileImage: winner.profileImage,
        raffleNumber: number,
        raffleId: id,
        raffleTitle: raffleSelected.title,
        raffleImage: raffleSelected.raffleImage,
      });

      res.json(winnerCreated);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  },
};
