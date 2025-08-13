const { Tokens } = require("../models");
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

exports.revokeRefreshToken = async (userId) => {
    try {
        const token = await Tokens.findOne({
            where: {
                userId: userId,
            },
        });
        if (!token) {
            return null;
        }
        await token.update({
            isRevoked: true,
        });
    } catch (error) {
        console.error("Error in revokeRefreshToken: " + error);
    }
};
