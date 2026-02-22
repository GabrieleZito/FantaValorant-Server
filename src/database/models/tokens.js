import { BOOLEAN, DATE, ENUM, INTEGER, Model, NOW, Op, STRING, TEXT } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Tokens extends Model {}

Tokens.init(
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tokenHash: {
            type: STRING(255),
            allowNull: false,
            unique: true,
        },
        type: {
            type: ENUM("access", "refresh", "reset_password", "email_verification"),
            allowNull: false,
            defaultValue: "refresh",
        },
        deviceInfo: {
            type: STRING(500),
            allowNull: true,
        },
        ipAddress: {
            type: STRING(45),
            allowNull: true,
        },
        userAgent: {
            type: TEXT,
            allowNull: true,
        },
        expiresAt: {
            type: DATE,
            allowNull: false,
        },
        isRevoked: {
            type: BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        lastUsedAt: {
            type: DATE,
            allowNull: true,
        },
        createdAt: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW,
        },
        updatedAt: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW,
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
    },
);

export default Tokens;
