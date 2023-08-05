import User from "../../models/User.js"

const getUserOnRequest = process.env.AUTH_GET_CURRENT_USER_ON_REQUEST ?? false
const authEmailVerification = process.env.AUTH_EMAIL_VERIFICATION ?? false

class AuthConfig {

    /**
     * Default user model for auth
     * @returns 
     */
    static user = User


    static getUserOnRequest = getUserOnRequest

    static emailVerification = authEmailVerification

}

export default AuthConfig
