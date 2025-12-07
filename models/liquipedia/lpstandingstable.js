const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPStandingstable extends Model {}

LPStandingstable.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPStandingstable;
