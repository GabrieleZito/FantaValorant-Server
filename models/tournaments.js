const { DataTypes, Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Tournaments extends Model {}

Tournaments.init(
    {
        pagename: {
            type: STRING,
            allowNull: false,
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        shortname: {
            type: STRING
        },
        bannerurl: {
            type: STRING
        },
        iconurl: {
            type: STRING,
        },
        icondarkurl: {
            
        }
    },
    {
        sequelize,
    }
);

module.exports = Tournaments;
