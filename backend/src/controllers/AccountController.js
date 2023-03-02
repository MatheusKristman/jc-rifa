const Account = require('../models/Account');

const fs = require('fs');
const multer = require('multer');
const { registerValidate, loginValidate } = require('./validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/data/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } });

module.exports = {
  upload: upload,
  create: async (req, res) => {
    const { error } = registerValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const selectedUser = await Account.findOne({ tel: req.body.tel });

    if (selectedUser) {
      return res.status(400).send('Telefone Já cadastrado');
    }

    console.log(req.file);

    const user = {
      profileImage: {
        data: req.file ? fs.readFileSync('./public/data/uploads/' + req.file.filename) : null,
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
      await Account.create(user);

      const selectedUser = await Account.findOne({ tel: req.body.tel });

      console.log('selectedUser' + selectedUser);
      
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
  login: async (req, res) => {
    const { error } = loginValidate(req.body);

    if (error) {
      return res.status(400).send(error.message);
    }

    const selectedUser = await Account.findOne({ tel: req.body.tel });
    if (!selectedUser) {
      return res.status(400).send('Telefone ou senha incorretos');
    }

    const passwordAndUserMatch = req.body.password === selectedUser.password;
    if (!passwordAndUserMatch) {
      console.log(selectedUser.password);
      return res.status(400).send('Telefone ou senha incorretos');
    }

    const daysToExpire = '15d';

    const token = jwt.sign({ _id: selectedUser._id, admin: selectedUser.admin }, process.env.TOKEN_SECRET, { expiresIn: daysToExpire });

    res.header('authorization-token', token);

    res.send(selectedUser);
  }
}