const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTeams extends Model {}

LPTeams.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPTeams;
