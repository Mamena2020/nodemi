import User from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import RegisterRequest from "../requests/auth/RegisterRequest.js";
import JwtHelper from "../core/helper/JwtHelper.js";

const login = async (req, res) => {


    try {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        const match = await bcrypt.compare(password, user.password)

        if (!match) return res.json({ message: "wrong password" }).status(400)
        
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const token = JwtHelper.createToken(payload)
        await user.update({
            refresh_token: token.refreshToken
        })
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: true
        })
        res.json({ message: "login success", "accessToken": token.accessToken })
    } catch (error) {
        console.log(error)
    }
}

const register = async (req, res) => {
    try {

        let valid = new RegisterRequest(req)
        await valid.check()
        if (valid.isError)
            return res.json(valid.errors).status(402)

        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        let user = await User.create({
            name: name,
            email: email,
            password: hashPassword
        })
        console.log("user.id",user.id)
        console.log("user.email",user.email)
        await user.setRole("customer")
        res.json({ message: "register success" }).status(200)
    } catch (error) {
        console.log(error)
    }
}


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
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const newData = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            const accessToken = jwt.sign(newData, process.env.JWT_ACCESS_TOKEN_SECRET, {
                expiresIn: '1000s'
            })
            res.json({ message: "get token success", "accessToken": accessToken })
        })
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
                refresh_token: refreshToken
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


export default {
    login,
    register,
    refreshToken,
    logout
}