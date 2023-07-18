import express from "express";
import {
    getAllRaffles,
    getRaffle,
    finishRaffle,
    getBuyedNumbers,
    deleteRaffle,
} from "../controllers/RaffleController.js";

const router = express.Router();

router.get("/get-all-raffles", getAllRaffles);
router.get("/get-raffle-selected/:id", getRaffle);
router.post("/generate-a-winner", finishRaffle);
router.post("/get-users-with-raffle-numbers", getBuyedNumbers);
router.delete("/delete-raffle/:id", deleteRaffle);

export default router;
