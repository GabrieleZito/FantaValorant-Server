import { Op } from "sequelize";
import { hashToken } from "../../utils/misc/encrypt.js";
import { Friendships, Tokens, UserProfile } from "../index.js";

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {Date} birthDay
 * @property {string} bio
 * @property {string} propic
 * @property {string} email
 * @property {string} username
 * @property {string} passwordHash
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Gets the user instance from the user ID
 * @param {number} userId - The id of the user
 * @returns {Promise<UserProfile|null>} - The user profile object if found, null otherwise
 */
const getUserById = async (userId) => {
    try {
        const user = await UserProfile.findByPk(userId);
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Gets the user instance from the user email
 * @param {string} email
 * @returns {Promise<UserProfile|null>}
 */
const getUserByEmail = async (email) => {
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

/**
 * Gets the user instance from the user username
 * @param {string} username
 * @returns {Promise<UserProfile|null>}
 */
const getUserByUsername = async (username) => {
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

/**
 * Creates a new user profile in the database
 * @async
 * @param {Object} user - The user data object
 * @param {string} user.firstName - User's first name
 * @param {string} user.lastName - User's last name
 * @param {string} user.email - User's email address
 * @param {string} user.username - User's username
 * @param {string} user.passwordHash - Hashed password
 * @returns {Promise<UserProfile>} The newly created user profile object
 * @throws {Error} Database error if user creation fails (e.g., duplicate email/username)
 */
const createUser = async (user) => {
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
/**
 *
 * @param {string} refreshToken
 * @returns
 */
const getUserByRefreshToken = async (refreshToken) => {
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

/**
 *
 * @param {number} userId1
 * @param {number} userId2
 * @returns
 */
const getAcceptedFriendship = async (userId1, userId2) => {
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

/**
 *
 * @param {number} userId1
 * @param {number} userId2
 * @returns
 */
const getPendingFriendship = async (userId1, userId2) => {
    try {
        const friendship = await Friendships.findOne({
            where: {
                [Op.or]: [
                    { senderId: userId1, receiverId: userId2, status: "pending" },
                    { senderId: userId2, receiverId: userId1, status: "pending" },
                ],
            },
        });
        return friendship;
    } catch (error) {
        throw error;
    }
};

/**
 *
 * @param {number} senderId
 * @param {number} receiverId
 * @returns
 */
const createFriendRequest = async (senderId, receiverId) => {
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

/**
 *
 * @param {number} userId
 * @returns
 */
const getReceivedRequests = async (userId) => {
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

/**
 *
 * @param {number} requestId
 * @param {number} userId
 * @returns
 */
const acceptRequest = async (requestId, userId) => {
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

/**
 *
 * @param {number} requestId
 * @param {number} userId
 * @returns
 */
const declineRequest = async (requestId, userId) => {
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

/**
 *
 * @param {number} userId
 * @returns
 */
const getUserFriends = async (userId) => {
    try {
        const friendships = await Friendships.findAll({
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
        const friends = friendships.map((friendship) => {
            // @ts-ignore
            let newFriend = friendship.senderId === userId ? friendship.Receiver : friendship.Sender;
            // @ts-ignore
            newFriend.dataValues.updatedAt = friendship.updatedAt;
            return newFriend;
        });
        return friends;
    } catch (error) {
        throw error;
    }
};

const userDB = {
    getUserById,
    getUserByEmail,
    getUserByUsername,
    createUser,
    getUserByRefreshToken,
    getAcceptedFriendship,
    getPendingFriendship,
    createFriendRequest,
    getReceivedRequests,
    acceptRequest,
    declineRequest,
    getUserFriends,
};

export default userDB;
