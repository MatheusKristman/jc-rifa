import Winner from "../models/Winner.js";
import Raffle from "../models/Raffle.js";

export const getWinner = async (req, res) => {
    const { title } = req.body;

    console.log(title);

    const winnerExist = await Winner.findOne({ raffleTitle: title });

    if (!winnerExist) {
        return res.status(404).send("Nenhum ganhador foi encontrado");
    }

    return res.json(winnerExist);
};

export const getAllWinners = async (req, res) => {
    try {
        const allWinners = await Winner.find({});

        res.json(allWinners);
    } catch (error) {
        return res.status(404).send(error.message);
    }
};

export const deleteWinner = async (req, res) => {
    const { id } = req.params;

    console.log(id);

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

        console.log(selectedWinner);

        res.send(true);
    } catch (error) {
        res.status(400).error(error.message);
    }
};
