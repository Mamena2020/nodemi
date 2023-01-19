import express from "express";

import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";

import authJwt from "../middleware/authJwt.js"; 

const router = express.Router()
export default (app) => {

    app.post("/login", AuthController.login)
    app.post("/register", AuthController.register)
    app.get("/token", AuthController.refreshToken)
    app.delete("/logout", AuthController.logout)
    
    router.use(authJwt)
    router.get("/user", UserController.getUser)
    app.use(router)
}



// export default router

