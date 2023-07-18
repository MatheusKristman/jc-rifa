import Raffle from "../models/Raffle.js";
import Account from "../models/Account.js";
import Winner from "../models/Winner.js";
import fs from "fs";
import { createNewRaffleValidate, updateRaffleValidate } from "./validate.js";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const MAX_FILE_SIZE = 17825792;

export const createNewRaffle = async (req, res) => {
    const { error } = createNewRaffleValidate(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    const raffleAlreadyExists = await Raffle.findOne({ title: req.body.title });

    if (raffleAlreadyExists) {
        return res.status(400).send("Rifa já cadastrada");
    }

    function* generateNumbers(quant) {
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
        } else if (quant <= 1000000) {
            arrNumbers = ["000000"];
            length = 6;
        }

        for (let i = 1; i < quant; i++) {
            let lastString = arrNumbers[i - 1];

            let newString = padNumber(parseInt(lastString) + 1, length);

            arrNumbers.push(newString);

            yield newString;
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
            data: null,
            contentType: null,
        },
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description,
        price: req.body.price,
        QuantNumbers: req.body.QuantNumbers,
        NumbersAvailable: [...generateNumbers(req.body.QuantNumbers)],
    };

    if (req.file) {
        const fileSize = req.file.size;

        if (fileSize > MAX_FILE_SIZE) {
            return res.status(400).send("O tamanho do arquivo excede o limite permitido");
        }

        try {
            raffle.raffleImage.data = await readFileAsync(req.file.path);
            raffle.raffleImage.contentType = req.file.mimetype;

            fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
            console.log("imagem removida com sucesso");
        } catch (error) {
            return res.status(400).send("Erro ao processar o arquivo de imagem");
        }
    }

    try {
        const raffleCreated = await Raffle.create(raffle);

        console.log(req.file.path);

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
};

export const finishRaffle = async (req, res) => {
    const { id, number } = req.body;

    const raffleSelected = await Raffle.findOne({ _id: id });

    const chosenNumberContainsOnRaffle = raffleSelected.BuyedNumbers.includes(number);

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
