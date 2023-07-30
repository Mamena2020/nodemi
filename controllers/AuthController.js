import User from "../models/User.js"
import bcrypt from 'bcrypt'
import RegisterRequest from "../requests/auth/RegisterRequest.js";
import JwtAuth from "../core/auth/JwtAuth.js";
// uncomment the line below if AUTH_EMAIL_VERIFICATION on .env is set to "true"
import AccountVerify from "../mails/AccountVerify/AccountVerify.js"
import crypto from "crypto"

const login = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        const match = await bcrypt.compare(password, user.password)

        if (!match) return res.status(400).json({ message: "wrong password" })

        if (user.verified_at > 0) {
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
            res.json({ message: "login success", "accessToken": token.accessToken })
        } else {
            return res.json({ message: "Verify your account first.." })
        }
    } catch (error) {
        console.log(error)
    }
}

const register = async (req, res) => {
    try {

        let valid = new RegisterRequest(req)
        await valid.check()
        if (valid.isError)
            return valid.responseError(res)

        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        const authEmailVerification = process.env.AUTH_EMAIL_VERIFICATION
        const verificationToken = authEmailVerification === "true" ? randomTokenString() : ""

        let user = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            verification_token: verificationToken
        })

        await user.setRole("customer")

        /** Account Verification
         * if AUTH_EMAIL_VERIFICATION on .env is set to "true" then:
         * "create npx nodemi make:mail AccountVerify"
         * and then place import on the top of this file:
         * import AccountVerify from "../mails/AccountVerify/AccountVerify.js"
        */
        if(authEmailVerification === "true") {
            const sendMail = new AccountVerify("kitainvite@gmail.com", [email], "Verify Your Account", verificationToken)
            
            await sendMail.send()
        }
        // ----------- End of account verification

        res.json({ message: "register success" }).status(200)

    } catch (error) {
        console.log(error)
    }
}

// if AUTH_EMAIL_VERIFICATION on .env is set to "true"
const emailVerification = async (req, res) => {
    try {
        const user = await User.findOne({ where: { verification_token: req.params.token } })

        if (!user) {
            res.json({ message: "Invalid token." })
        } else {
            await user.update({
                verification_token: '',
                verified_at: new Date()
            })

            res.json({ message: "Email verification success" }).status(200)
        }

    } catch (error) {
        console.log(error)
    }
}
// ----------- End of account verification

const refreshToken = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.sendStatus(401)

        const user = await User.findOne(
            {
                where: {
                    refresh_token: refreshToken
                }
            }
        )

        if (!user) return res.sendStatus(403)

        let accessToken = JwtAuth.regenerateAccessToken(refreshToken)

        if (!accessToken)
            res.status(403)

        res.json({ message: "get token success", "accessToken": accessToken })

    } catch (error) {
        console.log(error)
    }
}

const logout = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;
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

        res.status(200).json({ message: "logout success" })


    } catch (error) {
        console.log(error)
    }

}

function randomTokenString() {
    return crypto.randomBytes(25).toString('hex')
}

export default {
    login,
    register,
    emailVerification,
    refreshToken,
    logout
}