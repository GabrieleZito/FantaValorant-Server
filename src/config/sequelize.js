import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

// @ts-ignore
const sequelize = new Sequelize("fantavalorant", process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_URL,
    dialect: "mysql",
    logging: false,
    port: process.env.DATABASE_PORT,
});

export default sequelize;
