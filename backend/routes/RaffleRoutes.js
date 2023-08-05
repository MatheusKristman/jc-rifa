import express from "express";
import {
  getAllRaffles,
  getRaffle,
  finishRaffle,
  deleteRaffle,
} from "../controllers/RaffleController.js";

const router = express.Router();

router.get("/get-all-raffles", getAllRaffles);
router.get("/get-raffle-selected/:id", getRaffle);
router.post("/generate-a-winner", finishRaffle);
router.delete("/delete-raffle/:id", deleteRaffle);

export default router;
