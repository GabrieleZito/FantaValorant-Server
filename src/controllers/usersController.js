import userDB from "../database/api/users.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
const newFriendRequest = async (req, res) => {
    //the user who is sending the request
    // @ts-ignore
    const userId = req.user.id;
    //the user who will receive the request
    const { username } = req.body;

    try {
        const friend = await userDB.getUserByUsername(username);
        //checks if the user exists
        if (!friend) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        // checks if the users are the same
        // @ts-ignore
        if (userId == friend.id) {
            return res.status(400).json({
                success: false,
                message: "You can't send a request to yourself",
                data: null,
            });
        }

        //checks if there is already an accepted friend request
        // @ts-ignore
        const acceptedFriendship = await userDB.getAcceptedFriendship(userId, friend.id);
        if (acceptedFriendship) {
            return res.status(409).json({
                success: false,
                message: "You are already friends",
            });
        }

        //checks if there is already a pending friend request
        // @ts-ignore
        const pendingFriendship = await userDB.getPendingFriendship(userId, friend.id);
        if (pendingFriendship) {
            return res.status(409).json({
                success: false,
                message: "There's already a request pending",
            });
        }

        // @ts-ignore
        await userDB.createFriendRequest(userId, friend.id);

        return res.status(200).json({
            success: true,
            message: "Friend request sent",
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getReceivedRequests = async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    try {
        const receivedRequests = await userDB.getReceivedRequests(userId);
        res.json({ success: true, data: receivedRequests, message: receivedRequests ? "Friend requests retrieved" : "No new friend requests" });
    } catch (error) {
        console.error("Get Friend requests error: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const acceptRequest = async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const requestId = req.params["requestId"];
    try {
        // TODO aggiungere check su intero e float
        // @ts-ignore
        if (!requestId || isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Not a valid request id",
            });
        }

        // @ts-ignore
        const request = await userDB.acceptRequest(requestId, userId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found or already processed",
                data: null,
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
            data: null,
        });
    }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const declineRequest = async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const requestId = req.params["requestId"];
    try {
        // TODO aggiungere check su intero e float
        // @ts-ignore
        if (!requestId || isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Not a valid request id",
            });
        }
        // @ts-ignore
        const request = await userDB.declineRequest(requestId, userId);
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
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getFriends = async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;

    try {
        const friends = await userDB.getUserFriends(userId);
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
};

const usersController = {
    newFriendRequest,
    getReceivedRequests,
    acceptRequest,
    declineRequest,
    getFriends,
};

export default usersController;
