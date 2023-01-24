import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authJwt = async (req, res, next) => {

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

const authUser = async (req) => {
    try {
        return await new Promise(async (resolve, reject) => {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return reject({ error: "no refresh token" })
            }
            var user = await User.findOne({
                where: {
                    refresh_token: refreshToken
                }
            })

            if (!user) {
                console.log("auth user failed1")
                return reject({ error: "auth user failed" })
            }
            return resolve(user)
        })

    } catch (error) {
        console.log(error)
        return null
    }
}

export default authJwt
export { authUser }
