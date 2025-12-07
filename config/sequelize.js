const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "../fantavalorant.sqlite", 
    logging: false,
});

module.exports = sequelize;
