import dotenv from 'dotenv'
dotenv.config()
const app_url = process.env.APP_URL ?? ''

const mediaConfig = {
    localStorage: "storage",
    usingLocalStorage: true,
    root_media_url: app_url
}
export default mediaConfig