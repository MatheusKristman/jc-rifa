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

// Rota Update
router.get('/updateRegistration', auth, AccountController.read);

//Rota Login
router.post('/login', AccountController.login);

//Rota ChangePassword
router.get('/changePassword', auth, AccountController.read);
router.put('/changePassword/updating', AccountController.updatePassword);

module.exports = router;