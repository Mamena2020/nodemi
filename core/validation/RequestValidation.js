
import ValidationCheck from "./ValidationCheck.js";


const TypeMessage = Object.freeze({
    must: "must be",
    is: "is",
    between: "between",
    validFormat: "must be valid format"
})

class RequestValidation {

    errors = {}

    isError() {
        return !(JSON.stringify(this.errors) === JSON.stringify({}))
    }

    constructor(req) {
        this.body = req.body
        // this.rules = rules
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
                if (this.#ruleHasRequired(ruleKey)) {
                    this.#setError(ruleKey, "required")
                }
            }
        }
        return this.isError()
    }
    #ruleHasRequired(ruleKey) {
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

    #setError(ruleKey, validation) {
        let message = this.#setErrorMessage(ruleKey, validation)
        if (!this.errors[ruleKey]) {
            this.errors[ruleKey] = []
        }
        this.errors[ruleKey].push(message)
    }

    #errorTypeCategories(val) {
        if (val === "email" || val === "date" || val === "float" || val === "integer")
            return TypeMessage.validFormat
        if (val === "required")
            return TypeMessage.is
        return TypeMessage.must
    }

    #setErrorMessage(ruleKey, validation) {
        if (this.rules[ruleKey].message && this.rules[ruleKey].message[validation]) {
            return this.rules[ruleKey].message[validation]
        }
        let attribute = this.rules[ruleKey].attribute ?? ruleKey
        let type = this.#errorTypeCategories(validation)
        return this.#defaultErrorMessage({
            attribute,
            validation,
            type
        })
    }

    #defaultErrorMessage({ attribute, type, validation }) {
        attribute = attribute[0].toUpperCase() + attribute.slice(1);
        return "The " + attribute + " " + type + " " + validation
    }


    #checking(key) {
        var field = this.body[key]
        let validations = this.rules[key].validation
        console.log(">>>>--------------------------------------->>>>")
        console.log(validations)
        if (!Array.isArray(validations)) {
            // console.log("validations not an array", key)
            return null;
        }

        for (let val of validations) {
            // val, ex: float, required, date etc...
            console.log("--------------")
            console.log(val, field)
            if (!ValidationCheck(val, field)) {
                console.log("ERROR")
                this.#setError(key, val)
            }
            else {
                console.log("not error")
            }
            
        }
        console.log("--------------")
        console.log("<<<<---------------------------------------<<<<")
    }
}

export default RequestValidation
