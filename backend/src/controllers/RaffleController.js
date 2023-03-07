const Raffle = require('../models/Raffle');
const { createNewRaffleValidate } = require('./validate');

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/data/uploads/');
  },
  filename: function(req, file, cb) {
    let fileExtension = file.originalname.split('.')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
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
      return res.status(400).send('Rifa já cadastrada');
    }

    function generateNumbers(quant) {
      let arrNumbers = [];
      let length = 0;
    
      if (quant <= 100) {
        arrNumbers.push('00');
        length = 2;
      } else if (quant <= 1000) {
        arrNumbers = ['000'];
        length = 3;
      } else if (quant <= 10000) {
        arrNumbers = ['0000'];
        length = 4;
      } else if (quant <= 100000) {
        arrNumbers = ['00000'];
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
        paddedNumber = '0' + paddedNumber;
      }
    
      return paddedNumber;
    }

    const raffle = {
      raffleImage: {
        data: req.file ? fs.readFileSync('public/data/uploads/' + req.file.filename) : null,
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
        console.log('imagem removida com sucesso');
      }

      res.json(raffleCreated);
    } catch(error) {
      return res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    
    try {
      const allRaffles = await Raffle.find({});

      res.json(allRaffles);
    } catch(error) {
      res.status(400).send(error.message);
    }
  }
}