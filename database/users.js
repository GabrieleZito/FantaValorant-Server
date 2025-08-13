const { Op } = require("sequelize");
const { UserProfile, Tokens, Friendships } = require("../models");
const { hashString, hashToken } = require("../utils/misc/encrypt");

// Int -> UserProfile
exports.getUserById = async (id) => {
    try {
        const user = await UserProfile.findByPk(id);
        return user;
    } catch (error) {
        throw error;
    }
};

// String -> UserProfile
exports.getUserByUsername = async (username) => {
    try {
        const user = await UserProfile.findOne({
            where: {
                username: username,
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
};

// String -> UserProfile
exports.getUserByEmail = async (email) => {
    try {
        const user = await UserProfile.findOne({
            where: {
                email: email,
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
};

// {user} -> UserProfile
exports.createUser = async (user) => {
    try {
        const newUser = await UserProfile.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            passwordHash: user.passwordHash,
        });
        return newUser;
    } catch (error) {
        throw error;
    }
};

exports.findAcceptedFriendship = async (userId1, userId2) => {
    try {
        const friendship = await Friendships.findOne({
            where: {
                [Op.or]: [
                    { senderId: userId1, receiverId: userId2, status: "accepted" },
                    { senderId: userId2, receiverId: userId1, status: "accepted" },
                ],
            },
        });
        return friendship;
    } catch (error) {
        throw error;
    }
};

exports.findPendingFriendship = async (userId1, userId2) => {
    try {
        const existingRequest = await Friendships.findOne({
            where: {
                [Op.or]: [
                    { senderId: userId1, receiverId: userId2, status: "pending" },
                    { senderId: userId2, receiverId: userId1, status: "pending" },
                ],
            },
        });
        return existingRequest;
    } catch (error) {
        throw error;
    }
};

exports.createFriendRequest = async (senderId, receiverId) => {
    try {
        const request = await Friendships.create({
            senderId: senderId,
            receiverId: receiverId,
            status: "pending",
        });
        return request;
    } catch (error) {
        throw error;
    }
};

exports.getReceivedFriendRequests = async (userId) => {
    try {
        const requests = await Friendships.findAll({
            where: {
                receiverId: userId,
                status: "pending",
            },
            include: {
                model: UserProfile,
                as: "Sender",
                attributes: ["id", "username", "propic"],
            },
            order: [["createdAt", "DESC"]],
        });
        return requests;
    } catch (error) {
        throw error;
    }
};

exports.acceptFriendRequest = async (requestId, userId) => {
    try {
        const request = await Friendships.findOne({
            where: {
                id: requestId,
                receiverId: userId,
                status: "pending",
            },
        });
        if (!request) {
            return null;
        }
        await request.update({
            status: "accepted",
        });
        return request;
    } catch (error) {
        throw error;
    }
};

exports.declineFriendRequest = async (requestId, userId) => {
    try {
        const request = await Friendships.findOne({
            where: {
                id: requestId,
                receiverId: userId,
                status: "pending",
            },
        });
        if (!request) {
            return null;
        }
        await request.update({
            status: "declined",
        });
        return request;
    } catch (error) {
        throw error;
    }
};

exports.getFriends = async (userId) => {
    try {
        const friends = await Friendships.findAll({
            where: {
                [Op.or]: [{ receiverId: userId }, { senderId: userId }],
                status: "accepted",
            },
            include: [
                {
                    model: UserProfile,
                    as: "Sender",
                    attributes: ["id", "username", "propic"],
                    required: false,
                },
                {
                    model: UserProfile,
                    as: "Receiver",
                    attributes: ["id", "username", "propic"],
                    required: false,
                },
            ],
            order: [["updatedAt", "DESC"]],
        });
        return friends;
    } catch (error) {
        throw error;
    }
};

exports.getUserByRefreshToken = async (refreshToken) => {
    try {
        const tokenHash = hashToken(refreshToken);
        const user = await UserProfile.findOne({
            include: {
                model: Tokens,
                as: "tokens",
                where: {
                    tokenHash: tokenHash,
                },
            },
        });
        return user;
    } catch (error) {
        console.error("Error in getUserByRefreshToken: " + error);
        throw error;
    }
};
