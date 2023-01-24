import dotenv from 'dotenv'
dotenv.config()

let logging = false
if (process.env.SEQUELIZE_LOG == "true" || process.env.SEQUELIZE_LOG == true)
    logging = true

export default {
    "username": process.env.DB_USERNAME ?? 'root',
    "password": process.env.DB_PASSWORD ?? null,
    "database": process.env.DB_DATABASE ?? "2023_dapp",
    "host": process.env.DB_HOST ?? "localhost",
    "dialect": process.env.DB_CONNECTION,
    "logging": logging
}