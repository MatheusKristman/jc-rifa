import express from "express";
import { getAllWinners, getWinner, deleteWinner } from "../controllers/WinnerController.js";

const router = express.Router();

router.get("/get-all-winners", getAllWinners);
router.post("/get-winner", getWinner);
router.delete("/delete-winner/:id", deleteWinner);

export default router;
