const { DataTypes, Model, STRING, ENUM, INTEGER, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class AuctionPlayers extends Model {}

AuctionPlayers.init(
    {
        finished: {
            type: BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

module.exports = AuctionPlayers;
