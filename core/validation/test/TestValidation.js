import RequestValidation from "../RequestValidation.js";


class TestRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }


    rules() {
        return {
            "name": {
                "rules": ["required"]
            },
            "discount": {
                "rules": ["required", "float", "min:3", "max:4"],
                "messages": {
                    "required": "Need discount",
                    "float": "data must be numeric"
                },
                "attribute": "DISCOUNT"
            },
            "expired_date": {
                "rules": ["required", "date", "date_after:now"]
            },
            "product_image": {
                "rules": ["required", "image", "max_file:1,KB"]
            },
            "item.*.name": {
                "rules": ["required","digits_between:5,10"]
            },
            "item.*.description": {
                "rules": ["required"]
            },
            "price.*": {
                "rules": ["required", "float","digits:2"]
            },
            "comment.*": {
                "rules": ["required"]
            }
        }
    }


}

const testValidation = async (req, res) => {

    console.log("BODY REQ", req.body)

    const valid = new TestRequest(req)
    await valid.check()
    if (valid.isError) 
    {
        return valid.responseError(res)
    }

    return res.json("success")

}

export default testValidation