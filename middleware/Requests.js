import LoginRequest from "../requests/auth/LoginRequest.js"

class Requests {


    static async login(req, res, next) {

        const valid = new LoginRequest(req)
        await valid.check()
        if (valid.isError)
            return valid.responseError(res)

        next()
    }

}

export default Requests