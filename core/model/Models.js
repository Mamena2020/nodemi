import User from "../../models/User.js"
import UserDetail from "../../models/UserDetail.js"
import { hasMedia } from "../service/Media/MediaService.js"
import { hasRole } from "../service/RolePermission/Role.js"



/**
 * All model will load here
 */
const loadModels = async () => {



    await User.sync({
        alter: true,
        // force: true
    })
    await hasMedia(User)
    await hasRole(User)


    await UserDetail.sync({
        alter: true,
    })

    User.hasOne(UserDetail, {
        foreignKey: 'user_id',
        as: 'user_details'
    });

    UserDetail.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    })

}

export default loadModels
