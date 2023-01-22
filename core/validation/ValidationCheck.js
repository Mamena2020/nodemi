import validator from "validator"

/**
 * 
 * @param {*} validation ex: required, float
 * @param {*} field 
 * @returns bolean
 */
const ValidationCheck = (validation, field) => {


    if (validation === "required") {
        if (field === undefined || field === null)
            return false
    }

    if (validation === "email")
        return validator.isEmail(field.toString())
    if (validation === "float") {
        return (typeof field === "number")
    }

    if (validation === "integer")
        return validator.isInt(field.toString())
    if (validation === "date")
        return validator.isDate(field.toString())
    if (validation === "string")
        return (typeof field === "string")




    return true
}








export default ValidationCheck