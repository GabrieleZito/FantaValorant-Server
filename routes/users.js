const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const {
    getUserByUsername,
    findAcceptedFriendship,
    findPendingFriendship,
    createFriendRequest,
    getReceivedFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    createInvite,
    getReceivedInvites,
    acceptInvite,
} = require("../database/users");
const { getLeagueById, createLeagueMember } = require("../database/leagues");

router.post("/friend-requests", authenticateToken, async (req, res) => {
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

router.get("/friend-requests/received", authenticateToken, async (req, res) => {
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

router.patch("/friend-requests/:requestId/accept", authenticateToken, async (req, res) => {
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

router.patch("/friend-requests/:requestId/decline", authenticateToken, async (req, res) => {
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

router.get("/friends", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    //console.log(req.user);
    //console.log("cookies: ");
    //console.log(req.cookies);
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

router.post("/invites", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { leagueId, selectedFriend } = req.body;

    if (!userId || !leagueId || !selectedFriend) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

    try {
        const friendship = await findAcceptedFriendship(userId, selectedFriend.id);
        if (!friendship) {
            return res.status(403).json({
                success: false,
                message: "Cannot send friend request",
            });
        }

        const invite = await createInvite(userId, selectedFriend.id, leagueId);
        if (invite) {
            return res.json({
                success: true,
                message: "Invite sent",
            });
        }
    } catch (error) {
        console.log("Error in /users/invites: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/invites/received", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const invites = await getReceivedInvites(userId);
        res.json({
            success: true,
            data: invites,
        });
    } catch (error) {
        console.error("Error in /invites/received: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.patch("/invites/:inviteId/accept", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const inviteId = req.params["inviteId"];

    if (!inviteId || isNaN(inviteId)) {
        return res.status(400).json({
            success: false,
            message: "Not a valid request id",
        });
    }

    try {
        const invite = await acceptInvite(inviteId, userId);
        if (!invite) {
            return res.status(404).json({
                success: false,
                message: "Invite not found or already processed",
            });
        }

        const league = await getLeagueById(invite.leagueId);
        if (!league) {
            return res.status(404).json({
                success: false,
                message: "League not found",
            });
        }

        const lm = await createLeagueMember(userId, invite.leagueId, league.coins, null);
        if (!lm) {
            return res.status(400).json({
                success: false,
                message: "Could not add user to league",
            });
        }

        return res.json({
            success: true,
            message: "League joined",
        });
    } catch (error) {
        console.error("Error accepting invite: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.patch("/invites/:inviteId/decline", authenticateToken, async (req, res) => {});

module.exports = router;
