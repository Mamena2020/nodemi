import jwt from "jsonwebtoken";
import AuthConfig from "../config/auth.js"



/**
 * Jwt middleware checking access token from header bearer token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const JwtAuthPass = async (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(403).json({ message: "unauthorized" })
    }
    await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {

        if (err) return res.status(403).json({ message: "unauthorized" })
        const currentDate = new Date()
        if (decoded.exp * 1000 < currentDate.getTime())
            return res.status(410).json({ message: "access token expired" })

        next()
    })
}



export default JwtAuthPass
