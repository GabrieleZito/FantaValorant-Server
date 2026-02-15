const { Model, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPPlacements extends Model {}

LPPlacements.init(
    {
        pageid: { type: INTEGER },
        namespace: { type: INTEGER },
        pagename: { type: STRING },
        wiki: { type: STRING },
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPPlacements;
