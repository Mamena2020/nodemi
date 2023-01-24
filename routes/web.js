import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import authJwt from "../middleware/authJwt.js";
import Request from "../middleware/Request.js";




const routerAuth = express.Router()
routerAuth.use(authJwt)

export default function routers(app) {


    app.post("/login", Request.login, AuthController.login)
    app.post("/register", AuthController.register)
    app.get("/token", AuthController.refreshToken)
    app.delete("/logout", AuthController.logout)

    routerAuth.get("/user", UserController.getUser)
    routerAuth.post("/upload", UserController.upload)
    app.use(routerAuth)
}
