import mediaRequestHandling from './MediaRequestHandling.js'
import CorsHandling from './CorsHandling.js'
import express from "express";
import cookieParser from "cookie-parser";

export default (app) => {

    CorsHandling(app)

    // read cookie from client 
    app.use(cookieParser())

    // read reques body json & formData
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    //------------------------------------------------------- Media upload handling
    app.use(mediaRequestHandling)
    //------------------------------------------------------- 

}