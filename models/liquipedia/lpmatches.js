const { Model,  INTEGER, STRING, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPMatches extends Model {}

LPMatches.init(
    {
        pageid: { type: INTEGER },
        namespace: { type: INTEGER },
        match2id: { type: STRING },
        pagename: { type: STRING },
        wiki: { type: STRING },
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPMatches;
