const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTransfers extends Model {}

LPTransfers.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPTransfers;
