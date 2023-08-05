import Account from "../models/Account.js";
import Raffle from "../models/Raffle.js";
import fs from "fs";
import {
  registerValidate,
  loginValidate,
  updateValidate,
  loginAdminValidate,
} from "./validate.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { error } = registerValidate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const selectedUser = await Account.findOne({ tel: req.body.tel });

  if (selectedUser) {
    return res.status(400).send("Telefone Já cadastrado");
  }

  const user = {
    profileImage: null,
    name: req.body.name,
    cpf: req.body.cpf,
    email: req.body.email,
    tel: req.body.tel,
  };

  if (req.file) {
    user.profileImage = req.file.filename;
  }

  try {
    const newUser = await Account.create(user);

    const daysToExpire = "15d";
    const token = jwt.sign(
      { _id: newUser._id, admin: newUser.admin },
      process.env.TOKEN_SECRET,
      {
        expiresIn: daysToExpire,
      },
    );

    res.json(token);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const getUser = async (req, res) => {
  const id = req.user._id;

  if (id) {
    const user = await Account.findOne({ _id: id });
    return res.json(user);
  } else {
    return res.status(400).send("Acesso negado on controlador");
  }
};

export const updateUser = async (req, res) => {
  const { error } = updateValidate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const user = await Account.findOne({ _id: req.body.id });

  console.log(user);

  const userData = {
    profileImage: user.profileImage,
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

  if (req.file) {
    userData.profileImage = req.file.filename;
  }

  try {
    const selectedUserUpdated = await Account.findOneAndUpdate(
      { _id: req.body.id },
      userData,
      { new: true },
    );

    return res.json(selectedUserUpdated);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const login = async (req, res) => {
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

  const daysToExpire = "15d";

  const token = jwt.sign(
    { _id: selectedUser._id, admin: selectedUser.admin },
    process.env.TOKEN_SECRET,
    {
      expiresIn: daysToExpire,
    },
  );

  res.json({ token, isAdmin: false });
};

export const loginAdmin = async (req, res) => {
  const { error } = loginAdminValidate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const selectedUser = await Account.findOne({ tel: req.body.tel });

  if (!selectedUser) {
    return res.status(400).send("Usuário incorreto");
  }

  const passwordCompared = req.body.password === selectedUser.password;

  if (!passwordCompared) {
    return res.status(400).send("Usuário incorreto");
  }

  const daysToExpire = "15d";

  const token = jwt.sign(
    { _id: selectedUser._id, admin: selectedUser.admin },
    process.env.TOKEN_SECRET,
    {
      expiresIn: daysToExpire,
    },
  );

  res.json(token);
};

export const buyRaffle = async (req, res) => {
  const { id, raffleId, paymentId, pricePaid, status, numberQuant } = req.body;

  try {
    const selectedUser = await Account.findOne({ _id: id });

    if (!selectedUser) {
      return res.status(404).send("Usuário não encontrado");
    }

    const raffleSelected = await Raffle.findOne({ _id: raffleId });

    if (!raffleSelected) {
      return res.status(404).send("Rifa não encontrada");
    }

    if (
      numberQuant >
      raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers
    ) {
      return res
        .status(406)
        .send(
          "A quantidade de números passa da quantidade disponível para compra",
        );
    }

    const boughtNumbers = [];

    const usersWithRaffle = await Account.find({
      "rafflesBuyed.raffleId": raffleId,
    });

    usersWithRaffle.forEach((user) => {
      user.rafflesBuyed.forEach((raffleEntry) => {
        if (raffleEntry.raffleId.equals(raffleId)) {
          boughtNumbers.push(...raffleEntry.numbersBuyed);
        }
      });
    });

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
      } else if (quant <= 1000000) {
        arrNumbers = ["000000"];
        length = 6;
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

    const numbers = generateNumbers(raffleSelected.quantNumbers);

    const numbersAvailable = numbers.filter(
      (number) => !boughtNumbers.includes(number),
    );
    const numbersBuyed = [];

    for (let i = 0; i < numberQuant; i++) {
      const random = Math.floor(Math.random() * numbersAvailable.length);
      const chosenNumber = numbersAvailable.splice(random, 1)[0];
      numbersBuyed.push(chosenNumber);
    }

    await Raffle.findOneAndUpdate(
      { _id: raffleId },
      {
        $inc: {
          quantBuyedNumbers: numberQuant,
        },
      },
    );

    const userUpdated = await Account.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          rafflesBuyed: {
            raffleId,
            pricePaid,
            paymentId,
            status,
            numberQuant,
            numbersBuyed,
          },
        },
      },
      {
        new: true,
      },
    );

    return res.status(200).send(userUpdated);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  // testar e depois apagar
  //
  // let numbersAlreadyBuyed = [...raffleSelected.BuyedNumbers];
  //
  // numbersAlreadyBuyed = [...numbersAlreadyBuyed, ...req.body.numbersBuyed];
  //
  // try {
  //   await Raffle.findOneAndUpdate(
  //     { _id: raffleId },
  //     {
  //       $set: {
  //         NumbersAvailable: numbersAvailableToBuy,
  //         BuyedNumbers: numbersAlreadyBuyed,
  //       },
  //     },
  //   );
  // } catch (error) {
  //   return res.status(400).send(error.message);
  // }
  //
  // const alreadyBuyedNumbers = await Account.find({
  //   "rafflesBuyed.raffleId": { $eq: raffleId },
  //   _id: id,
  // });
  //
  // let actualNumbersBuyed = [];
  //
  // if (alreadyBuyedNumbers.length !== 0) {
  //   actualNumbersBuyed = [
  //     ...selectedUser.rafflesBuyed.filter(
  //       (raffle) => raffle.raffleId === raffleId,
  //     )[0].numbersBuyed,
  //   ];
  // }
  //
  // const newRaffleBuyed = {
  //   raffleId: raffleId,
  //   title: raffleSelected.title,
  //   raffleImage: raffleSelected.raffleImage,
  //   pricePaid: Number(pricePaid),
  //   paymentId: paymentId,
  //   status: status,
  //   numberQuant: Number(numberQuant),
  //   numbersBuyed:
  //     actualNumbersBuyed.length !== 0
  //       ? [...actualNumbersBuyed, ...numbersBuyed]
  //       : numbersBuyed,
  // };
  //
  // if (alreadyBuyedNumbers.length !== 0) {
  //   try {
  //     await Account.findOneAndUpdate(
  //       { _id: id },
  //       {
  //         $set: {
  //           "rafflesBuyed.$[elem].numbersBuyed": newRaffleBuyed.numbersBuyed,
  //           "rafflesBuyed.$[elem].paymentId": newRaffleBuyed.paymentId,
  //           "rafflesBuyed.$[elem].status": newRaffleBuyed.status,
  //         },
  //         $inc: {
  //           "rafflesBuyed.$[elem].numberQuant": newRaffleBuyed.numberQuant,
  //           "rafflesBuyed.$[elem].pricePaid": Number(newRaffleBuyed.pricePaid),
  //         },
  //       },
  //       {
  //         arrayFilters: [
  //           {
  //             "elem.raffleId": newRaffleBuyed.raffleId,
  //           },
  //         ],
  //       },
  //     );
  //   } catch (error) {
  //     return res.status(400).send(error.message);
  //   }
  // } else {
  //   try {
  //     await Account.findOneAndUpdate(
  //       { _id: id },
  //       {
  //         $push: {
  //           rafflesBuyed: [
  //             {
  //               raffleId: newRaffleBuyed.raffleId,
  //               title: newRaffleBuyed.title,
  //               raffleImage: newRaffleBuyed.raffleImage,
  //               pricePaid: newRaffleBuyed.pricePaid,
  //               paymentId: newRaffleBuyed.paymentId,
  //               status: newRaffleBuyed.status,
  //               numberQuant: newRaffleBuyed.numberQuant,
  //               numbersBuyed: newRaffleBuyed.numbersBuyed,
  //             },
  //           ],
  //         },
  //       },
  //     );
  //   } catch (error) {
  //     return res.status(400).send(error.message);
  //   }
  // }
  //
  // const userUpdated = await Account.findOne({ _id: id });
  //
  // res.json(userUpdated);
};

export const getBuyedNumbers = async (req, res) => {
  const { id } = req.body;

  console.log(id);

  try {
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

export const readUserBuyedNumbers = async (req, res) => {
  const { cpf } = req.params;

  const userSelected = await Account.findOne({ cpf });

  const userRafflesBuyed = userSelected.rafflesBuyed.map((raffle) => raffle);

  console.log(userSelected);

  res.send(userRafflesBuyed);
};

export const readPayment = async (req, res) => {
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
        },
      );

      return res.send(userSelected);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  } else {
    return res.status(400).send("Sem referencia");
  }
};

export const paymentCanceled = async (req, res) => {
  const { id, paymentId, raffleId } = req.query;

  let userToModify = await Account.findOne({ _id: id });

  let quantToBeRemoved = userToModify.rafflesBuyed.filter(
    (raffle) => raffle.paymentId == paymentId,
  )[0]?.numbersBuyed?.length;

  userToModify = userToModify.rafflesBuyed.filter((raffle) => {
    return raffle.raffleId !== raffleId;
  });

  if (paymentId && id && quantToBeRemoved) {
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
        },
      );

      return res.send({
        user: userSelected,
        quantToBeRemoved,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
};

export const deleteCanceledNumbers = async (req, res) => {
  try {
    await Raffle.findOneAndUpdate(
      { _id: req.body.raffleId },
      {
        $inc: {
          quantBuyedNumbers: -req.body.quantToBeRemoved,
        },
      },
    );

    return res.send();
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const updatePassword = async (req, res) => {
  const { id, actualPassword, newPassword } = req.body;

  try {
    const admin = await Account.findOne({ _id: id, admin: true });

    if (admin && actualPassword === admin.password) {
      if (actualPassword !== newPassword) {
        admin.password = newPassword;

        await admin.save();

        return res.status(200).json(admin);
      } else {
        return res.status(405).json({
          message: "Senha precisa ser diferente da que já está cadastrada",
        });
      }
    }

    return res
      .status(401)
      .json({ message: "Usuário não autorizado para alterar senha" });
  } catch (error) {
    return res.status(400).json({
      message: "Ocorreu um erro durante o processo de alteração de senha",
    });
  }
};
