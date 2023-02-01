import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import authJwt from "../core/middleware/AuthJwt.js";
import Requests from "../middleware/Requests.js";



const routerAuth = express.Router()
const api = express.Router()

export default function routers(app) {
    app.get("/apis", (req, res) => {
        let list = []
        app._router.stack.forEach(r => {
            if (r.route) {
                list.push(r.route.path)
            }
        });
        res.json(list)
    })
}

