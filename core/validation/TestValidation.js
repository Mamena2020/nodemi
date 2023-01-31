import RequestValidation from "./RequestValidation.js";


class TestRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }


    rules() {
        return {

            "name": {
                "rules": ["required"]
            },
            "gpa": {
                "rules": ["required", "float", "min:3", "max:4"]
            },
            "birthdate": {
                "rules": ["required", "date","date_before:now"]
            },
            "item.*.name": {
                "rules": ["required"]
            },
            "item.*.description": {
                "rules": ["required"]
            },
            "price.*": {
                "rules": ["required","float"]
            },

        }
    }


}

const testValidation = async (req, res) => {

    const valid = new TestRequest(req)
    await valid.check()
    if (valid.isError)
        return valid.responseError(res)

    return res.json("success")

}

export default testValidation