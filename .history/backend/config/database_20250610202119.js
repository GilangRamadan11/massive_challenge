import { Sequelize } from "sequelize";

const db = new Sequelize("massive_challenge", "root", "", {
    host: "localhost",
    dialect: "mysql",

});

export default db;