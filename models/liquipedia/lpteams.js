const { Model, JSONB, INTEGER, STRING } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTeams extends Model {}

LPTeams.init(
    {
        pageid: { type: INTEGER },
        pagename: { type: STRING },
        namespace: { type: INTEGER },
        wiki: { type: STRING },
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPTeams;
