import { DATEONLY, Model, STRING, TEXT } from "sequelize";
import sequelize from "../../config/sequelize.js";
class Teams extends Model {}

Teams.init(
    {
        name: { type: STRING },
    },
    {
        sequelize,
    },
);

export default Teams;
