const express = require('express');
const router = express.Router();
const AccountController = require('./controllers/AccountController');
const auth = require('./controllers/authController');

// Rota Register
router.post('/register/registerAccount', AccountController.upload.single('profileImage') ,AccountController.create);
router.get('/register', auth, AccountController.read);

//Rota Login
router.post('/login', AccountController.login);

module.exports = router;