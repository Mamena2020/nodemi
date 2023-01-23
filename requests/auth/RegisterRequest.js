import RequestValidation from "../../core/validation/RequestValidation.js";

class RegisterRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
            "name": {
                "validation": ["required",],
            },
            "email": {
                "validation": ["required", "email","unique:users,email"],
                "attribute": "E-mail"
            },
            "password": {
                "validation": ["required"],
                "attribute": "Password"
            },
            "confirmPassword": {
                "validation": ["required","match:password"],
            },
        };
    }
}

export default RegisterRequest