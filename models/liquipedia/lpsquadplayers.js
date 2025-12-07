const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPSquadPlayers extends Model {}

LPSquadPlayers.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPSquadPlayers;
