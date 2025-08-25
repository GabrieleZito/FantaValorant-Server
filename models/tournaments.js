const { DataTypes, Model, STRING, ENUM, INTEGER, DATEONLY } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Tournaments extends Model {}

Tournaments.init(
    {
        pagename: { type: STRING },
        name: { type: STRING },
        shortname: { type: STRING },
        banner: { type: STRING },
        bannerurl: { type: STRING },
        bannerdark: { type: STRING },
        bannerurldark: { type: STRING },
        icon: { type: STRING },
        iconurl: { type: STRING },
        icondark: { type: STRING },
        icondarkurl: { type: STRING },
        seriespage: { type: STRING },
        previous: { type: STRING },
        previous2: { type: STRING },
        next: { type: STRING },
        next2: { type: STRING },
        mode: { type: STRING },
        type: { type: STRING },
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
        maps: { type: STRING },
        liquipediatiertype: { type: STRING },
        status: { type: STRING },
    },
    {
        sequelize,
    }
);

module.exports = Tournaments;
