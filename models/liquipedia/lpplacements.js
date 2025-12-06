const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPPlacements extends Model {}

LPPlacements.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPPlacements;
