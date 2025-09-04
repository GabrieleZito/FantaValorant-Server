const { DataTypes, Model, STRING, ENUM, INTEGER, DOUBLE } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class PlayerTeamMatches extends Model {}

PlayerTeamMatches.init(
    {
        kast: { type: DOUBLE },
        deaths: { type: INTEGER },
        adr: { type: DOUBLE },
        acs: { type: DOUBLE },
        assists: { type: INTEGER },
        kills: { type: INTEGER },
        hs: { type: DOUBLE },
    },
    {
        sequelize,
    }
);

module.exports = PlayerTeamMatches;
