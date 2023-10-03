import express from "express";
import { pay } from "../controllers/paymentsController.js";

const router = express.Router();

// Rota para gerenciar pagamento
router.post("/payment-management", pay);
router.post("/webhook", webhook);

export default router;
