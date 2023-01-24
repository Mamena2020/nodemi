import LoginRequest from "../requests/auth/LoginRequest.js"

class Request {


    static async login(req, res, next) {

        const valid = new LoginRequest(req)
        await valid.check()
        if (valid.isError())
            return res.json(valid.errors).status(402)

        next()
    }





}

export default Request