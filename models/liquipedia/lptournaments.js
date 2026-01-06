const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTournaments extends Model {}

LPTournaments.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPTournaments;
