import { Sequelize } from "sequelize";
import databaseConfig from "../config/Database.js";

const db = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password,
    {
        host: databaseConfig.host,
        dialect: databaseConfig.dialect,
        logging: databaseConfig.logging
    })

export default db