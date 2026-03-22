import express from "express";
const router = express.Router();
import esportController from "../controllers/esportController.js";
import { authenticateToken } from "../middlewares/auth.js";

router.get("/teams", authenticateToken, esportController.getTeams);

export default router;
