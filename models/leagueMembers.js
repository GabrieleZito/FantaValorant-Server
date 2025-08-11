const { DataTypes, Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class LeagueMembers extends Model {}

LeagueMembers.init(
    {
        coins: {
            type: INTEGER,
            allowNull: false,
        },
        score: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
    }
);

module.exports = LeagueMembers;
