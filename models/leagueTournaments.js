const { DataTypes, Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class LeagueTournaments extends Model {}

LeagueTournaments.init(
    {},
    {
        sequelize,
    }
);

module.exports = LeagueTournaments;
