const { DataTypes, Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Bids extends Model {}

Bids.init(
    {
        amount: { type: INTEGER },
    },
    {
        sequelize,
    }
);

module.exports = Bids;
