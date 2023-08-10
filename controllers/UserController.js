import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import { GateAccess } from "../core/service/RolePermission/Service.js";
import UploadRequest from "../requests/user/UploadRequest.js";
import UserResource from "../resources/UserResource.js";


export default class UserController {

    /**
     * get current user
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async getUser(req, res) {

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
            if (!GateAccess(user, ["user-create", "user-stored"])) return res.status(403).json({ message: "don't have permission" })

            const userResource = new UserResource().make(user)

            res.json({ message: "get success", "user": userResource })

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * get users
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async getUsers(req, res) {
        try {

            const users = await User.findAll()

            const resources = new UserResource().collection(users)

            res.json(resources)

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }
    }

    /**
     * upload current user avatar
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async uploadAvatar(req, res) {

        try {

            const valid = new UploadRequest(req)
            await valid.check()
            if (valid.isError)
                return valid.responseError(res)

            const user = req.user

            await user.saveMedia(
                req.body.file,
                "avatar"
            )

            res.json("upload successfuly")

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }

    }


    /**
     * delete current user avatar
     * @param {*} req express req
     * @param {*} res express res
     * @returns res
     */
    static async deleteAvatar(req, res) {

        try {

            const user = req.user

            await user.destroyMedia("avatar")

            res.json("media deleted")

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "something went wrong", reason: String(error) })
        }

    }


}
