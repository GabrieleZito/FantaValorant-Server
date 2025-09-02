const { DataTypes, Model, STRING, ENUM, INTEGER, DATE } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class ValorantTeams extends Model {}

ValorantTeams.init(
    {
        pagename: { type: STRING },
        objectname: { type: STRING },
        name: { type: STRING },
        region: { type: STRING },
        logo: { type: STRING },
        logourl: { type: STRING },
        logodark: { type: STRING },
        logodarkurl: { type: STRING },
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
        earnings: { type: INTEGER },
        template: { type: STRING },
        status: { type: STRING },
    },
    {
        sequelize,
    }
);

module.exports = ValorantTeams;
