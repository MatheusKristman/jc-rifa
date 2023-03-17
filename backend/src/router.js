const express = require("express");
const router = express.Router();
const AccountController = require("./controllers/AccountController");
const RaffleController = require("./controllers/RaffleController");
const WinnerController = require("./controllers/WinnerController");
const paymentsController = require("./controllers/paymentsController");
const auth = require("./controllers/authController");

// Rota Home
router.get("/", auth, AccountController.read);
router.get("/get-raffles", RaffleController.read);
router.post("/get-payment-data", AccountController.readPayment);
router.delete("/payment-cancel", AccountController.paymentCanceled);
router.post("/delete-canceled-numbers", AccountController.deleteCanceledNumbers);

// Rota Register
router.post("/register/registerAccount", AccountController.upload.single("profileImage"), AccountController.create);
router.get("/register", auth, AccountController.read);
router.put("/updateRegistration/updating", AccountController.upload.single("profileImage"), AccountController.update);

// Rota Update
router.get("/updateRegistration", auth, AccountController.read);

// Rota comprar rifa
router.post("/raffles/buy", AccountController.buyRaffle);

// Rota raffle selected
router.get("/raffles", auth, AccountController.read);

// Rota Login
router.post("/login", AccountController.login);

// Rota ChangePassword
router.get("/changePassword", auth, AccountController.read);
router.put("/changePassword/updating", AccountController.updatePassword);

// Rota consulta números
router.get("/query-numbers/:cpf", AccountController.readUserBuyedNumbers);
router.post("/query-numbers/winner", WinnerController.read);
router.get("/query-numbers", auth, AccountController.read);

//Rota Criar Rifa
router.post("/create-new-raffle/creating", RaffleController.upload.single("raffleImage"), RaffleController.create);
router.get("/create-new-raffle", auth, AccountController.read);
router.get("/create-new-raffle/get-raffles", RaffleController.read);

//Rota Gerenciamento Rifa
router.get("/raffle-management", auth, AccountController.read);
router.get("/raffle-management/get-raffles", RaffleController.read);

//Rota Editar Rifa
router.get("/edit-raffle/:id", RaffleController.readOne);
router.put("/edit-raffle/updating", RaffleController.upload.single("raffleImage"), RaffleController.update);
router.post("/edit-raffle/finish", RaffleController.finishRaffle);

// Rota Usuários que compraram os números
router.post("/edit-raffle/get-users", RaffleController.readBuyedNumbers);

// Rota pegar todos os ganhadores
router.get("/all-winners", WinnerController.readAll);

// Rota pegar um ganhador
router.post("/edit-raffle/winner", WinnerController.read);

// Rota deletar ganhador
router.delete("/edit-raffle/cancel/:id", WinnerController.delete);

// Rota all raffles
router.get("/raffles/get-all", RaffleController.read);

// Rota raffle selected
router.get("/raffles/:id", RaffleController.readOne);

// Rota pagamento
router.post("/payment", paymentsController.pay);

module.exports = router;
