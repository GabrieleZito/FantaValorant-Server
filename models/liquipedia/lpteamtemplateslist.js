const { Model, JSONB } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTeamTemplateList extends Model {}

LPTeamTemplateList.init(
    {
        raw: { type: JSONB },
    },
    {
        sequelize,
    }
);

module.exports = LPTeamTemplateList;
