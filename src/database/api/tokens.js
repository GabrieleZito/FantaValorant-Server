import { Tokens, UserProfile } from "../index.js";
import { hashToken } from "../../utils/misc/encrypt.js";
/**
 *
 * @param {number} userId
 * @param {string} refreshToken
 * @param {string} deviceInfo
 * @param {string} ipAddress
 * @param {string} userAgent
 * @returns
 */
const setRefreshToken = async (userId, refreshToken, deviceInfo = "", ipAddress = "", userAgent = "") => {
    try {
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const token = await Tokens.create({
            userId: userId,
            tokenHash: tokenHash,
            type: "refresh",
            deviceInfo: deviceInfo,
            ipAddress: ipAddress,
            userAgent: userAgent,
            expiresAt: expiresAt,
            lastUsedAt: new Date(),
        });

        // @ts-ignore
        return token.id;
    } catch (error) {
        console.error("Error in setRefreshToken:", error);
        throw error;
    }
};

/**
 *
 * @param {string} refreshToken
 * @returns
 */
const getRefreshToken = async (refreshToken) => {
    try {
        const tokenHash = hashToken(refreshToken);
        const token = await Tokens.findOne({
            where: {
                type: "refresh",
                tokenHash: tokenHash,
            },
            include: {
                model: UserProfile,
                as: "user",
                attributes: ["username", "email", "id"],
            },
        });
        return token;
    } catch (error) {
        console.error("Error in getRefreshToken: ", error);
        throw error;
    }
};

/**
 *
 * @param {number} tokenId
 * @returns
 */
const invalidateToken = async (tokenId) => {
    try {
        const token = await Tokens.findByPk(tokenId);
        if (token) {
            await token.update({ isRevoked: true });
        }
        return token;
    } catch (error) {
        console.error("Error in invalidateToken: ", error);
        throw error;
    }
};

const tokensDB = {
    setRefreshToken,
    getRefreshToken,
    invalidateToken,
};
export default tokensDB;
