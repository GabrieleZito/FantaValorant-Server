const {  Model, STRING, ENUM, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Players extends Model {}

Players.init(
    {
        amount: { type: INTEGER },
    },
    {
        sequelize,
    }
);

module.exports = Players;
