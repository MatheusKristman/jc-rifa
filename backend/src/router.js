const express = require('express');
const router = express.Router();
const AccountController = require('./controllers/AccountController');
const RaffleController = require('./controllers/RaffleController');
const auth = require('./controllers/authController');

// Rota Home
router.get('/', auth, AccountController.read);

// Rota Register
router.post('/register/registerAccount', AccountController.upload.single('profileImage') ,AccountController.create);
router.get('/register', auth, AccountController.read);
router.put('/updateRegistration/updating', AccountController.upload.single('profileImage'), AccountController.update);

// Rota Update
router.get('/updateRegistration', auth, AccountController.read);

// Rota Login
router.post('/login', AccountController.login);

// Rota ChangePassword
router.get('/changePassword', auth, AccountController.read);
router.put('/changePassword/updating', AccountController.updatePassword);

//Rota Criar Rifa
router.post('/create-new-raffle/creating', RaffleController.upload.single('raffleImage'), RaffleController.create);
router.get('/create-new-raffle', auth, AccountController.read);
router.get('/create-new-raffle/get-raffles', RaffleController.read);

//Rota Gerenciamento Rifa
router.get('/raffle-management', auth, AccountController.read);
router.get('/raffle-management/get-raffles', RaffleController.read);

module.exports = router;