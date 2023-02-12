import db from "./../database/Database.js"

class ValidationDB {


    static async exists(tableName, column, field, exception) {
        let result = await db.query(`select ${column} from ${tableName} where ${column} = :field and id <> :exception  limit 1`, {
            replacements: {
                field: field,
                exception: exception ?? ''
            }
        }).then((e) => {
            if (e[0].length == 0) return false
            return true
        }).catch(() => {
            return false
        })
        return result
    }
    static async unique(tableName, column, field, exception) {
        let result = await db.query(`select ${column} from ${tableName} where ${column} = :field and id <> :exception limit 1`, {
            replacements: {
                field: field,
                exception: exception ?? ''
            }
        }).then((e) => {
            if (e[0].length == 0) return true
            return false
        }).catch(() => {
            return false
        })
        return result
    }


}

export default ValidationDB


