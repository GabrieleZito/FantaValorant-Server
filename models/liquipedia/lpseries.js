const { Model,  INTEGER, STRING, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPSeries extends Model {}

LPSeries.init(
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

module.exports = LPSeries;
