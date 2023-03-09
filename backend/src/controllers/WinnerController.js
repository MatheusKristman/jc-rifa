const Winner = require('../models/Winner');

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
  readAll: async (req, res) => {
    try {
      const allWinners = await Winner.find({});

      res.json(allWinners);
    } catch(error) {
      return res.status(404).send(error.message);
    }
  },
}