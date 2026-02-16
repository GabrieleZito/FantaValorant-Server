import express from "express";
import usersController from "../controllers/usersController.js";
import { authenticateToken } from "../middlewares/auth.js";
const router = express.Router();

router.post("/friend-requests", authenticateToken, usersController.newFriendRequest);

router.get("/friend-requests/received", authenticateToken, usersController.getReceivedRequests);

router.patch("/friend-requests/:requestId/accept", authenticateToken, usersController.acceptRequest);

router.patch("/friend-requests/:requestId/decline", authenticateToken, usersController.declineRequest);

router.get("/friends", authenticateToken, usersController.getFriends);

/* router.post("/invites");

router.get("/invites/received");

router.patch("/invites/:inviteId/accept");

router.patch("/invites/:inviteId/decline"); */

export default router;
