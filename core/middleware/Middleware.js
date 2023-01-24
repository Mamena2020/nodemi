import mediaRequestHandling from './MediaRequestHandling.js'
// import CorsHandling from './CorsHandling.js'
// import express from "express";
// import cookieParser from "cookie-parser";

export default (app) => {

    //------------------------------------------------------- Media upload handling
    app.use(mediaRequestHandling)
    //------------------------------------------------------- 

}