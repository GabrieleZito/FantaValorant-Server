const { Model, STRING, INTEGER, DATE, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class Players extends Model {}

Players.init(
    {
        pageid: { type: INTEGER },
        pagename: { type: STRING },
        namespace: { type: INTEGER },
        objectname: { type: STRING },
        liquipediaid: { type: STRING },
        alternateid: { type: STRING },
        name: { type: STRING },
        localizedname: { type: STRING },
        type: { type: STRING },
        nationality: { type: STRING },
        nationality2: { type: STRING },
        nationality3: { type: STRING },
        region: { type: STRING },
        birthdate: {
            type: DATE,
            set(value) {
                if (value === "0000-01-01" || !value) {
                    this.setDataValue("birthdate", null);
                } else {
                    this.setDataValue("birthdate", value);
                }
            },
        },
        deathdate: {
            type: DATE,
            set(value) {
                if (value === "0000-01-01" || !value) {
                    this.setDataValue("deathdate", null);
                } else {
                    this.setDataValue("deathdate", value);
                }
            },
        },
        teampagename: { type: STRING },
        teamtemplate: { type: STRING },
        links: { type: JSONB },
        status: { type: STRING },
        earnings: { type: INTEGER },
        earningsbyyear: { type: JSONB },
        extradata: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = Players;
