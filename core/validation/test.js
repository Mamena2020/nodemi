import RequestValidation from "./RequestValidation.js";

class UserRequest extends RequestValidation {
    constructor(req) {
        super(req).loadRules(this.rules())
    }

    rules() {
        return {
            "npm": {
                "validation": ["required", "integer", "length:4", "digits_between:2,5"],
            },
            "ipk": {
                "validation": ["required", "float", "min:1", "max:4"],
            },
            "password": {
                "validation": ["required"],
            },
            "birthdate": {
                "validation": ["required", "date"],
            },
            "confirmPassword": {
                "validation": ["required", "match:password"],
                "attribute": "Confirm password"
            },
            "hobby": {
                "validation": ["required", "array", "max:3"]
            }
        };
    }
}

let birthdate = Date()
console.log(birthdate.toString())
console.log()
var d = new UserRequest({
    body: {
        "npm": 1,
        "ipk": 4,
        "password": "12313s",
        "birthdate": birthdate.toString(),
        // "birthdate": "2014-05-11",
        "confirmPassword": "12313s",
        "hobby": ["coding", "cooking"]
    }
})

console.log("================================= ERROR MESSAGE")
console.log(d.errors)