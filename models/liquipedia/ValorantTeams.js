const { DataTypes, Model, STRING, ENUM, INTEGER, DATE, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class ValorantTeams extends Model {}

ValorantTeams.init(
    {
        pageid: { type: INTEGER },
        pagename: { type: STRING, unique: true },
        namespace: { type: INTEGER },
        objectname: { type: STRING },
        name: { type: STRING },
        locations: { type: JSONB },
        region: { type: STRING },
        logo: { type: STRING },
        logourl: { type: STRING },
        logodark: { type: STRING },
        logodarkurl: { type: STRING },
        status: { type: STRING },
        createdate: {
            type: DATE,
            set(value) {
                if (value === "0000-01-01" || !value) {
                    this.setDataValue("createdate", null);
                } else {
                    this.setDataValue("createdate", value);
                }
            },
        },
        disbanddate: {
            type: DATE,
            set(value) {
                if (value === "0000-01-01" || !value) {
                    this.setDataValue("disbanddate", null);
                } else {
                    this.setDataValue("disbanddate", value);
                }
            },
        },
        earnings: { type: INTEGER },
        earningsbyyear: { type: JSONB },
        template: { type: STRING },
        links: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = ValorantTeams;
