import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import { GateAccess } from "../core/service/RolePermission/Service.js";
import UploadRequest from "../requests/user/UploadRequest.js";
import UserResource from "../resources/UserResource.js";
import JwtAuth from "../core/auth/JwtAuth.js";
import { getPathLocalStorage } from "../core/service/MediaService.js";


const getUser = async (req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401)
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

        if (!user) return res.sendStatus(404)

        if (!GateAccess(user, ["user-create", "user-stored"])) {
            return res.sendStatus(403)
        }

        let newUser = new UserResource().make(user)

        res.json({ message: "get success", "user": newUser })

    } catch (error) {
        console.log(error)
    }
}

const getUsers = async (req, res) => {

    let users = await User.findAll()
    let resources = new UserResource().collection(users)
    res.json(resources)

}




const upload = async (req, res) => {

    let valid = new UploadRequest(req)
    await valid.check()
    if (valid.isError)
        return valid.responseError(res)

    const user = await JwtAuth.getUser(req)
    if (!user)
        return res.status(403).json({ message: "need auth" })

    await user.saveMedia(
        req.body.file,
        "avatar"
    )

    res.json("upload successfuly")
}


const deleteUser = async (req, res) => {
    const id = req.params.id
    await User.destroy({
        where: {
            id: id
        }
    })
    res.json("user deleted")
}

const deleteMedia = async (req, res) => {
    let id = req.params.id
    let user = await User.findOne({
        where: {
            id: id
        }
    })

    user.destroyMedia("avatar")
    
    res.json("media deleted")

}


export default {
    getUser,
    getUsers,
    upload,
    deleteUser,
    deleteMedia
}



