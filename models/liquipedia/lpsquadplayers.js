const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPSquadPlayers extends Model {}

LPSquadPlayers.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPSquadPlayers;
