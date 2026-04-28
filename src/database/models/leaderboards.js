import { BOOLEAN, DATEONLY, INTEGER, Model, STRING, TEXT } from "sequelize";
import sequelize from "../../config/sequelize.js";
class Leaderboards extends Model {}

Leaderboards.init(
    {
        name: { type: STRING, allowNull: false },
        coinsPerUser: { type: INTEGER, allowNull: false },
        fee: { type: INTEGER },
        isPrivate: { type: BOOLEAN },
    },
    {
        sequelize,
    },
);

export default Leaderboards;
