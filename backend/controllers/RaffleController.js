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

  const raffle = {
    raffleImage: null,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    price: req.body.price,
    quantNumbers: req.body.quantNumbers,
  };

  if (req.file) {
    raffle.raffleImage = req.file.filename;
  }

  try {
    const raffleCreated = await Raffle.create(raffle);

    res.json(raffleCreated);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

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

export const updateRaffle = async (req, res) => {
  const { error } = updateRaffleValidate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const raffle = await Raffle.findOne({ _id: req.body.id });

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
    const selectedRaffleUpdated = await Raffle.findOneAndUpdate(
      { _id: req.body.id },
      newRaffle,
      { new: true },
    );

    return res.json(selectedRaffleUpdated);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const finishRaffle = async (req, res) => {
  const { id, number } = req.body;

  try {
    const doesWinnerExists = await Account.findOne({
      "rafflesBuyed.raffleId": id,
      "rafflesBuyed.numbersBuyed": number,
      // "rafflesBuyed.status": "approved",
    });

    console.log(doesWinnerExists);

    if (!doesWinnerExists) {
      return res
        .status(404)
        .send("Número não foi comprado, insira outro número");
    }

    await Winner.create({
      account: doesWinnerExists._id,
      raffleNumber: number,
      raffleId: id,
    });

    await Raffle.updateOne(
      { _id: id },
      {
        $set: {
          isFinished: true,
        },
      },
    );

    const newWinner = await Winner.findOne({
      account: doesWinnerExists._id,
    }).populate("account");

    const winnerCreated = {
      name: newWinner.account.name,
      tel: newWinner.account.tel,
      email: newWinner.account.email,
      profileImage: newWinner.account.profileImage,
      raffleNumber: newWinner.raffleNumber,
      winnerId: newWinner._id,
    };

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
