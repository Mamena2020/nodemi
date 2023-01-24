import User from "../../models/User.js";
import UserDetail from "../../models/UserDetail.js";
import Media, { hasMedia } from '../service/MediaService.js'



const loadModels = async () => {

    await Media.loadSync({
        alter: true
    })

    await User.sync({
        alter: true,
        // force: true
    })
    await hasMedia(User)


    await UserDetail.sync({
        alter: true,
        // force: true
    })

    User.hasOne(UserDetail, {
        foreignKey: 'user_id',
        as: 'user_details'
    });

    UserDetail.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });


}

export default loadModels




