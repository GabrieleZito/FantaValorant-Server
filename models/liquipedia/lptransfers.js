const { Model, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTransfers extends Model {}

LPTransfers.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPTransfers;
