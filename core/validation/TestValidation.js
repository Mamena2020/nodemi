import RequestValidation from "./RequestValidation.js";


class TestRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }


    rules() {
        return {

            "item.*.name": {
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