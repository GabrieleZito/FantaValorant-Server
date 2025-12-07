const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPTeamTemplateList extends Model {}

LPTeamTemplateList.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPTeamTemplateList;
