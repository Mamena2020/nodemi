
import ValidationCheck from "./ValidationCheck.js";


const TypeMessage = Object.freeze({
    must: "must be",
    matchWith: "must be match with",
    is: "is",
    between: "between",
    validFormat: "must be valid format"
})
const TypeValidationWithParams = Object.freeze({
    match: "match",
    min: "min",
    max: "max",
    digits_between: "digits_between"
})

class RequestValidation {

    errors = {}

    constructor(req) {
        this.body = req.body
    }

    isError() {
        return !(JSON.stringify(this.errors) === JSON.stringify({}))
    }

    loadRules(_rules) {
        this.rules = _rules;
        this.check()
    }

    check() {
        this.errors = {}
        console.log("--------------------------------------------------- field")
        console.log(this.body)
        console.log("--------------------------------------------------- rules")
        console.log(this.rules)
        console.log("=================================================== Checking")
        for (let ruleKey in this.rules) {
            if (this.#hasField(ruleKey)) {
                this.#checking(ruleKey)
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
        if (val === "email" || val === "date" || val === "float" || val === "integer")
            return TypeMessage.validFormat
        if (val === "required")
            return TypeMessage.is
        if (val === "match")
            return TypeMessage.matchWith

        return TypeMessage.must
    }

    #defaultErrorMessage(attribute, type, validation, options) {
        attribute = attribute[0].toUpperCase() + attribute.slice(1);

        if (type === TypeMessage.matchWith) {
            validation = options
        }

        return "The " + attribute + " " + type + " " + validation
    }


    /**
     * 
     * @param {*} ruleKey  ex: password, id, name, 
     * @returns 
     */
    #checking(ruleKey) {
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
            let val
            let hasParams = this.#isValidationHasParam(validation)
            let paramsOfValidation
            // ex: max:3, min:5    
            if (hasParams) {
                console.log("CREATE PARAMS")
                options = this.#createOptionsParams(ruleKey, validation)
                val = this.#getValidateNameFromValidationWithParams(validation)
            }
            else {
                val = validation
                console.log("not sCREATE PARAMS")
            }

            if (!ValidationCheck(val, field, { options: options })) {
                console.log("ERROR")
                console.log(validation)
                if (hasParams) {
                    paramsOfValidation = this.#getValidateParams(validation)
                    console.log(paramsOfValidation)
                }
                this.#setError(ruleKey, val, paramsOfValidation)
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

        if (arr[0] === TypeValidationWithParams.match && arr.length === 2) {
            let fieldMatch = this.#getField(arr[1])

            console.log("fieldMatch////////////////", fieldMatch)

            if (!fieldMatch)
                return

            options["fieldMatch"] = fieldMatch
        }
        return options
    }


}

export default RequestValidation
