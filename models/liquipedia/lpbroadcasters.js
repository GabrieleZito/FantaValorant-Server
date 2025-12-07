const { Model, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPBroadcasters extends Model {}

LPBroadcasters.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPBroadcasters;
