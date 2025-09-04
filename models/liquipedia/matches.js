const { DataTypes, Model, STRING, ENUM, INTEGER, DATE, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class Matches extends Model {}

Matches.init(
    {
        map: { type: STRING },
        subgroup: { type: STRING },
        match2gameid: { type: STRING },
        scores: { type: STRING },
        status: { type: STRING },
        agent: { type: STRING },
        walkover: { type: STRING },
        resultype: { type: STRING },
        date: { type: DATE },
        mode: { type: STRING },
        type: { type: STRING },
        vod: { type: STRING },
        length: { type: STRING },
        patch: { type: STRING },
        extradata: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = Matches;
