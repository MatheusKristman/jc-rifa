const Winner = require("../models/Winner");

const fs = require("fs");
const multer = require("multer");
const Raffle = require("../models/Raffle");

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
    read: async (req, res) => {
        const { title } = req.body;

        console.log(title);

        const winnerExist = await Winner.findOne({ raffleTitle: title });

        if (!winnerExist) {
            return res.status(404).send("Nenhum ganhador foi encontrado");
        }

        return res.json(winnerExist);
    },
    readAll: async (req, res) => {
        try {
            const allWinners = await Winner.find({});

            res.json(allWinners);
        } catch (error) {
            return res.status(404).send(error.message);
        }
    },
    delete: async (req, res) => {
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
                }
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
    },
};
