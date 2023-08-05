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

const login = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        const match = await bcrypt.compare(password, user.password)

        if (!match) return res.status(400).json({ message: "Wrong password" })

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

const register = async (req, res) => {
    try {

        const valid = new RegisterRequest(req)
        await valid.check()
        if (valid.isError)
            return valid.responseError(res)

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

const emailVerification = async (req, res) => {
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

const refreshToken = async (req, res) => {

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

const logout = async (req, res) => {

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

const forgotPassword = async (req, res) => {

    try {

        if (!mailConfig.host) return res.status(409).json({ message: "You are not set SMTP at MAIL_HOST on .env" })

        const valid = new ForgotPasswordRequest(req)
        await valid.check()
        if (valid.isError) return valid.responseError(res)

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

const resetPassword = async (req, res) => {

    try {
        const token = req.params.token

        const valid = new ResetPasswordRequest(req)
        await valid.check()
        if (valid.isError) return valid.responseError(res)

        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expires: { [Op.gt]: Date.now() }
            }
        })

        if (!user) {
            valid.addError("token", "Inavalid token or token expired")
            return valid.responseError(res)
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

async function passwordHash(password) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
}

function randomTokenString() {
    return crypto.randomBytes(25).toString('hex')
}

export default {
    login,
    register,
    emailVerification,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
}