const express = require('express');
const router = express.Router();
const AccountController = require('./controllers/AccountController');
const auth = require('./controllers/authController');

//Rota Home
router.get('/', auth, AccountController.read);

// Rota Register
router.post('/register/registerAccount', AccountController.upload.single('profileImage') ,AccountController.create);
router.get('/register', auth, AccountController.read);
router.put('/updateRegistration/updating', AccountController.upload.single('profileImage'), AccountController.update);

//Rota Login
router.post('/login', AccountController.login);

module.exports = router;