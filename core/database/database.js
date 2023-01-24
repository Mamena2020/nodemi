import { Sequelize } from "sequelize";
import DatabaseConfig from "../../config/DatabaseConfig.js";

const db = new Sequelize(DatabaseConfig.database, DatabaseConfig.username, DatabaseConfig.password,
    {
        'host': DatabaseConfig.host,
        'dialect': DatabaseConfig.dialect
    });

export default db