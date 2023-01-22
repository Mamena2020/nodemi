import dotenv from 'dotenv'
import express from "express";
import routers from "./routes/web.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import databaseSync from "./config/database/DatabaseSync.js";
import Middleware from "./core/middleware/Middleware.js"

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.static("public"));
app.use(express.static("storage"));

// app.use(cors({
//     credentials: true,
//     origin: ['http:localhost:3000']
// }))
app.use(cors())

// read cookie from client 
app.use(cookieParser())

// read reques body json & formData
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// default middleware
Middleware(app)

routers(app)

databaseSync()

app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})

