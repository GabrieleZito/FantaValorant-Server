import { UserProfile } from "../index.js";

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

const userDB = {
    getUserById,
    getUserByEmail,
    getUserByUsername,
    createUser,
};

export default userDB;
