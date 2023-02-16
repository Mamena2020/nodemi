import RequestValidation from "../RequestValidation.js";

class UserRequest extends RequestValidation {
    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
            "email": {
                "rules": ["email", "unique:users,email"]
            },
            "npm": {
                "rules": ["required", "integer", "length:4", "digits_between:2,5"],
            },
            "ipk": {
                "rules": ["required", "float", "min:1", "max:4"],
            },
            "password": {
                "rules": ["required"],
            },
            "birthdate": {
                "rules": ["required", "date"],
            },
            "confirmPassword": {
                "rules": ["required", "match:password"],
                "attribute": "Confirm password",
            },
            "hobby": {
                "rules": ["required", "array", "max:1"]
            }
        };
    }
}

let birthdate = Date()
var d = new UserRequest({
    body: {
        "email": "andre@gmail.com",
        "npm": 1,
        "ipk": 5,
        "password": "12313ss",
        "birthdate": birthdate.toString(),
        // "birthdate": "2014-05-11",
        "confirmPassword": "12313s",
        "hobby": ["coding", "cooking"]
    }
})
await d.check()

console.log("================================= ERROR MESSAGE")
console.log(d.errors)