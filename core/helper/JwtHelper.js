import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

class JwtHelper {


    static createToken(payload) {
        let accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED
        })
        let refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED
        })
        return {
            accessToken,
            refreshToken
        }
    }

}

export default JwtHelper