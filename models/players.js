const { Model, STRING, INTEGER, DATE, JSONB } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Players extends Model {}

Players.init(
    {
        pagename: { type: STRING },
        objectname: { type: STRING },
        alternateid: { type: STRING },
        name: { type: STRING },
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
        teampagename: { type: STRING },
        teamtemplate: { type: STRING },
        status: { type: STRING },
        earnings: { type: INTEGER },
        extradata: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = Players;
