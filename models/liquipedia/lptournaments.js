const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTournaments extends Model {}

LPTournaments.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPTournaments;
