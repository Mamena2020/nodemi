import loadModels from "../../core/model/Models.js"
import db from "./Database.js"
// import User from "../../models/User.js"
// import UserDetail from "../../models/UserDetail.js"


const databaseSync = async () => {


    try {
        // process.env.PRODUCTION
        await db.authenticate()
        // db.drop(
        //     {
        //         cascade: true
        //     }
        // )
        // await db.sync({
        //     // alter: true,
          
        // });

        loadModels()

    } catch (error) {
        console.log(error)
    }
}
export default databaseSync