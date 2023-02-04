
import express from "express";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import JwtAuthPass from "../core/middleware/JwtAuthPass.js";
import Requests from "../middleware/Requests.js";

import testValidation from "../core/validation/test/TestValidation.js";

const routerApi = express.Router()
const routerAuth = express.Router()

export default function (app) {

    routerApi.post("/login", Requests.login, AuthController.login)
    routerApi.post("/register", AuthController.register)
    routerApi.get("/token", AuthController.refreshToken)
    routerApi.delete("/logout", AuthController.logout)
    
    routerApi.post("/validation", testValidation)

    routerAuth.use(JwtAuthPass)
    routerAuth.get("/user", UserController.getUser)
    routerAuth.get("/users", UserController.getUsers)
    routerAuth.post("/upload", UserController.upload)

    routerApi.use(routerAuth)

    app.use("/api", routerApi)
}
