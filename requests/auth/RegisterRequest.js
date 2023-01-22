import RequestValidation from "../../core/validation/RequestValidation.js";

class LoginRequest extends RequestValidation {

    constructor(req) {
        super(req).loadRules(this.rules())
    }

    rules() {
        return {
            "name": {
                "validation": ["required",],
            },
            "email": {
                "validation": ["required", "email"],
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

export default LoginRequest