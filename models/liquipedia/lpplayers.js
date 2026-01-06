const { Model,  INTEGER, STRING, JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPPlayers extends Model {}

LPPlayers.init(
    {
        pageid: { type: INTEGER },
        namespace: { type: INTEGER },
        pagename: { type: STRING },
        wiki: { type: STRING },
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPPlayers;

/* 
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

*/
