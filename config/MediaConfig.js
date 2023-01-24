import dotenv from 'dotenv'
dotenv.config()

const mediaConfig = {
    localStorageDirectory: "storage",
    usingLocalStorage: true,
    root_media_url: process.env.APP_URL ?? ''
}
export default mediaConfig