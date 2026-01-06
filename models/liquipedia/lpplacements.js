const { Model,  JSON } = require("sequelize");
const sequelize = require("../../config/sequelize.js");

class LPPlacements extends Model {}

LPPlacements.init(
    {
        raw: { type: JSON },
    },
    {
        sequelize,
    }
);

module.exports = LPPlacements;
