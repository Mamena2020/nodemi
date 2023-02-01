import RequestValidation from "../core/validation/RequestValidation.js"


class ProductRequest extends RequestValidation {
    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
           
        }
    }
}


export default ProductRequest
    
    