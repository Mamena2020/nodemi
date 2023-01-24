import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import express from "express";
import core from "./core/core.js"
import cors from 'cors'

dotenv.config()

const port = process.env.PORT || 5000
const app = express()


// app.use(cors({
//     credentials: true,
//     origin: ['http:localhost:3000']
// }))

app.use(cors())

app.use(express.static("public"));
app.use(express.static("storage"));

// read cookie from client 
app.use(cookieParser())

// read reques body json & formData
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

await core(app)


app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})

