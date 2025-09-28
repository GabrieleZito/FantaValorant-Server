const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

/* const sequelize = new Sequelize({
    dialect: "postgres",
    database: "postgres",
    username: "postgres",
    password: "1231231231",
    host: "localhost",
    port: 5432,
    logging: false,
}); */

/* console.log("Database name:", sequelize.getDatabaseName());
console.log("Connection config:", {
    host: sequelize.config.host,
    port: sequelize.config.port,
    database: sequelize.config.database,
    username: sequelize.config.username,
}); */

module.exports = sequelize;
