import express from "express";
import {
    getUser,
    readUserBuyedNumbers,
    readPayment,
    deleteCanceledNumbers,
    buyRaffle,
    login,
    loginAdmin,
    paymentCanceled,
} from "../controllers/AccountController.js";
import { auth } from "../controllers/authController.js";

const router = express.Router();

router.get("/is-user-logged", auth, getUser);
router.get("/get-raffle-numbers/:cpf", readUserBuyedNumbers);
router.post("/check-payment-status", readPayment);
router.post("/delete-canceled-numbers", deleteCanceledNumbers);
router.post("/raffle-buy", buyRaffle);
router.post("/login", login);
router.post("/login-admin", loginAdmin);
router.delete("/payment-cancel", paymentCanceled);

export default router;
