import express from "express";
import authController from "../controllers/authController.js";
const router = express.Router();

import "../middlewares/passport-strategies.js";

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("logout", authController.logoutUser);

router.get("/refresh", authController.refreshToken);

router.get("/me", authController.me);

export default router;
