const { DataTypes, Model, STRING, ENUM, INTEGER, DATE, JSONB } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Matches extends Model {}

Matches.init(
    {
        pagename: { type: STRING },
        objectname: { type: STRING },
        match2id: { type: STRING },
        match2bracketid: { type: STRING },
        status: { type: STRING },
        winner: { type: INTEGER },
        walkover: { type: STRING },
        resulttype: { type: STRING },
        finished: { type: INTEGER },
        mode: { type: STRING },
        type: { type: STRING },
        section: { type: STRING },
        patch: { type: STRING },
        date: { type: DATE },
        bestof: { type: INTEGER },
        tournament: { type: STRING },
        parent: { type: STRING },
        tickername: { type: STRING },
        shortname: { type: STRING },
        series: { type: STRING },
        extradata: { type: JSONB },
        //TODO da capire se serve
        /* match2bracketdata:{
            type: JSONB
        } */
    },
    {
        sequelize,
    }
);

module.exports = Matches;
