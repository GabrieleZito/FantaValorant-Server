const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Friendships extends Model {}

Friendships.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "blocked", "declined"),
            allowNull: false,
            defaultValue: "pending",
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "sender_id",
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "receiver_id",
        },
    },
    {
        indexes: [
            { fields: ["sender_id"] },
            { fields: ["receiver_id"] },
            { fields: ["status"] },
            { fields: ["sender_id", "status"] },
            { fields: ["receiver_id", "status"] },
            { fields: ["sender_id", "receiver_id"], unique: true },
        ],
        sequelize,
    }
);

module.exports = Friendships;
