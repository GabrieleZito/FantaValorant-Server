import { BOOLEAN, DATEONLY, INTEGER, Model, STRING, TEXT } from "sequelize";
import sequelize from "../../config/sequelize.js";
class Participate extends Model {}

Participate.init(
    {
        score: { type: INTEGER },
        coins: { type: INTEGER },
    },
    {
        sequelize,
    },
);

export default Participate;
