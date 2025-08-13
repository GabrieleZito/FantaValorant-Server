const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Tokens extends Model {
    // Instance methods
    isExpired() {
        return new Date() > this.expiresAt;
    }

    isActive() {
        return !this.isRevoked && !this.isExpired();
    }

    // Static methods
    static async cleanupExpired() {
        return await this.destroy({
            where: {
                expiresAt: {
                    [sequelize.Sequelize.Op.lt]: new Date(),
                },
            },
        });
    }

    static async revokeAllUserTokens(userId, type = null) {
        const whereClause = { userId, isRevoked: false };
        if (type) whereClause.type = type;

        return await this.update({ isRevoked: true }, { where: whereClause });
    }
}

Tokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true, // Ensure token hashes are unique
        },
        type: {
            type: DataTypes.ENUM("access", "refresh", "reset_password", "email_verification"),
            allowNull: false,
            defaultValue: "refresh",
        },
        deviceInfo: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING(45), // IPv6 max length
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        lastUsedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        indexes: [
            {
                fields: ["tokenHash"],
                unique: true,
            },
            {
                fields: ["userId"],
            },
            {
                fields: ["userId", "type"],
            },
            {
                fields: ["expiresAt"],
            },
            {
                fields: ["userId", "isRevoked", "expiresAt"],
                name: "active_tokens_idx",
            },
        ],
    }
);

module.exports = Tokens;
