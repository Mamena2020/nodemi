
import express from "express";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import authJwt from "../core/middleware/AuthJwt.js";
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

    routerAuth.use(authJwt)
    routerAuth.get("/user", UserController.getUser)
    routerAuth.post("/upload", UserController.upload)

    routerApi.use(routerAuth)

    app.use("/api", routerApi)
}
