const { Model, STRING, DATE, DOUBLE, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class Placements extends Model {}

Placements.init(
    {
        pageid: { type: STRING },
        pagename: { type: STRING },
        namespace: { type: STRING },
        objectname: { type: STRING },
        tournament: { type: STRING },
        series: { type: STRING },
        parent: { type: STRING },
        startdate: { type: DATE },
        date: { type: DATE },
        placement: { type: STRING },
        prizemoney: { type: STRING },
        individualprizemoney: { type: DOUBLE },
        mode: { type: STRING },
        type: { type: STRING },
        liquipediatiertype: { type: STRING },
        opponentname: { type: STRING },
        opponenttemplate: { type: STRING },
        opponenttype: { type: STRING },
        qualifier: { type: STRING },
        qualifierpage: { type: STRING },
        extradata: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = Placements;
