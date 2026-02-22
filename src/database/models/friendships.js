import { ENUM, INTEGER, Model } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Friendships extends Model {}

Friendships.init(
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: ENUM("pending", "accepted", "blocked", "declined"),
            allowNull: false,
            defaultValue: "pending",
        },
        senderId: {
            type: INTEGER,
            allowNull: false,
            field: "sender_id",
        },
        receiverId: {
            type: INTEGER,
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
    },
);

export default Friendships;
