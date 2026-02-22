import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

// @ts-ignore
/* const sequelize = new Sequelize("fantavalorant", process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_URL,
    dialect: "mysql",
    logging: false,
    port: process.env.DATABASE_PORT,
}); */

// @ts-ignore
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectModule: require("pg"),
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // required for Neon
        },
    },
});

export default sequelize;
