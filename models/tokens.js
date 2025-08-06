const { DataTypes, Model, STRING, ENUM } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Tokens extends Model {}

Tokens.init(
    {
        token: {
            type: STRING,
            allowNull: false,
        },
        type: {
            type: ENUM("access", "refresh", "reset_password"),
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
    }
);

module.exports = Tokens;
