import express from "express";
import {
  getUser,
  readUserBuyedNumbers,
  readPayment,
  getPayment,
  deleteCanceledNumbers,
  buyRaffle,
  getBuyedNumbers,
  login,
  loginAdmin,
  paymentCanceled,
  updatePassword,
} from "../controllers/AccountController.js";
import { auth } from "../controllers/authController.js";

const router = express.Router();

router.get("/is-user-logged", auth, getUser);
router.get("/get-raffle-numbers/:cpf", readUserBuyedNumbers);
router.post("/check-payment-status", readPayment);
router.post("/get-payment", getPayment);
router.post("/delete-canceled-numbers", deleteCanceledNumbers);
router.post("/update-password", updatePassword);
router.post("/raffle-buy", buyRaffle);
router.post("/login", login);
router.post("/login-admin", loginAdmin);
router.post("/get-users-with-raffle-numbers", getBuyedNumbers);
router.delete("/payment-cancel", paymentCanceled);

export default router;
