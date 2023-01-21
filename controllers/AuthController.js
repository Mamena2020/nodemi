import User from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const login = async (req, res) => {


    try {
        console.log("login")
        console.log(req.body)
        const { email, password } = req.body
        console.log(email)
        const user = await User.findOne(
            {
                where: {
                    email: email ?? ''
                }
            }
        )
        if (!user) return res.json({ message: "email not found" }).status(404)
        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.json({ message: "wrong password" }).status(400)
        const newData = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const accessToken = jwt.sign(newData, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign(newData, process.env.REFRESH_TOKEN_SECRET, {
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
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword)
            return res.json({ message: 'form still empty' }).status(402)

        if (password != confirmPassword)
            return res.json({ message: 'password & confirm password not same' }).status(400)

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
                refresh_token: refreshToken
            }
        )

        if (!user) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const newData = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            const accessToken = jwt.sign(newData, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '10000s'
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