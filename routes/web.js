import express from "express";

import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";

import authJwt from "../middleware/authJwt.js";
import FileParsing from "../middleware/FilesParsing.js";

// import multer from "multer";
// const upload = multer({ dest: 'uploads/' })


const router = express.Router()
const routerfile = express.Router()
export default (app) => {

    app.post("/login", AuthController.login)
    app.post("/register", AuthController.register)
    app.get("/token", AuthController.refreshToken)
    app.delete("/logout", AuthController.logout)

    // app.post("/upload2", UserController.upload)
    routerfile.use(FileParsing)
    routerfile.post("/upload3", UserController.upload3)
    app.use(routerfile)

    router.use(authJwt)
    router.get("/user", UserController.getUser)

    router.post("/upload", UserController.storeFile)

    app.use(router)
}



// export default router

