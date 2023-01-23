import RequestValidation from "./RequestValidation.js";

class UserRequest extends RequestValidation {
    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
            "email": {
                "validation": ["email", "unique:users,email"]
            },
            // "npm": {
            //     "validation": ["required", "integer", "length:4", "digits_between:2,5"],
            // },
            // "ipk": {
            //     "validation": ["required", "float", "min:1", "max:4"],
            // },
            // "password": {
            //     "validation": ["required"],
            // },
            // "birthdate": {
            //     "validation": ["required", "date"],
            // },
            // "confirmPassword": {
            //     "validation": ["required", "match:password"],
            //     "attribute": "Confirm password"
            // },
            // "hobby": {
            //     "validation": ["required", "array", "max:3"]
            // }
        };
    }
}

let birthdate = Date()
var d =  new UserRequest({
    body: {
        "email": "andre@gmail.com",
        "npm": 1,
        "ipk": 4,
        "password": "12313s",
        "birthdate": birthdate.toString(),
        // "birthdate": "2014-05-11",
        "confirmPassword": "12313s",
        "hobby": ["coding", "cooking"]
    }
})
await d.check()

console.log("================================= ERROR MESSAGE")
console.log(d.errors)