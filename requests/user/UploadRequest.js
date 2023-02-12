import RequestValidation from "../../core/validation/RequestValidation.js";

class UploadRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }


    rules() {
        return {
            "file": {
                "rules": [
                    "required",
                    "image",
                    "max_file:1000,KB",
                ]
            },
        };
    }
}

export default UploadRequest