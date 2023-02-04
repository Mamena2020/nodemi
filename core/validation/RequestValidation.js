import validator from 'validator'
import ValidationDB from './ValidationDB.js'

/**
 * for add new rule
 * [1]. add on ValidationType
 * [2]. add MessageType
 * [3]. add type on errorTypeCategories()
 * [4]. add params if has params -> createOptionsParams()
 * [5]. add check validation on -> ValidationCheck()
 * [6]. add default message on defaultErrorMessage()
 */

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
    exists: "exists",
    unique: "unique",
    mimetypes: "mimetypes",
    mimes: "mimes",
    max_file: "max_file",
    image: "image",
    date_after: "date_after",
    date_after_or_equal: "date_after_or_equal",
    date_before: "date_before",
    date_before_or_equal: "date_before_or_equal",
    bolean: "bolean",
    in_array: "in_array",
    not_in_array: "not_in_array",
    ip: "ip",
    url: "url",
    json: "json",
    digits: "digits",
    max_digits: "max_digits",
    min_digits: "min_digits",
    digits_between: "digits_between", //1 - 2
})

const MessageType = Object.freeze({
    must: "must be",
    matchWith: "must be match with",
    is: "is",
    between: "between",
    digits: ["must be", "digits"],
    invalidFormat: "must be valid format of",
    max: "should be less or equal than",
    min: "should be more or equal than",
    exists: "not recorded in database",
    unique: "already used",
    after: "date must be after the",
    before: "date must be before the ",
    afterOrEqual: "date must be after or equal the",
    beforeOrEqual: "date must be before or equal the",
    invalidSelected: "selected field is invalid",
    digitsBetween: [
        "should be between",
        "and"
    ]
})


class RequestValidation {

    errors = {}
    isError = false
    constructor(req) {
        this.body = req?.body ?? {}
    }

    async load(child) {
        this.rules = child.rules();
        // await this.check()
    }

    async #checkError() {
        this.isError = true
        if (JSON.stringify(this.errors) === JSON.stringify({})) {
            this.isError = false
        }
    }

    responseError(res) {
        return res.status(422).json(this.errors)
    }


    async check() {
        this.errors = {}
        // console.log("--------------------------------------------------- field")
        // console.log(this.body)
        // console.log("--------------------------------------------------- rules")
        // console.log(this.rules)
        // console.log("=================================================== Checking")
        for (let fieldKey in this.rules) {

            if (this.#isNested(fieldKey)) {
                await this.#nestedProcess(fieldKey)
            }
            else {
                if (this.#hasData(fieldKey)) {
                    await this.#checking(fieldKey, this.body[fieldKey])
                }
                else {
                    if (this.#hasRuleRequired(fieldKey))
                        this.#setError(fieldKey, "required")
                }
            }

        }
        await this.#checkError()
        // console.log("this.isError", this.isError)
        return this.isError
    }
    #hasRuleRequired(fieldKey) {
        let rules = this.rules[fieldKey].rules
        for (let ruleKey of rules) {
            if (ruleKey === "required") {
                return true
            }
        }
        return false
    }

    #isNested(fieldKey) {
        if (fieldKey.indexOf(".*") !== -1) return true
        return false
    }

    #hasData(fieldKey) {
        for (let _fieldKey in this.body) {
            if (_fieldKey.toString() == fieldKey.toString()) {
                return true
            }
        }
        return false
    }
    #getData(key) {
        for (let fieldKey in this.body) {
            if (key.toString() == fieldKey.toString()) {
                return this.body[key]
            }
        }
        return null
    }


    /**
     * 
     * @param {*} fieldKey  ex: name, email, username
     * @param {*} rule  ex: required, exist, match
     * @param {*} options params of rule that has params. ex: match:password, return password
     */
    #setError(fieldKey, rule, attribute, options) {
        let message = this.#setErrorMessage(fieldKey, rule, attribute, options)
        if (Object.keys(this.errors).length === 0) {
            this.errors["errors"] = {}
        }
        let keyError = attribute ?? fieldKey

        if (!this.errors["errors"][keyError]) {
            this.errors["errors"][keyError] = []
        }
        this.errors["errors"][keyError].push(message)
    }



    /**
     * 
     * @param {*} fieldKey ex: name, username, birthdate
     * @param {*} rule ex: required, email, max,min
     * @param {*} options params of rule that has params. ex: match:password
     * @returns 
     */
    #setErrorMessage(fieldKey, rule, attribute, options) {
        // ---------- set custom message
        if (this.rules[fieldKey].messages && this.rules[fieldKey].messages[rule]) {
            return this.rules[fieldKey].messages[rule]
        }
        // ---------- set default message
        attribute = this.rules[fieldKey].attribute ?? (attribute ?? fieldKey)
        let messageType = this.#errorTypeCategories(rule)
        return this.#defaultErrorMessage(
            attribute,
            rule,
            messageType,
            rule,
            options
        )
    }

    /**
     * 
     * @param {*} rule ex: ex: required, email, max,min
     * @returns MessageType  is category message. ex:  { matchWith: "must be match with"}
     */
    #errorTypeCategories(rule) {
        if (rule === ValidationType.email || rule === ValidationType.date || rule === ValidationType.float ||
            rule === ValidationType.integer || rule === ValidationType.array || rule === ValidationType.mimetypes ||
            rule === ValidationType.mimes || rule === ValidationType.bolean || rule === ValidationType.ip || rule == ValidationType.url ||
            rule === ValidationType.json
        )
            return MessageType.invalidFormat



        if (rule === ValidationType.in_array || rule === ValidationType.not_in_array)
            return MessageType.invalidSelected
        if (rule === ValidationType.required)
            return MessageType.is
        if (rule === ValidationType.match)
            return MessageType.matchWith
        if (rule === ValidationType.max || rule === ValidationType.max_file || rule === ValidationType.max_digits)
            return MessageType.max
        if (rule === ValidationType.min || rule === ValidationType.min_digits)
            return MessageType.min
        if (rule === ValidationType.exists)
            return MessageType.exists
        if (rule === ValidationType.unique)
            return MessageType.unique
        if (rule === ValidationType.date_before)
            return MessageType.before
        if (rule === ValidationType.date_after)
            return MessageType.after
        if (rule === ValidationType.date_before_or_equal)
            return MessageType.beforeOrEqual
        if (rule === ValidationType.date_after_or_equal)
            return MessageType.afterOrEqual
        if (rule === ValidationType.digits)
            return MessageType.digits
        if (rule === ValidationType.digits_between)
            return MessageType.digitsBetween

        return MessageType.must
    }

    /**
     * 
     * @param {*} attribute ex: E-Mail
     * @param {*} ruleType ex: mimetypes, required, exist
     * @param {*} messageType      MessageType  is category message. ex:  { matchWith: "must be match with"}
     * @param {*} rule ex: ex: required, email, max,min
     * @param {*} options params of the validation. ex: max:3, then options is "3"
     * @returns 
     */
    #defaultErrorMessage(attribute, ruleType, messageType, rule, options) {
        attribute = attribute[0].toUpperCase() + attribute.slice(1);

        if (ruleType === ValidationType.matchWith || ruleType === ValidationType.max || ruleType === ValidationType.min ||
            ruleType === ValidationType.mimetypes || ruleType === ValidationType.mimes
        ) {
            rule = options
        }

        if (ruleType === ValidationType.max_file) {
            rule = options.join(" ") // ["100","KB"] => "100 KB" 
        }

        if (ruleType === ValidationType.max_digits || ruleType === ValidationType.min_digits) {
            return ("The " + attribute + " " + messageType + " " + options + " digits").split("_").join(" ")
        }



        if (ruleType === ValidationType.date_after || ruleType === ValidationType.date_before ||
            ruleType === ValidationType.date_after_or_equal || ruleType === ValidationType.date_before_or_equal) {
            rule = options + "'s date"
        }

        if (ruleType === ValidationType.exists || ruleType === ValidationType.unique ||
            ruleType === ValidationType.in_array || ruleType === ValidationType.not_in_array)
            return ("The " + attribute + " " + messageType).split("_").join(" ")

        if (ruleType === ValidationType.ip)
            return ("The " + attribute + " " + messageType + " IP address").split("_").join(" ")

        if (ruleType === ValidationType.digits)
            return ("The " + attribute + " " + messageType[0] + " " + options + " " + messageType[1]).split("_").join(" ")

        if (ruleType === ValidationType.digits_between)
            return ("The " + attribute + " " + messageType[0] + " " + options[0] + " " + messageType[1] + " " + options[1] + " digits").split("_").join(" ")

        return ("The " + attribute + " " + messageType + " " + rule).split("_").join(" ")

    }


    /**
     * checking proccess by create params from rule, get rule name, and check validation of value
     * @param {*} fieldKey  ex: name, birthdate, id, 
     * @param {*} value  value of field
     * @param {*} attribute  attribute 
     * @returns void
     */
    async  #checking(fieldKey, value, attribute) {

        let rules = this.rules[fieldKey].rules // ["required","match:password","min:1","max:2"]
        // console.log(">>>>--------------------------------------->>>>")
        // console.log(rules)
        if (!Array.isArray(rules)) {
            console.log("\x1b[31m", "validations not an array", fieldKey, "\x1b[0m");
            return null;
        }

        for (let rule of rules) {
            // val, ex: float, required, date etc...
            // console.log("--------------")
            // console.log(rule, value)
            let options
            let ruleName
            let hasParams = this.#isValidationHasParam(rule)
            let ruleParams
            // ex: max:3, min:5    
            if (hasParams) {
                // console.log("CREATE PARAMS")
                options = this.#createOptionsParams(fieldKey, rule)
                ruleName = this.#getValidateNameFromValidationWithParams(rule)
            }
            else {
                ruleName = rule
            }
            let isValid = await this.ValidationCheck(ruleName, value, { options: options })

            if (!isValid) {
                // console.log("ERROR")
                // console.log(ruleName)
                if (hasParams) {
                    ruleParams = this.#getValidateParams(rule)
                    // console.log("validationParams", ruleParams)
                }
                this.#setError(fieldKey, ruleName, attribute, ruleParams)
            }

        }
        // console.log("<<<<---------------------------------------<<<<")
    }


    /**
    * check if a rule has params
    * @param {*} rule ex: match:oldPassword
    * @returns 
    */
    #isValidationHasParam(rule) {
        if (rule.indexOf(":") !== -1) return true
        return false
    }


    /**
     * get rule name if rule has params
     * @param {*} rule ex: match:oldPassword
     * @returns match
     */
    #getValidateNameFromValidationWithParams(rule) {
        let arr = rule.split(":")
        return arr[0]
    }

    /**
     * get rule params
     * @param {*} rule ex: digit_between:1,2
     * @returns [1,2]
     */
    #getValidateParams(rule) {
        let arr = rule.split(":")
        arr = arr.splice(1, 1);
        // console.log("arr", arr)
        // console.log("rule", rule)
        if (arr[0].indexOf(",") !== -1) {
            return arr[0].split(",")
        }
        return arr
    }

    /**
     * create options from rule params
     * @param {*} rule ex: match:password, max:2, min:3
     * @param {*} fieldKey 
     */
    #createOptionsParams(fieldKey, rule) {

        let arr = rule.split(":")
        let options = {}
        try {
            if (arr.length > 1) {
                if (arr[0] === ValidationType.match) {
                    let fieldMatch = this.#getData(arr[1])
                    if (!fieldMatch)
                        throw "Not right format of validation: " + rule
                    options["fieldMatch"] = fieldMatch
                }
                if (arr[0] === ValidationType.max || arr[0] === ValidationType.min) {
                    let param = arr[1]
                    if (!param) throw "Not right format of validation: " + rule

                    if (arr[0] === ValidationType.max)
                        options["fieldMax"] = param
                    if (arr[0] === ValidationType.min)
                        options["fieldMin"] = param
                }
                if (arr[0] === ValidationType.exists) {
                    let params = arr[1].split(",")
                    if (params.length < 2) throw "Not right format of validation: " + rule


                    options["fieldTableName"] = params[0]
                    options["fieldColumnName"] = params[1]

                    if (params[2])
                        options["fieldException"] = params[2]
                }
                if (arr[0] === ValidationType.unique) {
                    let params = arr[1].split(",")
                    if (params.length < 2) throw "Not right format of validation: " + rule


                    options["fieldTableName"] = params[0]
                    options["fieldColumnName"] = params[1]

                    if (params[2])
                        options["fieldException"] = params[2]

                }

                if (arr[0] === ValidationType.mimetypes || arr[0] === ValidationType.mimes) {
                    let params = arr[1].split(",")
                    options["fieldMimetypes"] = params
                }

                if (arr[0] === ValidationType.max_file) {
                    let params = arr[1].split(",")
                    if (params.length < 1) throw "Not right format of validation: " + rule


                    if (!validator.isInt(params[0]) || !this.#isValidFileUnit(params[1]))
                        throw "Not right format of validation: " + rule + ". Valid max_file:1000,MB -> [GB,MB,KB,Byte]"

                    options["fieldMaxSize"] = params[0]
                    options["fieldUnit"] = params[1]
                }

                if (arr[0] === ValidationType.date_after || arr[0] === ValidationType.date_before ||
                    arr[0] === ValidationType.date_after_or_equal || arr[0] === ValidationType.date_before_or_equal) {
                    let params = arr[1]
                    let targetDate = this.#getData(params)
                    if (!targetDate && params == "now")
                        targetDate = new Date()
                    options["fieldDate"] = targetDate
                }

                if (arr[0] === ValidationType.in_array || arr[0] === ValidationType.not_in_array) {
                    let params = arr[1].split(",")
                    if (!params)
                        throw "Not right format of validation: " + rule
                    options["fieldArray"] = params
                }

                if (arr[0] === ValidationType.digits || arr[0] === ValidationType.max_digits || arr[0] === ValidationType.min_digits) {
                    let params = arr[1]
                    if (!validator.isInt(params))
                        throw "Not right format of validation: " + rule
                    options["fieldDigits"] = params
                }

                if (arr[0] === ValidationType.digits_between) {
                    let params = arr[1].split(",")
                    if (!params || params.length < 2 || !validator.isInt(params[0]) || !validator.isInt(params[1]))
                        throw "Not right format of validation: " + rule

                    options["fieldDigitsFirst"] = params[0]
                    options["fieldDigitsLast"] = params[1]
                }

            }
            else {
                throw "Not right format of validation: " + rule
            }
        } catch (error) {
            console.log("\x1b[31m", error, "\x1b[0m");
        }

        return options

    }


    /**
     * Validation check value and rule
     * @param {*} ruleName ex: required, float
     * @param {*} value value 
     * @param {*} options  ex: {fieldMax: 3 }
     * @returns bolean
     */
    async ValidationCheck(ruleName, value, { options }) {

        // console.log("ruleName...", ruleName)
        // console.log("field...", field)
        // console.log("options...", options)

        //------------------------------------------------------ database
        if (ruleName == ValidationType.exists) {
            let d = await ValidationDB.exists(options.fieldTableName, options.fieldColumnName, value,
                options.fieldException
            )
            return d
        }
        if (ruleName == ValidationType.unique) {
            return await ValidationDB.unique(options.fieldTableName, options.fieldColumnName, value,
                options.fieldException
            )
        }

        //------------------------------------------------------ has params

        if (ruleName === ValidationType.digits) {
            if (!value)
                return true

            return (value.toString().length === parseInt(options.fieldDigits))
        }
        if (ruleName === ValidationType.digits_between) {
            if (!value)
                return true

            return (value.toString().length >= parseInt(options.fieldDigitsFirst) && value.toString().length <= parseInt(options.fieldDigitsLast))
        }
        if (ruleName === ValidationType.max_digits || ruleName === ValidationType.min_digits) {
            if (!value)
                return false
            if (ruleName === ValidationType.max_digits)
                return (value.toString().length <= parseInt(options.fieldDigits))

            return (value.toString().length >= parseInt(options.fieldDigits))
        }

        if (ruleName === ValidationType.max_file) {

            if (!value)
                return true

            let size = this.#convertByteToAnyUnit(value.size, options.fieldUnit)

            // console.log("size:", size)
            // console.log("options.fieldMaxSize:", options.fieldMaxSize)
            return parseFloat(size) <= parseFloat(options.fieldMaxSize)
        }

        if (ruleName === ValidationType.match)
            return validator.matches(value ?? " .", options?.fieldMatch ?? " ")

        if (ruleName === ValidationType.max) {
            if (Array.isArray(value)) {
                return value.length <= options.fieldMax
            }
            return validator.isFloat(value.toString() ?? "0", { max: options.fieldMax ?? " " })
        }

        if (ruleName === ValidationType.min) {
            if (Array.isArray(value)) {
                return value.length >= options.fieldMin
            }
            return validator.isFloat(value.toString() ?? "0", { min: options.fieldMin ?? " " })
        }

        if (ruleName === ValidationType.mimetypes) {
            if (!Array.isArray(options.fieldMimetypes) || !value.type) {
                return false
            }
            return validator.isIn(value.type, options.fieldMimetypes)
        }

        if (ruleName === ValidationType.mimes) {
            if (!Array.isArray(options.fieldMimetypes) || !value.extension) return false

            return validator.isIn(value.extension.split('.').join(""), options.fieldMimetypes)
        }
        if (ruleName === ValidationType.date_after || ruleName === ValidationType.date_before) {
            if (!options.fieldDate || !value) return false
            let _date = this.#formatDate(value)
            let _dateCompare = this.#formatDate(options.fieldDate)
            if (ruleName == ValidationType.date_before)
                return validator.isBefore(_date, _dateCompare)
            return validator.isAfter(_date, _dateCompare)
        }
        if (ruleName === ValidationType.date_after_or_equal || ruleName === ValidationType.date_before_or_equal) {
            if (!options.fieldDate || !value) return false

            let _date = this.#formatDate(value)
            let _dateCompare = this.#formatDate(options.fieldDate)

            if (ruleName == ValidationType.date_before_or_equal) {
                let isBefore = validator.isBefore(_date, _dateCompare)
                if (isBefore || !isBefore && validator.equals(_date, _dateCompare))
                    return true
                return false
            }
            let isAfter = validator.isAfter(_date, _dateCompare)
            if (isAfter || !isAfter && validator.equals(_date, _dateCompare))
                return true
            return false
        }

        if (ruleName === ValidationType.in_array) {
            return validator.isIn(value, options.fieldArray)
        }
        if (ruleName === ValidationType.not_in_array) {
            return !validator.isIn(value, options.fieldArray)
        }


        //------------------------------------------------------ has no params

        if (ruleName === ValidationType.image) {
            if (!value || !value.extension)
                return false
            return validator.isIn(value.extension.split('.').join(""), Object.values(this.imageFormats))
        }

        if (ruleName === ValidationType.required) {
            if (value === undefined || value === null || value === "")
                return false
        }

        if (ruleName === ValidationType.email)
            return validator.isEmail(value.toString())

        if (ruleName === ValidationType.bolean)
            return validator.isBoolean(value.toString())

        if (ruleName === ValidationType.float)
            return validator.isFloat((value ?? '').toString())

        if (ruleName === ValidationType.integer)
            return validator.isInt((value ?? "").toString())

        if (ruleName === ValidationType.date) {
            let newDate = this.#formatDate(value)
            return validator.isDate(newDate.toString())
        }

        if (ruleName === ValidationType.string)
            return (typeof value === "string")

        if (ruleName === ValidationType.array)
            return (Array.isArray(value))

        if (ruleName === ValidationType.ip)
            return validator.isIP(value)

        if (ruleName === ValidationType.url)
            return validator.isURL(value)

        if (ruleName === ValidationType.json)
            return validator.isJSON(value)


        return true
    }

    /**
     * change date format so can be using for validation check
     * @param {*} date 
     * @returns 
     */
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

    /**
     * file size units
     */
    fileUnits = {
        GB: "GB", MB: "MB", KB: "KB", Byte: "Byte"
    }

    /**
     * image formats
     */
    imageFormats = {
        jpg: "jpg",
        jpeg: "jpeg",
        png: "png",
        bmp: "bmp",
        gif: "gif",
        svg: "svg",
        webp: "webp",
    }



    /**
     * check if unit input is valid
     * @param {*} unitFile 
     * @returns 
     */
    #isValidFileUnit(unitFile) {

        for (let unit in this.fileUnits) {
            if (unitFile == unit)
                return true
        }
        return false
    }

    /**
     * convert size in byte to any unit
     * @param {*} sizeInByte 
     * @param {*} unit 
     * @returns 
     */
    #convertByteToAnyUnit(sizeInByte, unit) {

        if (unit === this.fileUnits.KB) {
            return (sizeInByte / 1024).toFixed(2)
        }

        if (unit === this.fileUnits.MB)
            return (sizeInByte / 1048576).toFixed(2)

        if (unit === this.fileUnits.GB)
            return (sizeInByte / 1073741824).toFixed(2)

        return sizeInByte
    }


    // -------------------------------------------------------------------------------------------------------- nested process

    /**
     * If rule is nested, then proccess to get value begins here
     * @param {*} fieldKey 
     */
    async #nestedProcess(fieldKey) {
        // console.log("start nested validation")
        let fieldArray = fieldKey.split(".")
        await this.#recursizeNested(fieldKey, fieldArray, this.body, "", 0)
    }

    /**
     * recursive function to check into deep nested value. 
     * the purpose is found the value from field body
     * @param {*} fieldKey item.*.name
     * @param {*} fieldArray [item, * , name]
     * @param {*} attribute  default is ""
     * @param {*} currentField this.body[item] |  this.body[item][0] | this.body[item][0][name]
     * @param {*} indexNested default is 0
     * @returns 
     */
    async #recursizeNested(fieldKey, fieldArray, currentField, attribute, indexNested) {

        // console.log("-----------------------------------" + indexNested)
        // console.log("fieldArray", fieldArray)
        // console.log("currentField", currentField)
        // console.log("----------------------------------.")
        // if (!currentField) {
        //     console.log("field not found", currentField)
        //     return
        // }

        if (!indexNested <= fieldArray.length) {
            // validation in here
            if (indexNested === fieldArray.length) {
                // console.log("validation: ",)
                // console.log("data-> ", currentField)
                // console.log("attribute-> ",)

                // fieldKey -> item.*.name -> used for get validation rule
                // currentField -> value of name from this.body object
                // attribute slice 1 means-> .item.0.name -> item.0.name
                await this.#checking(fieldKey, currentField, attribute.slice(1))
            }
            else {
                if (fieldArray[indexNested] === "*") {
                    if (!Array.isArray(currentField)) {
                        // console.log("current field not an array")
                        return
                    }
                    for (let i = 0; i < currentField.length; i++) {

                        await this.#recursizeNested(fieldKey, fieldArray, currentField[i], attribute + "." + i, indexNested + 1)
                    }
                }
                else {
                    return await this.#recursizeNested(fieldKey, fieldArray, currentField[fieldArray[indexNested]], attribute + "." + fieldArray[indexNested], indexNested + 1)
                }
            }
            return
        }
    }



}

export default RequestValidation
