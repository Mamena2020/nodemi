import dotenv from 'dotenv'
import express from 'express'
dotenv.config()



const mediaStorages = Object.freeze({
    local: "local",
    firebase: "firebase"
})

let appUrl = process.env.APP_URL ?? "http://localhost::5000"

const mediaConfig = {
    localStorageDirectory: process.env.MEDIA_LOCAL_STORAGE_DIR_NAME || "storage",
    mediaStorage: process.env.MEDIA_STORAGE || mediaStorages.local,
    rootMediaUrl: appUrl + "/"
}


/**
 * Setup dir as public where media is stored 
 * @param {*} app express js app 
 */
const routeStoragePublic = (app) => {
    app.use(express.static(process.env.MEDIA_LOCAL_STORAGE_DIR_NAME || "storage"));
}

export default mediaConfig
export { routeStoragePublic, mediaStorages }