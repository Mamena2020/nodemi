import express from "express";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import JwtAuthPass from "../core/middleware/JwtAuthPass.js";;
// import BasicAuthPass from "../core/middleware/BasicAuthPass.js";;
import Requests from "../middleware/Requests.js";


export default function api(app) {

    const routerGuest = express.Router()
    routerGuest.post("/login", Requests.login, AuthController.login)
    routerGuest.post("/register", AuthController.register)
    routerGuest.get("/email-verification/:token", AuthController.emailVerification)
    routerGuest.get("/token", AuthController.refreshToken)
    routerGuest.delete("/logout", AuthController.logout)
    routerGuest.post("/forgot-password", AuthController.forgotPassword)
    routerGuest.put("/reset-password/:token", AuthController.resetPassword)
    // routerGuest.get("/users2", BasicAuthPass, UserController.getUsers)
    app.use("/api", routerGuest)
    // routerGuest.get("/:locale/users", LocalePass, UserController.getUsers)

    const routerAuth = express.Router()
    routerAuth.get("/user", JwtAuthPass, UserController.getUser)
    routerAuth.get("/users", JwtAuthPass, UserController.getUsers)
    routerAuth.post("/upload", JwtAuthPass, UserController.upload)

    app.use("/api", routerAuth)

}