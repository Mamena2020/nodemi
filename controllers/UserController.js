import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import { GateAccess } from "../core/service/RolePermission/Service.js";
import UploadRequest from "../requests/user/UploadRequest.js";
import UserResource from "../resources/UserResource.js";
import JwtAuth from "../core/auth/JwtAuth.js";


const getUser = async (req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;
        const user = await User.findOne(
            {
                where: {
                    refresh_token: refreshToken
                },
                attributes: ['id', 'name', 'email'],
                include: [
                    {
                        model: UserDetail,
                        as: 'user_details',
                        attributes: ['bio']
                    }
                ]
            }
        )

        if (!user) return res.status(404).json({ message: "user not found" })

        // example permission, should use-> user-access
        if (!GateAccess(user, ["user-create", "user-stored"])) return res.status(403).json({ message: "don'tdo not have permission" })

        const newUser = new UserResource().make(user)

        res.json({ message: "get success", "user": newUser })

    } catch (error) {
        console.log(error)
        res.status(409).json({ message: "something went wrong", reason: String(error) })
    }
}

const getUsers = async (req, res) => {

    const users = await User.findAll()
    
    const resources = new UserResource().collection(users)

    res.json(resources)

}

const upload = async (req, res) => {

    const valid = new UploadRequest(req)
    await valid.check()
    if (valid.isError)
        return valid.responseError(res)

    const user = await JwtAuth.getUser(req)

    await user.saveMedia(
        req.body.file,
        "avatar"
    )

    res.json("upload successfuly")
}


// const deleteMedia = async (req, res) => {
//     const userId = req.params.userId
//     const user = await User.findOne({
//         where: {
//             id: userId
//         }
//     })

//     user.destroyMedia("avatar")

//     res.json("media deleted")

// }

export default {
    getUser,
    getUsers,
    upload
}