const { Model, STRING, ENUM, INTEGER, DATE, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class MatchSeries extends Model {}

MatchSeries.init(
    {
        pageid: { type: INTEGER },
        pagename: { type: STRING },
        namespace: { type: STRING },
        objectname: { type: STRING },
        match2id: { type: STRING },
        match2bracketid: { type: STRING },
        status: { type: STRING },
        walkover: { type: STRING },
        resulttype: { type: STRING },
        finished: { type: INTEGER },
        mode: { type: STRING },
        type: { type: STRING },
        section: { type: STRING },
        patch: { type: STRING },
        date: { type: DATE },
        dateexact: { type: INTEGER },
        stream: { type: JSONB },
        links: { type: JSONB },
        bestof: { type: INTEGER },
        tournament: { type: STRING },
        parent: { type: STRING },
        tickername: { type: STRING },
        shortname: { type: STRING },
        series: { type: STRING },
        extradata: { type: JSONB },
        match2bracketdata: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = MatchSeries;
