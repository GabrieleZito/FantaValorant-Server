const { DataTypes, Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class PlayerTeamMatches extends Model {}

PlayerTeamMatches.init(
    {},
    {
        sequelize,
    }
);

module.exports = PlayerTeamMatches;
