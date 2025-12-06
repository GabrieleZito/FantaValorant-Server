const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPMatches extends Model {}

LPMatches.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPMatches;
