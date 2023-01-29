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

        }
    }


}

const testValidation = async (req, res) => {


    console.log(req.body)

    const valid = new TestRequest(req)
    await valid.check()
    if (valid.isError)
        return res.json(valid.errors).status(402)

    return res.json("success")

}

export default testValidation