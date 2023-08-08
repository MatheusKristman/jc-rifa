import Winner from "../models/Winner.js";
import Raffle from "../models/Raffle.js";

export const getWinner = async (req, res) => {
  const { raffleId } = req.body;

  const winnerExist = await Winner.findOne({ raffleId }).populate("account");

  if (!winnerExist) {
    return res.status(404).send("Nenhum ganhador foi encontrado");
  }

  const winner = {
    name: winnerExist.account.name,
    tel: winnerExist.account.tel,
    email: winnerExist.account.email,
    profileImage: winnerExist.account.profileImage,
    raffleNumber: winnerExist.raffleNumber,
    winnerId: winnerExist._id,
  };

  return res.json(winner);
};

export const getAllWinners = async (req, res) => {
  try {
    const getAllWinners = await Winner.find({})
      .populate("account")
      .populate("raffleId");

    if (getAllWinners.length === 0) {
      return res.status(404).send("Nenhum ganhado encontrado");
    }

    const allWinners = getAllWinners.map((winner) => ({
      name: winner.account.name,
      tel: winner.account.tel,
      email: winner.account.email,
      profileImage: winner.account.profileImage,
      raffleNumber: winner.raffleNumber,
      raffleTitle: winner.raffleId.title,
      raffleImage: winner.raffleId.raffleImage,
    }));

    res.json(allWinners);
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

export const deleteWinner = async (req, res) => {
  const { id } = req.params;

  try {
    const selectedWinner = await Winner.findOne({ _id: id });

    await Raffle.updateOne(
      { _id: selectedWinner.raffleId },
      {
        $set: {
          isFinished: false,
        },
      },
    );

    const winnerDeleted = await Winner.deleteOne({ _id: id });

    if (!winnerDeleted) {
      return res.status(400).send("Erro ao deletar ganhador");
    }

    res.send(true);
  } catch (error) {
    res.status(400).error(error.message);
  }
};
