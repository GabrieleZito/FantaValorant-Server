import { Model, ENUM } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Invites extends Model {}

Invites.init(
    {
        status: { type: ENUM("pending", "accepted", "declined"), allowNull: false, defaultValue: "pending" },
    },
    { sequelize },
);

export default Invites;
