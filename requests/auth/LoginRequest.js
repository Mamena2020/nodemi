import RequestValidation from "../../core/validation/RequestValidation.js";

class LoginRequest extends RequestValidation {

    constructor(req) {
        super(req).loadRules(this.rules())
    }

    rules() {
        return {
            "email": {
                "validation": ["required", "email"],
                "attribute": "E-mail"
            },
            "password": {
                "validation": ["required"],
                "attribute": "Password"
            },
        };
    }
}

export default LoginRequest