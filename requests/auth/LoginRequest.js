import RequestValidation from "../../core/validation/RequestValidation.js";


class LoginRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
            "email": {
                "rules": ["required", "email", "exists:users,email"],
                "attribute": "E-mail"
            },
            "password": {
                "rules": ["required"],
                "attribute": "Password"
            },
        };
    }
}

export default LoginRequest