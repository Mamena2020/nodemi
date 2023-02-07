
import express from "express";
import db from "./database/database.js"
import loadModels from "./model/Models.js"
import middleware from "./middleware/Middleware.js"
import { loadMedia } from "./service/MediaService.js"
import web from "../routes/web.js"
import api from "../routes/api.js"
import loadRolePermission from "./service/RolePermission/Service.js";
import seeder from "./seeder/Seeder.js";
import { routeStoragePublic } from "./config/media.js";

const load = async (app) => {

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

        //------------------------------------------------------- Seeder

        await seeder()

        //------------------------------------------------------- 



        //------------------------------------------------------- Middleware
        
        middleware(app)

        //------------------------------------------------------- 



        //------------------------------------------------------- Routers

        app.use(express.static("public"));
        
        routeStoragePublic(app)

        api(app)
        web(app)

        //------------------------------------------------------- 

        console.log("Ready!")

    } catch (error) {
        console.log("\x1b[31m", error, "\x1b[0m");
    }


}

export default load