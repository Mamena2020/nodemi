
import express from "express";
import db from "./database/Database.js";
import { loadMedia } from "./service/Media/MediaService.js"
import loadRolePermission from "./service/RolePermission/Service.js"
import loadModels from "./model/Models.js"
import defaultMiddleware from "./middleware/Middleware.js"
import { routeStoragePublic } from "./config/Media.js"
import api from "../routes/api.js";
import web from "../routes/web.js";


const Load = async (app) => {
    return await new Promise(async (resolve, reject) => {
        try {
            console.log("load core....")
            //------------------------------------------------------- Database

            await db.authenticate()

            // db.drop({cascade: true})

            // await db.sync({alter: true})

            //------------------------------------------------------- 


            //------------------------------------------------------- Services

            await loadMedia()
            await loadRolePermission()

            //------------------------------------------------------- 



            //------------------------------------------------------- Models

            await loadModels() // all model

            //------------------------------------------------------- 



            //------------------------------------------------------- Middleware

            defaultMiddleware(app)

            //------------------------------------------------------- 



            //------------------------------------------------------- Routers

            app.use(express.static("public"));

            routeStoragePublic(app)

            api(app)
            web(app)

            //------------------------------------------------------- 
            return resolve("Ready")

        } catch (error) {
            return reject(error)
        }

    }

    )
}

export default Load