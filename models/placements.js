const { Model, STRING } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Placements extends Model {}

Placements.init(
    {
        pagename: { type: STRING },
        objectname: { type: STRING },
        tournament: { type: STRING },
        series: { type: STRING },
        parent: { type: STRING },
        placement: { type: STRING },
        prizemoney: { type: STRING },
        mode: { type: STRING },
        type: { type: STRING },
        liquipediatiertype: { type: STRING },
        opponentname: { type: STRING },
        opponenttemplate: { type: STRING },
        opponenttype: { type: STRING },
        qualifier: { type: STRING },
        qualifierpage: { type: STRING },
    },
    {
        sequelize,
    }
);

module.exports = Placements;
