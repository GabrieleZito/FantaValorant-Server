const { DataTypes, Model, STRING, ENUM, INTEGER, DATEONLY, JSONB, DOUBLE } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class Tournaments extends Model {}

Tournaments.init(
    {
        pageid: { type: INTEGER },
        pagename: { type: STRING },
        namespace: { type: INTEGER },
        objectname: { type: STRING },
        name: { type: STRING },
        shortname: { type: STRING },
        tickername: { type: STRING },
        banner: { type: STRING },
        bannerurl: { type: STRING },
        bannerdark: { type: STRING },
        bannerurldark: { type: STRING },
        icon: { type: STRING },
        iconurl: { type: STRING },
        icondark: { type: STRING },
        icondarkurl: { type: STRING },
        seriespage: { type: STRING },
        serieslist: { type: JSONB },
        previous: { type: STRING },
        previous2: { type: STRING },
        next: { type: STRING },
        next2: { type: STRING },
        mode: { type: STRING },
        patch: { type: STRING },
        type: { type: STRING },
        organizers: { type: STRING },
        startdate: {
            type: DATEONLY,
            set(value) {
                if (value === "0000-01-01" || !value) {
                    this.setDataValue("startdate", null);
                } else {
                    this.setDataValue("startdate", value);
                }
            },
        },
        enddate: {
            type: DATEONLY,
            set(value) {
                if (value === "0000-01-01" || !value) {
                    this.setDataValue("enddate", null);
                } else {
                    this.setDataValue("enddate", value);
                }
            },
        },
        locations: { type: JSONB },
        prizepool: { type: DOUBLE },
        participantsnumber: { type: INTEGER },
        liquipediatier: { type: STRING },
        liquipediatiertype: { type: STRING },
        status: { type: STRING },
        maps: { type: STRING },
        format: { type: STRING },
    },
    {
        sequelize,
    }
);

module.exports = Tournaments;
