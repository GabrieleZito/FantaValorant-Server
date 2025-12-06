const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPStandingsEntry extends Model {}

LPStandingsEntry.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPStandingsEntry;
