import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";

const getUser = async (req, res) => {

    try {
        console.log("get user")
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401)
        console.log("get user")
        const user = await User.findOne(
            {
                where: {
                    refresh_token: refreshToken
                },
                attributes: ['id','name','email'],
                include: [{
                    model: UserDetail,
                    as: 'user_details',
                    // required: true,
                    attributes: ['bio']
                }]
            }
        )

        if (!user) return res.sendStatus(404)

        res.json({ message: "get success", "user": user })

    } catch (error) {
        console.log(error)
    }
}

export default {
    getUser
}