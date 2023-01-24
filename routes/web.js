import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import authJwt from "../middleware/authJwt.js";
import Requests from "../middleware/Requests.js";




const routerAuth = express.Router()

export default function routers(app) {
    
    app.post("/login", Requests.login, AuthController.login)
    app.post("/register", AuthController.register)
    app.get("/token", AuthController.refreshToken)
    app.delete("/logout", AuthController.logout)
    
    routerAuth.use(authJwt)
    routerAuth.get("/user", UserController.getUser)
    routerAuth.post("/upload", UserController.upload)
    app.use(routerAuth)
}
