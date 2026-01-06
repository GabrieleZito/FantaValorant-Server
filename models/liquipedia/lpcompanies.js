const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPCompanies extends Model {}

LPCompanies.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPCompanies;
