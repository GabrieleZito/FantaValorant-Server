const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fantavalorant", "user", "pass", {
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
    port: 3306,
});

module.exports = sequelize;
