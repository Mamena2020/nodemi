
import express from "express";
import db from "./database/database.js"
import loadModels from "./model/Models.js"
import middleware from "./middleware/Middleware.js"
import { loadMediaModel } from "./service/MediaService.js"
import routers from "../routes/web.js"
import api from "../routes/api.js"
import loadRolePermission from "./service/RolePermission/Service.js";
import seeder from "./seeder/Seeder.js";

const load = async (app) => {

    try {
        console.log("load core....")
        //------------------------------------------------------- Database
        // process.env.PRODUCTION
        await db.authenticate()
        // db.drop({cascade: true})
        // await db.sync({alter: true})
        //------------------------------------------------------- 


        //------------------------------------------------------- Services


        //------------------------------------------------------- 



        //------------------------------------------------------- Models
        await loadRolePermission()
        await loadMediaModel() // media model
        await loadModels() // all model
        // //------------------------------------------------------- Seeder
        await seeder()

        //------------------------------------------------------- 



        //------------------------------------------------------- Middleware
        middleware(app)
        //------------------------------------------------------- 



        //------------------------------------------------------- Routers
        app.use(express.static("public"));
        app.use(express.static("storage"));

        api(app)
        // routers(app)

        //------------------------------------------------------- 

        console.log("Ready!")

    } catch (error) {
        console.log("\x1b[31m", error, "\x1b[0m");
    }


}

export default load