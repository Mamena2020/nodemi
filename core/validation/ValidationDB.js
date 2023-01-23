import db from "../../config/database/Database.js"

class ValidationDB {


    static async exists(tableName, column, field) {
        let result = await db.query(`select ${column} from ${tableName} where ${column} = :email  limit 1`, {
            replacements: {
                email: field
            }
        }).then((e) => {
            if (e[0].length == 0) return false
            return true
        }).catch(() => {
            return false
        })
        return result
    }


}

export default ValidationDB


