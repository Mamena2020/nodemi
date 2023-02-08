import mediaRequestHandling from './MediaRequestHandling.js'
import CorsHandling from './CorsHandling.js'
import express from "express";
import cookieParser from "cookie-parser";


/**
 * Default middleware
 */
export default function defaultMiddleware(app)  {

    CorsHandling(app)

    // read cookie from client 
    app.use(cookieParser())

    // read reques body json & formData
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    //------------------------------------------------------- files upload handling & nested field 
    app.use(mediaRequestHandling)
    //------------------------------------------------------- 

}