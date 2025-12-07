const { Model,  INTEGER, STRING, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTeams extends Model {}

LPTeams.init(
    {
        pageid: { type: INTEGER },
        pagename: { type: STRING },
        namespace: { type: INTEGER },
        wiki: { type: STRING },
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPTeams;
