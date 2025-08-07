const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/auth");
const {
    getUserByUsername,
    findAcceptedFriendship,
    findPendingFriendship,
    createFriendRequest,
    getReceivedFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
} = require("../database/users");

router.post("/friend-requests", isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;

    console.log("Sender id: ", userId);
    console.log("Searched username: ", username);

    try {
        const friend = await getUserByUsername(username);
        if (!friend) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // checks if you sending a request to yourself
        if (userId == friend.id) {
            return res.status(400).json({
                success: false,
                message: "Cannot send request to yourself",
            });
        }

        //checks if there is already an accepted friend request
        const existingFriendship = await findAcceptedFriendship(userId, friend.id);
        if (existingFriendship) {
            return res.status(409).json({
                success: false,
                message: "You are already friends",
            });
        }

        //checks if there is already a pending friend request
        const existingRequest = await findPendingFriendship(userId, friend.id);
        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: "There's already a request pending",
            });
        }

        //create request
        const request = await createFriendRequest(userId, friend.id);

        res.status(201).json({
            success: true,
            message: "Friend request sent",
            data: {},
        });
    } catch (error) {
        console.error("Friend request error: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get("/friend-requests/received", isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    try {
        const receivedRequests = await getReceivedFriendRequests(userId);
        res.json(receivedRequests);
    } catch (error) {
        console.error("Get Friend requests error: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.patch("/friend-requests/:requestId/accept", isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params["requestId"];
    try {
        // TODO aggiungere check su intero e float
        if (!requestId || isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Not a valid request id",
            });
        }

        const request = await acceptFriendRequest(requestId, userId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found or already processed",
            });
        }
        res.status(200).json({
            success: true,
            message: "Friend request accepted",
            data: request,
        });
    } catch (error) {
        console.error("Accept friend request error: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.patch("/friend-requests/:requestId/decline", isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params["requestId"];
    try {
        // TODO aggiungere check su intero e float
        if (!requestId || isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Not a valid request id",
            });
        }
        const request = await declineFriendRequest(requestId, userId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found or already processed",
            });
        }
        res.status(200).json({
            success: true,
            message: "Friend request declined",
            data: request,
        });
    } catch (error) {
        console.error("Decline friend request error: ", error);
    }
});

router.get("/friends", isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    try {
        const friends = await getFriends(userId);
        //console.log("get friend requests for id ", userId);
        //console.log(friends);

        res.status(200).json({
            success: true,
            message: "Friends retrieved",
            data: friends,
        });
    } catch (error) {
        console.error("Get Friends error: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
