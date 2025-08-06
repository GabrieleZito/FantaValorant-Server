const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Friendships extends Model {}

Friendships.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "blocked", "declined"),
            allowNull: false,
            defaultValue: "pending",
        },
        requesterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "requester_id",
        },
        addresseeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "addressee_id",
        },
    },
    {
        indexes: [
            { fields: ["requester_id"] },
            { fields: ["addressee_id"] },
            { fields: ["status"] },
            { fields: ["requester_id", "status"] },
            { fields: ["addressee_id", "status"] },
            { fields: ["requester_id", "addressee_id"], unique: true },
        ],
        sequelize,
    }
);

module.exports = Friendships;
