import db from "../database/Database.js"

class ValidationDB {


    static async exists(tableName, column, field, exception) {
        let result = await db.query(`SELECT ${column} FROM ${tableName} WHERE ${column} = :field AND id != :exception  limit 1`, {
            replacements: {
                field: field,
                exception: exception ?? -1
            }
        }).then((e) => {
            // console.log("exist", e)
            if (e[0].length == 0) return false
            return true
        }).catch((e) => {
            // console.log("error exists", e)
            return false
        })
        return result
    }
    static async unique(tableName, column, field, exception) {
        let result = await db.query(`SELECT ${column} FROM ${tableName} WHERE ${column} = :field AND id != :exception limit 1`, {
            replacements: {
                field: field,
                exception: exception ?? -1
            }
        }).then((e) => {
            // console.log("unique", e)
            if (e[0].length == 0) return true
            return false
        }).catch((e) => {
            // console.log("error unique", e)
            return false
        })
        return result
    }


}

export default ValidationDB


