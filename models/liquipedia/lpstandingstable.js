const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPStandingstable extends Model {}

LPStandingstable.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPStandingstable;
