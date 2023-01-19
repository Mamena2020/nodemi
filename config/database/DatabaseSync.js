import db from "./Database.js"
import User from "../../models/User.js"
import UserDetail from "../../models/UserDetail.js"


const databaseSync = async () => {


    try {
        // process.env.PRODUCTION
        await db.authenticate()
        
        // await User.sync({
        //     alter: true,
        // })
        // await UserDetail.sync({
        //     alter: true
        // })

    } catch (error) {
        console.log(error)
    }
}
export default databaseSync