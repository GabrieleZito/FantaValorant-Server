const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPCompanies extends Model {}

LPCompanies.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPCompanies;
