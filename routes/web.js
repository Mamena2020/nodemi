import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import authJwt from "../middleware/authJwt.js";
import Requests from "../middleware/Requests.js";



const routerAuth = express.Router()
const api = express.Router()

export default function routers(app) {

    // v0(app)

    app.get("/apis", (req, res) => {

        let list = []

        app._router.stack.forEach(r => {
            if (r.route) {
                list.push(r.route.path)
                console.log(r.route.path)
            }
        });
        res.json(list)
    })

    app.post("/login", Requests.login, AuthController.login)
    app.post("/register", AuthController.register)
    app.get("/token", AuthController.refreshToken)
    app.delete("/logout", AuthController.logout)

    // api.post("/register", AuthController.register)
    // app.use("/api",api)

    routerAuth.use(authJwt)
    routerAuth.get("/user", UserController.getUser)
    routerAuth.post("/upload", UserController.upload)


    app.use(routerAuth)

}

