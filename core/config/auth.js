import User from "./../../models/User.js"


const config = {
    getUserOnRequest: process.env.AUTH_GET_CURRENT_USER_ON_REQUEST ?? false
}

class AuthConfig {

    /**
     * Default user model for auth
     * @returns 
     */
    static user = User


    static getUserOnRequest = config.getUserOnRequest

}

export default AuthConfig
