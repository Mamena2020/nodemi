import RequestValidation from "./RequestValidation.js";

class UserRequest extends RequestValidation {
    constructor(req) {
        super(req).loadRules(this.rules())
    }

    rules() {
        return {
            "npm": {
                "validation": ["required", "integer", "digits_between:2,5"],
            },
            "ipk": {
                "validation": ["required", "float", "min:1", "max:4"],
            },
            "password": {
                "validation": ["required"],
            },
            "confirmPassword": {
                "validation": ["required", "same:password"],
            },
        };
    }
}

var d = new UserRequest({
    body: {
        "npm": 1,
        "ipk": 3.14,
        "password": "12313",
        "confirmPassword": "1231232",
    }
})

console.log("================================= ERROR MESSAGE")
console.log(d.errors)