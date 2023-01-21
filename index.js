import express from "express";
import router from "./routes/web.js";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import databaseSync from "./config/database/DatabaseSync.js";
// import bb from 'express-busboy'

dotenv.config()
const port = process.env.PORT || 5000


const app = express()


// bb.extend(app);

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

router(app)

databaseSync()




app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})

