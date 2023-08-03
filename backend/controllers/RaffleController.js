import Raffle from "../models/Raffle.js";
import Account from "../models/Account.js";
import Winner from "../models/Winner.js";
import { createNewRaffleValidate, updateRaffleValidate } from "./validate.js";

export const createNewRaffle = async (req, res) => {
  const { error } = createNewRaffleValidate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const raffleAlreadyExists = await Raffle.findOne({ title: req.body.title });

  if (raffleAlreadyExists) {
    return res.status(400).send("Rifa já cadastrada");
  }

  function generateNumbers(quant) {
    const length = Math.max(Math.ceil(Math.log10(quant + 1)), 2);
    const numbers = [];

    console.log(length);

    for (let i = 0; i < quant; i++) {
      numbers.push(padNumber(i, length));
    }

    return numbers;
  }

  function padNumber(number, size) {
    let paddedNumber = number.toString();

    while (paddedNumber.length < size) {
      paddedNumber = "0" + paddedNumber;
    }

    return paddedNumber;
  }

  const batchSize = 100000;
  const generatedNumbers = generateNumbers(req.body.QuantNumbers);

  const raffle = {
    raffleImage: null,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    price: req.body.price,
    QuantNumbers: req.body.QuantNumbers,
    NumbersAvailable: [],
  };

  if (req.file) {
    raffle.raffleImage = req.file.filename;
  }

  try {
    const raffleCreated = await Raffle.create(raffle);

    for (let i = 0; i < generatedNumbers.length; i += batchSize) {
      const batchStart = i;
      const batchEnd = Math.min(i + batchSize, generatedNumbers.length);
      const batchNumbers = generatedNumbers.slice(batchStart, batchEnd);

      raffleCreated.NumbersAvailable.push(...batchNumbers);

      await raffleCreated.save();
    }

    res.json(raffleCreated);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// export const createNewRaffle = async (req, res) => {
//   const { error } = createNewRaffleValidate(req.body);
//
//   if (error) {
//     return res.status(400).send(error.message);
//   }
//
//   const raffleAlreadyExists = await Raffle.findOne({ title: req.body.title });
//
//   if (raffleAlreadyExists) {
//     return res.status(400).send("Rifa já cadastrada");
//   }
//
//   async function* generateNumbers(quant, batchSize) {
//     let currentNumber = 1;
//
//     for (let i = 0; i < quant; i++) {
//       yield padNumber(currentNumber++, batchSize);
//     }
//   }
//
//   function padNumber(number, size) {
//     let paddedNumber = number.toString();
//
//     while (paddedNumber.length < size) {
//       paddedNumber = "0" + paddedNumber;
//     }
//
//     return paddedNumber;
//   }
//
//   const batchSize = 50000;
//
//   const raffle = {
//     raffleImage: null,
//     title: req.body.title,
//     subtitle: req.body.subtitle,
//     description: req.body.description,
//     price: req.body.price,
//     QuantNumbers: req.body.QuantNumbers,
//   };
//
//   if (req.file) {
//     raffle.raffleImage = req.file.filename;
//   }
//
//   try {
//     const raffleCreated = await Raffle.create(raffle);
//
//     const numGenerator = generateNumbers(req.body.QuantNumbers, batchSize);
//     let batch = [];
//
//     for await (const num of numGenerator) {
//       batch.push(num);
//
//       if (batch.length >= batchSize) {
//         await Raffle.findOneAndUpdate(
//           { _id: raffleCreated._id },
//           { $push: { NumbersAvailable: { $each: batch } } },
//         );
//         batch = [];
//       }
//     }
//
//     if (batch.length > 0) {
//       await Raffle.findOneAndUpdate(
//         { _id: raffleCreated._id },
//         { $push: { NumbersAvailable: { $each: batch } } },
//       );
//     }
//
//     res.json(raffleCreated.NumbersAvailable);
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// };

export const getAllRaffles = async (req, res) => {
  try {
    const allRaffles = await Raffle.find({});

    res.json(allRaffles);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getRaffle = async (req, res) => {
  const { id } = req.params;

  try {
    const raffleSelected = await Raffle.findOne({ _id: id });

    res.json(raffleSelected);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const getBuyedNumbers = async (req, res) => {
  const { id } = req.body;

  console.log(id);

  const selectedRaffle = await Raffle.findOne({ _id: id });

  try {
    await Account.updateMany(
      { "rafflesBuyed.raffleId": id },
      {
        $set: {
          "rafflesBuyed.$.title": selectedRaffle.title,
          "rafflesBuyed.$.raffleImage": selectedRaffle.raffleImage,
        },
      },
    );
    const users = await Account.find({
      "rafflesBuyed.raffleId": id,
      "rafflesBuyed.status": "approved",
    });

    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(404).send(error.message);
  }
};

export const updateRaffle = async (req, res) => {
  const { error } = updateRaffleValidate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const raffle = await Raffle.findOne({ _id: req.body.id });

  console.log(raffle);

  const newRaffle = {
    raffleImage: raffle.raffleImage,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    price: req.body.price,
  };

  if (req.file) {
    newRaffle.raffleImage = req.file.filename;
  }

  try {
    await Raffle.findOneAndUpdate({ _id: req.body.id }, newRaffle);

    const selectedRaffleUpdated = await Raffle.findById(req.body.id);

    return res.json(selectedRaffleUpdated);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const finishRaffle = async (req, res) => {
  const { id, number } = req.body;

  const raffleSelected = await Raffle.findOne({ _id: id });

  const chosenNumberContainsOnRaffle =
    raffleSelected.BuyedNumbers.includes(number);

  if (!chosenNumberContainsOnRaffle) {
    return res.status(404).send("Número não foi comprado, insira outro número");
  }

  try {
    const winner = await Account.findOne({
      "rafflesBuyed.numbersBuyed": number,
      "rafflesBuyed.status": "approved",
    });

    console.log(winner);

    if (!winner) {
      return res
        .status(404)
        .send("Usuário não encontrado, insira um novo número");
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

    await Raffle.updateOne(
      { _id: id },
      {
        $set: {
          isFinished: true,
        },
      },
    );

    res.json(winnerCreated);
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

export const deleteRaffle = async (req, res) => {
  const { id } = req.params;

  try {
    await Raffle.deleteOne({ _id: id });

    const raffles = await Raffle.find();

    return res.status(200).json(raffles);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
