import { Sequelize } from "sequelize";

const db = new Sequelize("2023_dapp", 'root', '', {
    'host': 'localhost',
    'dialect': 'mysql'
});

export default db