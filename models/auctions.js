const { DataTypes, Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Auctions extends Model {}

Auctions.init(
    {
        currentItem: { type: INTEGER },
        
    },
    {
        sequelize,
    }
);

module.exports = Auctions;
