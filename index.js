import dotenv from 'dotenv'
import express from "express";
import core from "./core/core.js"

dotenv.config()

const port = process.env.APP_PORT || 5000
// const host = process.env.APP_HOST || "http://localhost"
const app = express()

app.use(express.static("public"));
app.use(express.static("storage"));

await core(app)

app.listen(port, () => {
    console.log(`server running on: ${port}`)
})

