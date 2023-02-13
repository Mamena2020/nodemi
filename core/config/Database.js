import dotenv from 'dotenv'
dotenv.config()

let logging = false
if (process.env.DB_DEBUG_LOG == "true" || process.env.DB_DEBUG_LOG == true)
    logging = true

/**
 * Database config
 */
const databaseConfig = {
    "username": process.env.DB_USERNAME || 'root',
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "",
    "host": process.env.DB_HOST || "localhost",
    "dialect": process.env.DB_CONNECTION,
    "logging": logging
}
export default databaseConfig