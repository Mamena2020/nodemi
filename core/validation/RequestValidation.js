import validator from 'validator'
import ValidationDB from './ValidationDB.js'

const ValidationType = Object.freeze({
    required: "required",
    email: "email",
    match: "match",
    string: "string",
    float: "float",
    integer: "integer",
    max: "max",
    min: "min",
    date: "date",
    array: "array",
    exists: "exists"
    // digits_between: "digits_between", //1 - 2
})

const MessageType = Object.freeze({
    must: "must be",
    matchWith: "must be match with",
    is: "is",
    between: "between",
    validFormat: "must be valid format of",
    max: "should be less or equal than",
    min: "should be more or equal than",
    exists: "not recorded in database"
    // digit: [
    //     "should be",
    //     "digit"
    // ]
})


class RequestValidation {

    errors = {}

    constructor(req) {
        this.body = req.body
    }

    isError() {
        return !(JSON.stringify(this.errors) === JSON.stringify({}))
    }

    async load(child) {
        this.rules = child.rules();
        // await this.check()
    }

    async check() {
        this.errors = {}
        console.log("--------------------------------------------------- field")
        console.log(this.body)
        console.log("--------------------------------------------------- rules")
        console.log(this.rules)
        console.log("=================================================== Checking")
        for (let ruleKey in this.rules) {
            if (this.#hasField(ruleKey)) {
                await this.#checking(ruleKey)
            }
            else {
                if (this.#ruleHasRuleRequired(ruleKey)) {
                    this.#setError(ruleKey, "required")
                }
            }
        }
        return this.isError()
    }
    #ruleHasRuleRequired(ruleKey) {
        let validation = this.rules[ruleKey].validation
        for (let keyValidation of validation) {
            if (keyValidation == "required") {
                return true
            }
        }
        return false
    }

    #hasField(ruleKey) {
        for (let fieldKey in this.body) {
            if (ruleKey.toString() == fieldKey.toString()) {
                return true
            }
        }
        return false
    }
    #getField(key) {
        for (let fieldKey in this.body) {
            if (key.toString() == fieldKey.toString()) {
                return this.body[key]
            }
        }
        return null
    }

    #setError(ruleKey, validation, options) {
        let message = this.#setErrorMessage(ruleKey, validation, options)
        if (!this.errors[ruleKey]) {
            this.errors[ruleKey] = []
        }
        this.errors[ruleKey].push(message)
    }



    #setErrorMessage(ruleKey, validation, options) {
        if (this.rules[ruleKey].message && this.rules[ruleKey].message[validation]) {
            return this.rules[ruleKey].message[validation]
        }
        let attribute = this.rules[ruleKey].attribute ?? ruleKey
        let type = this.#errorTypeCategories(validation)
        return this.#defaultErrorMessage(
            attribute,
            type,
            validation,
            options
        )
    }
    #errorTypeCategories(val) {
        if (val === ValidationType.email || val === ValidationType.date || val === ValidationType.float ||
            val === ValidationType.integer || val == ValidationType.array)
            return MessageType.validFormat
        if (val === ValidationType.required)
            return MessageType.is
        if (val === ValidationType.match)
            return MessageType.matchWith
        if (val === ValidationType.max)
            return MessageType.max
        if (val === ValidationType.min)
            return MessageType.min
        if (val === ValidationType.exists)
            return MessageType.exists

        return MessageType.must
    }

    #defaultErrorMessage(attribute, type, validation, options) {
        attribute = attribute[0].toUpperCase() + attribute.slice(1);

        if (type === MessageType.matchWith || type === MessageType.max || type === MessageType.min) {
            validation = options
        }

        return "The " + attribute + " " + type + " " + validation
    }


    /**
     * 
     * @param {*} ruleKey  ex: password, id, name, 
     * @returns 
     */
    async #checking(ruleKey) {
        var field = this.body[ruleKey]
        let validations = this.rules[ruleKey].validation
        console.log(">>>>--------------------------------------->>>>")
        console.log(validations)
        if (!Array.isArray(validations)) {
            // console.log("validations not an array", key)
            return null;
        }

        for (let validation of validations) {
            // val, ex: float, required, date etc...
            console.log("--------------")
            console.log(validation, field)
            let options
            let validationName
            let hasParams = this.#isValidationHasParam(validation)
            let validationParams
            // ex: max:3, min:5    
            if (hasParams) {
                console.log("CREATE PARAMS")
                options = this.#createOptionsParams(ruleKey, validation)
                validationName = this.#getValidateNameFromValidationWithParams(validation)
            }
            else {
                validationName = validation
                console.log("not sCREATE PARAMS")
            }
            let isValid = await this.ValidationCheck(validationName, field, { options: options })

            if (!isValid) {
                console.log("ERROR")
                console.log(validationName)
                if (hasParams) {
                    validationParams = this.#getValidateParams(validation)
                    console.log("validationParams", validationParams)
                }
                this.#setError(ruleKey, validationName, validationParams)
            } else {
                console.log("NOT ERROR")
            }

        }
        console.log("<<<<---------------------------------------<<<<")
    }


    /**
    * 
    * @param {*} validation ex: match:oldPassword
    * @returns 
    */
    #isValidationHasParam(validation) {
        if (validation.indexOf(":") !== -1) return true
        return false
    }


    /**
     * 
     * @param {*} validation ex: match:oldPassword
     * @returns match
     */
    #getValidateNameFromValidationWithParams(validation) {
        let arr = validation.split(":")
        return arr[0]
    }

    /**
     * 
     * @param {*} validation ex: digit_between:1,2
     * @returns [1,2]
     */
    #getValidateParams(validation) {
        let arr = validation.split(":")
        arr = arr.splice(1, 1);
        console.log("arr", arr)
        console.log("validation", validation)
        if (arr[0].indexOf(",") !== -1) {
            return arr[0].split(",")
        }
        return arr
    }

    /**
     * 
     * @param {*} validation ex: match:password, max:2, min:3
     * @param {*} field 
     */
    #createOptionsParams(ruleKey, validation) {

        let arr = validation.split(":")
        let options = {}
        if (arr.length > 1) {
            if (arr[0] === ValidationType.match) {
                let fieldMatch = this.#getField(arr[1])
                console.log("fieldMatch////////////////", fieldMatch)
                if (!fieldMatch)
                    throw "not right format of validation: " + validation
                options["fieldMatch"] = fieldMatch
            }
            if (arr[0] === ValidationType.max || arr[0] === ValidationType.min) {
                let param = arr[1]
                console.log("param////////////////", param)
                if (!param)
                    throw "not right format of validation: " + validation
                if (arr[0] === ValidationType.max)
                    options["fieldMax"] = param
                if (arr[0] === ValidationType.min)
                    options["fieldMin"] = param
            }
            if (arr[0] === ValidationType.exists) {
                console.log("arr", arr)
                let params = arr[1].split(",")
                if (params.length < 2)
                    throw "not right format of validation: " + validation

                options["fieldTableName"] = params[0]
                options["fieldColumnName"] = params[1]

            }
        }
        else {
            throw "not right format of validation: " + validation
        }

        return options

    }


    /**
     * 
     * @param {*} validation ex: required, float
     * @param {*} field 
     * @returns bolean
     */
    async ValidationCheck(validationName, field, { options }) {

        console.log("validationName...", validationName)
        console.log("field...", field)
        console.log("options...", options)

        //------------------------------------------------------ database
        if (validationName == ValidationType.exists) {
            let d = await ValidationDB.exists(options.fieldTableName, options.fieldColumnName, field)
            console.log("ddddddddddddddd", d)
            return d
        }

        //------------------------------------------------------ has params
        if (validationName === ValidationType.match)
            return validator.matches(field ?? " .", options?.fieldMatch ?? " ")
        if (validationName === ValidationType.max) {
            if (Array.isArray(field)) {
                return field.length <= options.fieldMax
            }
            return validator.isFloat(field.toString() ?? "0", { max: options.fieldMax ?? " " })
        }

        if (validationName === ValidationType.min) {
            if (Array.isArray(field)) {
                return field.length >= options.fieldMin
            }
            return validator.isFloat(field.toString() ?? "0", { min: options.fieldMin ?? " " })
        }


        //------------------------------------------------------ has no params

        if (validationName === ValidationType.required) {
            if (field === undefined || field === null)
                return false
        }
        if (validationName === ValidationType.email)
            return validator.isEmail(field.toString())
        if (validationName === ValidationType.float)
            return (typeof field === "number")
        if (validationName === ValidationType.integer)
            return validator.isInt(field.toString())
        if (validationName === ValidationType.date) {
            let newDate = this.#formatDate(field)
            return validator.isDate(newDate.toString())
        }
        if (validationName === ValidationType.string)
            return (typeof field === "string")
        if (validationName === ValidationType.array)
            return (Array.isArray(field))


        return true
    }

    #formatDate(date) {
        try {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [year, month, day].join('/');
        } catch (error) {

        }
        return date
    }

}

export default RequestValidation
