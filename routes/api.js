import express from "express";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import JwtAuthPass from "../core/middleware/JwtAuthPass.js";;
import Requests from "../middleware/Requests.js";


export default function api(app) {

    const routerGuest = express.Router()
    routerGuest.post("/login", Requests.login, AuthController.login)
    routerGuest.post("/register", AuthController.register)
    routerGuest.get("/token", AuthController.refreshToken)
    routerGuest.delete("/logout", AuthController.logout)
    routerGuest.get("/users", UserController.getUsers)
    app.use("/api", routerGuest)
    // routerGuest.get("/:locale/users", LocalePass, UserController.getUsers)



    const routerAuth = express.Router()
    routerAuth.use(JwtAuthPass)
    routerAuth.get("/user", UserController.getUser)
    routerAuth.post("/upload", UserController.upload)

    app.use("/api", routerAuth)

}