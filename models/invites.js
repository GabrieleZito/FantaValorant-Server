const { Model, ENUM } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Invites extends Model {}

Invites.init(
    {
        status: { type: ENUM("pending", "accepted", "declined"), allowNull: false, defaultValue: "pending" },
    },
    { sequelize }
);

module.exports = Invites;
