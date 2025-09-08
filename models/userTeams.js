const { Model, STRING } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class UserTeams extends Model {}

UserTeams.init(
    {
        name: { type: STRING },
    },
    {
        sequelize,
    }
);

module.exports = UserTeams;
