
import express from "express";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import JwtAuthPass from "../core/middleware/JwtAuthPass.js";
import LocalePass from "../core/middleware/localePass.js";
import Requests from "../middleware/Requests.js";



export default function api(app) {

    const routerGuest = express.Router()
    routerGuest.post("/login", Requests.login, AuthController.login)
    routerGuest.post("/register", AuthController.register)
    routerGuest.get("/token", AuthController.refreshToken)
    routerGuest.delete("/logout", AuthController.logout)

    // routerGuest.get("/:locale/users", LocalePass, UserController.getUsers)
    app.use("/api", routerGuest)


    const routerAuth = express.Router()
    routerAuth.use(JwtAuthPass)
    routerAuth.get("/user", UserController.getUser)
    routerAuth.post("/upload", UserController.upload)
    routerAuth.delete("/deletemedia/:userId", UserController.deleteMedia)
    app.use("/api", routerAuth)

}
