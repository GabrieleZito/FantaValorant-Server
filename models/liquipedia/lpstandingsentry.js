const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPStandingsEntry extends Model {}

LPStandingsEntry.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPStandingsEntry;
