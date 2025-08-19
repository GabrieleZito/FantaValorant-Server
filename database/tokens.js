const { Tokens, UserProfile } = require("../models");
const crypto = require("crypto");
const { hashString, hashToken } = require("../utils/misc/encrypt");

exports.setRefreshToken = async (userId, refreshToken, deviceInfo = null, ipAddress = null, userAgent = null) => {
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

        return token.id;
    } catch (error) {
        console.error("Error in setRefreshToken:", error);
        throw error;
    }
};

exports.getRefreshToken = async (refreshToken) => {
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

exports.invalidateToken = async (tokenId) => {
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
