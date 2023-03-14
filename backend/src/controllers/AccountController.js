const Account = require('../models/Account');
const Raffle = require('../models/Raffle');

const fs = require('fs');
const multer = require('multer');
const { registerValidate, loginValidate, updateValidate, updatePasswordValidate } = require('./validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/data/uploads/');
  },
  filename: function (req, file, cb) {
    let fileExtension = file.originalname.split('.')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
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
      return res.status(400).send('Telefone Já cadastrado');
    }

    const user = {
      profileImage: {
        data: req.file ? fs.readFileSync('public/data/uploads/' + req.file.filename) : null,
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
        console.log('imagem removida com sucesso');
      }

      const selectedUser = await Account.findOne({ tel: req.body.tel });

      // console.log('selectedUser' + selectedUser);
      
      const daysToExpire = '15d';
      const token = jwt.sign({ _id: selectedUser._id, admin: selectedUser.admin }, process.env.TOKEN_SECRET, { expiresIn: daysToExpire });
      
      console.log(token);

      res.json(token);
    } catch(error) {
      return res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    const id = req.user._id;

    if (id) {
      const user = await Account.findOne({ _id: id });
      return res.json(user);

    } else {
      return res.status(400).send('Acesso negado on controlador');
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
        data: req.file ? fs.readFileSync('public/data/uploads/' + req.file.filename) : user.profileImage.data,
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
    }
    console.log(userData);

    try {
      const selectedUser = await Account.findOneAndUpdate({ _id: req.body.id }, userData);

      if (selectedUser && req.file) {
        fs.unlinkSync(`public/data/uploads/${req.file.filename}`);
        console.log('imagem removida com sucesso');
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
      return res.status(401).send('Senha incorreta');
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
      return res.status(400).send('Telefone ou senha incorretos');
    }    

    const passwordAndUserMatch = bcrypt.compareSync(req.body.password, selectedUser.password);
    console.log(passwordAndUserMatch);

    if (!passwordAndUserMatch) {
      console.log(selectedUser.password);
      return res.status(400).send('Telefone ou senha incorretos');
    }

    console.log('passou validação')

    const daysToExpire = '15d';

    const token = jwt.sign({ _id: selectedUser._id, admin: selectedUser.admin }, process.env.TOKEN_SECRET, { expiresIn: daysToExpire });

    res.json(token);
  },
  buyRaffle: async (req, res) => {
    const { id, raffleId } = req.body;

    const selectedUser = await Account.findOne({ _id: id });

    if (!selectedUser) {
      return res.status(404).send('Usuário não encontrado');
    }

    const raffleSelected = await Raffle.findOne({ _id: raffleId });
    
    if (!raffleSelected) {
      return res.status(404).send('Rifa não encontrada');
    }    

    const newNumbersBuyed = [...raffleSelected.BuyedNumbers, ...req.body.numbersBuyed];

    console.log(req.body.numbersAvailable.length);

    try {
      await Raffle.findOneAndUpdate({ _id: raffleId }, { NumbersAvailable: req.body.numbersAvailable, BuyedNumbers: newNumbersBuyed });
    } catch (error) {
      return res.status(400).send(error.message);
    }

    let actualNumberQuant = 0;
    let actualNumbersBuyed = [];

    const alreadyBuyedNumbers = await Account.find({ "rafflesBuyed.raffleId": { "$eq": raffleSelected._id }, _id: id });

    if (alreadyBuyedNumbers.length !== 0) {
      console.log('achou');
      actualNumberQuant = alreadyBuyedNumbers[0].rafflesBuyed[0].numberQuant;
      actualNumbersBuyed = [...alreadyBuyedNumbers[0].rafflesBuyed[0].numbersBuyed];
    }
    
    const newRaffleBuyed = {
      raffleId,
      title: raffleSelected.title,
      raffleImage: raffleSelected.raffleImage,
      pricePaid: req.body.pricePaid,
      status: req.body.status,
      numberQuant: actualNumberQuant !== 0 ? actualNumberQuant + req.body.numberQuant : req.body.numberQuant,
      numbersBuyed: actualNumbersBuyed.length !== 0 ? [...actualNumbersBuyed, ...req.body.numbersBuyed] : req.body.numbersBuyed,
    }

    if (alreadyBuyedNumbers.length !== 0) {
      try {        
        await Account.updateOne({ _id: id, "rafflesBuyed.raffleId": raffleSelected._id }, {
          "$set": {
            "rafflesBuyed.$": {
              raffleId: newRaffleBuyed.raffleId,
              title: newRaffleBuyed.title,
              raffleImage: newRaffleBuyed.raffleImage,
              pricePaid: newRaffleBuyed.pricePaid,
              status: newRaffleBuyed.status,
              numberQuant: newRaffleBuyed.numberQuant,
              numbersBuyed: newRaffleBuyed.numbersBuyed,
            }
          }
        });
      } catch (error) {
        return res.status(400).send('erro com atualização');
      }
    } else {
      try {
        await Account.findOneAndUpdate({ _id: id }, {
          "$push": {
            rafflesBuyed: [
              {
                raffleId: newRaffleBuyed.raffleId,
                title: newRaffleBuyed.title,
                raffleImage: newRaffleBuyed.raffleImage,
                pricePaid: newRaffleBuyed.pricePaid,
                status: newRaffleBuyed.status,
                numberQuant: newRaffleBuyed.numberQuant,
                numbersBuyed: newRaffleBuyed.numbersBuyed
              }
            ]
          }
        });
      } catch(error) {
        return res.status(400).send('erro com adição');
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
}