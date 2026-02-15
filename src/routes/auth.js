import express from "express";
import authController from "../controllers/authController.js";
const router = express.Router();

router.post("/register", authController.registerUser);

/* router.post("/login");

router.post("logout");

router.get("/refresh");

router.get("/me"); */

export default router;
