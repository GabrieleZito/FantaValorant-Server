const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPSeries extends Model {}

LPSeries.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPSeries;
