import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import { authUser } from "../middleware/authJwt.js";


const getUser = async (req, res) => {

    try {
        console.log("get user")
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401)
        const user = await User.findOne(
            {
                where: {
                    refresh_token: refreshToken
                },
                attributes: ['id', 'name', 'email'],
                include: [{
                    model: UserDetail,
                    as: 'user_details',
                    attributes: ['bio']
                }]
            }
        )

        if (!user) return res.sendStatus(404)

        let newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            url: user.firstMediaUrl
        }
        res.json({ message: "get success", "user": newUser })

    } catch (error) {
        console.log(error)
    }
}

const upload = async (req, res) => {
    console.log(req.body['files[]'])
    console.log(req.body['file'])
    if (!req.body['file'])
        return res.status(400).json({ message: "file not found" })

    const user = await authUser(req)
    if (!user)
        return res.status(403).json({ message: "need auth" })

    console.log("name", user.name)
    await user.saveMedia(
        req.body['file'],
        "avatar"
    )
    res.status(200).json("upload successfuly")
}


export default {
    getUser,
    upload,
}