const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPBroadcasters extends Model {}

LPBroadcasters.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPBroadcasters;
