import dotenv from 'dotenv'
dotenv.config()





/**
 * Mail config
 */
const mailConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM_ADDRESS,
    name: process.env.MAIL_FROM_NAME,
    testing: false,

}

export default mailConfig