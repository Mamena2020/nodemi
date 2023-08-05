import RequestValidation from "../../core/validation/RequestValidation.js"


class ResetPasswordRequest extends RequestValidation {
    constructor(req) {
        super(req).load(this)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return object
     */
    rules() {
        return {
            "new_password": {
                "rules": ["required"],
            },
        }
    }
}


export default ResetPasswordRequest