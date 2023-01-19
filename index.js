import express from "express";

import router from "./routes/web.js";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import databaseSync from "./config/database/DatabaseSync.js";
dotenv.config()
const port = process.env.PORT || 5000


const app = express()

app.use(cors({
    credentials: true,
    origin: ['http:localhost:3000']
}))

// read cookie from client 
app.use(cookieParser())

// read reques body json & formData
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router(app)

databaseSync()




app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})

