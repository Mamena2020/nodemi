import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import { authUser } from "../core/middleware/AuthJwt.js";
import { GateAccess } from "../core/service/RolePermission/Service.js";
import UploadRequest from "../requests/user/UploadRequest.js";
import UserResource from "../resources/UserResource.js";
import UserHasRole from "../core/service/RolePermission/UserHasRole.js";
import Role from "../core/service/RolePermission/Role.js";
import Permission from "../core/service/RolePermission/Permission.js";


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


        // if (!GateAccess(user, ["user-create", "user-stored"])) {
        //     return res.sendStatus(403)
        // }

        console.log(user)

        let newUser = await new UserResource().make(user)

        res.json({ message: "get success", "user": newUser })

    } catch (error) {
        console.log(error)
    }
}

const getUsers = async (req, res) => {

    let users = await User.findAll()
    // res.json(users)

    // let users = await User.findAll()
    console.log(users)
    let resources = await new UserResource().collection(users)
    res.json(resources)

}




const upload = async (req, res) => {

    let valid = new UploadRequest(req)
    await valid.check()
    if (valid.isError)
        return valid.responseError(res)

    const user = await authUser(req)
    if (!user)
        return res.status(403).json({ message: "need auth" })

    await user.saveMedia(
        req.body.file,
        "avatar"
    )

    res.json("upload successfuly")
}


export default {
    getUser,
    getUsers,
    upload,
}



// const { User, Task } = require('./models');

// User.defaultScope(function(options) {
//   const { withTasks } = options;
//   const scopes = {};

//   if (withTasks) {
//     scopes.include = [{
//       model: Task
//     }];
//   }

//   return scopes;
// });

// User.findAll({ withTasks: true })
// .then(users => {
//   console.log(users.map(user => user.toJSON()));
// })
// .catch(error => {
//   console.error(error);
// });