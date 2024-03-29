import User from "../models/User.js"
import bcrypt from 'bcrypt'
import RegisterRequest from "../requests/auth/RegisterRequest.js"
import JwtAuth from "../core/auth/JwtAuth.js"
import AccountVerify from "../mails/AccountVerify/AccountVerify.js"
import ForgotPassword from "../mails/ForgotPassword/ForgotPassword.js"
import { Op } from "sequelize"
import crypto from "crypto"
import mailConfig from "../core/config/Mail.js"
import AuthConfig from "../core/config/Auth.js"
import ResetPasswordRequest from "../requests/auth/ResetPasswordRequest.js"
import ForgotPasswordRequest from "../requests/auth/ForgotPasswordRequest.js"
import LoginRequest from "../requests/auth/LoginRequest.js"

export default class AuthController {

    /**
     * login
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async login(req, res) {

        try {

            const request = new LoginRequest(req)
            await request.check()
            if (request.isError) return request.responseError(res)

            const { email, password } = req.body

            const user = await User.findOne({ where: { email: email } })

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                request.addError("password", "wrong password")
                return request.responseError(res)
            }

            if (AuthConfig.emailVerification && !user.verified_at) {
                return res.json({ message: "Verify your account first.." })
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            }

            const token = JwtAuth.createToken(payload)

            await user.update({
                refresh_token: token.refreshToken
            })

            res.cookie('refreshToken', token.refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                // secure: true
            })
            res.json({ message: "Login success", "accessToken": token.accessToken })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * register
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async register(req, res) {
        try {

            const request = new RegisterRequest(req)
            await request.check()
            if (request.isError) return request.responseError(res)

            var { name, email, password } = req.body
            const verificationToken = randomTokenString()
            password = await passwordHash(password);
            const user = await User.create({
                name: name,
                email: email,
                password: password,
                verification_token: verificationToken
            })

            await user.setRole("customer")

            if (AuthConfig.emailVerification && mailConfig.host) {
                const sendMail = new AccountVerify(mailConfig.from, [email], "Verify Your Account", verificationToken)
                await sendMail.send()
            }

            res.json({ message: "Register success" }).status(200)

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * email verification
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async emailVerification(req, res) {
        try {

            const user = await User.findOne({ where: { verification_token: req.params.token } })

            if (!user) {
                return res.json({ message: "Invalid token." })
            }

            await user.update({
                verification_token: '',
                verified_at: new Date()
            })

            res.status(200).json({ message: "Email verification success" })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * refresh token
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async refreshToken(req, res) {

        try {

            const refreshToken = req.cookies.refreshToken

            if (!refreshToken) return res.sendStatus(401)

            const user = await User.findOne(
                {
                    where: {
                        refresh_token: refreshToken
                    }
                }
            )

            if (!user) return res.sendStatus(403)

            const accessToken = JwtAuth.regenerateAccessToken(refreshToken)

            if (!accessToken) res.status(403)

            res.json({ message: "Get token success", "accessToken": accessToken })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * logout
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async logout(req, res) {

        try {

            const refreshToken = req.cookies.refreshToken

            if (!refreshToken) return res.sendStatus(204)

            const user = await User.findOne(
                {
                    where: {
                        refresh_token: refreshToken
                    }
                }
            )

            if (!user) return res.sendStatus(204)

            await user.update({
                refresh_token: null
            })

            res.clearCookie("refreshToken")

            res.status(200).json({ message: "Logout success" })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }

    }

    /**
    * forgot password
    * @param {*} req express req
    * @param {*} res express res
    * @returns res
    */
    static async forgotPassword(req, res) {

        try {

            if (!mailConfig.host) throw Error("You are not set SMTP at MAIL_HOST on .env")

            const request = new ForgotPasswordRequest(req)
            await request.check()
            if (request.isError) return request.responseError(res)

            const { email } = req.body

            const user = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )

            const resetToken = randomTokenString()
            user.reset_token = resetToken
            user.reset_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
            await user.save()

            const sendMail = new ForgotPassword(mailConfig.from, [email], "Password Reset Request", resetToken)
            await sendMail.send()

            res.json({ message: "Please check your email." })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * reset password
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async resetPassword(req, res) {

        try {

            const token = req.params.token

            const request = new ResetPasswordRequest(req)
            await request.check()
            if (request.isError) return request.responseError(res)

            const user = await User.findOne({
                where: {
                    reset_token: token,
                    reset_token_expires: { [Op.gt]: Date.now() }
                }
            })

            if (!user) {
                request.addError("token", "Inavalid token or token expired")
                return request.responseError(res)
            }

            const { new_password } = req.body

            user.password = await passwordHash(new_password)
            user.password_reset = Date.now()
            user.reset_token = null
            user.reset_token_expires = null
            await user.save()

            res.json({ message: "Your password has been successfully reset." })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }
}

async function passwordHash(password) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
}

function randomTokenString() {
    return crypto.randomBytes(25).toString('hex')
}
