import RequestValidation from "../RequestValidation.js";


class TestRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }


    rules() {
        return {
            "name": {
                "rules": ["required", new MyRule]
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
                "rules": ["required", "image", "max_file:1,MB"]
            },
            "item.*.name": {
                "rules": ["required", new MyRule, "digits_between:5,10"]
            },
            "item.*.description": {
                "rules": ["required"]
            },
            "price.*": {
                "rules": ["required", "float", "digits:2", "max:15"]
            },
            "comment.*": {
                "rules": ["required"],
                "messages": {
                    "required": "The _attribute_ is needed bro "
                }
            },
            "seo.title": {
                "rules": ["required"]
            },
            "seo.description.long": {
                "rules": ["required", "max:30"]
            },
            "seo.description.short": {
                "rules": ["required", "max:20"]
            }
        }
    }


}

class MyRule {

    constructor() {
    }

    /**
     * Determine if the validation rule passes.
     * @param {*} attribute 
     * @param {*} value 
     * @returns bolean
     */
    passes(attribute, value) {
        // console.log("attribute",value)
        return value.includes("and")
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    message() {
        return 'The _attribute_ must be have and'
    }

}

const TestValidation = async (req, res) => {

    // console.log("BODY REQ:")
    // console.dir(req.body, { depth: null });

    const valid = new TestRequest(req)
    console.dir(req.body,{ depth: null })
    await valid.check()

    if (valid.isError) {
        valid.addError("men", "ini adalah")
        valid.addError("men", "ini adalah2")
        return valid.responseError(res)
    }

    return res.json("success")

}

export default TestValidation