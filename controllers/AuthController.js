import User from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import LoginRequest from "../requests/auth/LoginRequest.js";
import RegisterRequest from "../requests/auth/RegisterRequest.js";

const login = async (req, res) => {


    try {
        console.log("login")
        // const valid = await new LoginRequest(req)
        // await valid.check()
        // if (valid.isError())
        //     return res.json(valid.errors).status(402)

        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.json({ message: "wrong password" }).status(400)
        const newData = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const accessToken = jwt.sign(newData, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign(newData, process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await user.update({
            refresh_token: refreshToken
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: true
        })
        res.json({ message: "login success", "accessToken": accessToken })
    } catch (error) {
        console.log(error)
    }
}

const register = async (req, res) => {
    try {

        let valid = new RegisterRequest(req)
        await valid.check()
        if (valid.isError())
            return res.json(valid.errors).status(402)

        const { name, email, password, confirmPassword } = req.body;
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        await User.create({
            name: name,
            email: email,
            password: hashPassword
        })
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