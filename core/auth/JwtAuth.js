import jwt from "jsonwebtoken";
import AuthConfig from "../config/Auth.js";

class JwtAuth {



    /**
     * Create access token & refresh token by using payload
     * @param {*} payload 
     * @returns 
     */

    static createToken(payload) {
        let accessToken = jwt.sign(payload, process.env.AUTH_JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED
        })
        let refreshToken = jwt.sign(payload, process.env.AUTH_JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED
        })
        return {
            accessToken,
            refreshToken
        }
    }

    /**
     * generate access token using refresh token
     * @param {*} refreshToken 
     * @returns 
     */

    static regenerateAccessToken(refreshToken) {
        return jwt.verify(refreshToken, process.env.AUTH_JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return

            delete decoded.exp

            let accessToken = jwt.sign(decoded, process.env.AUTH_JWT_ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED
            })
            return accessToken
        })
    }


    /**
     * Get user object using refresh token from cookies
     * @param {*} req request 
     * @returns 
     */
    static async getUser(req) {
        try {
            return await new Promise(async (resolve, reject) => {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return reject({ error: "no refresh token" })
                }
                var user = await AuthConfig.user.findOne({
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

}

export default JwtAuth