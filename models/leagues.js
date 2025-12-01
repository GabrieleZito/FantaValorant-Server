const { DataTypes, Model, STRING, ENUM, FLOAT, INTEGER, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Leagues extends Model {}

Leagues.init(
    {
        name: {
            type: STRING,
            allowNull: false,
        },
        fee: {
            type: FLOAT,
            allowNull: false,
        },
        coins: {
            type: INTEGER,
            allowNull: false,
        },
        isPublic: {
            type: BOOLEAN,
            allowNull: false,
        },
        tournamentName: {
            type: STRING,
        },
    },
    {
        sequelize,
    }
);

module.exports = Leagues;
