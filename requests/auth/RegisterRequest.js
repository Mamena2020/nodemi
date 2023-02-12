import RequestValidation from "../../core/validation/RequestValidation.js";


class RegisterRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
            "name": {
                "rules": ["required",],
            },
            "email": {
                "rules": ["required", "email","unique:users,email"],
                "attribute": "E-mail"
            },
            "password": {
                "rules": ["required"],
                "attribute": "Password"
            },
            "confirmPassword": {
                "rules": ["required","match:password"],
            },
        };
    }
}

export default RegisterRequest