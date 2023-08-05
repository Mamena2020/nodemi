import User from "../../models/User.js"

const getUserOnRequest = () => {
    if (process.env.AUTH_GET_CURRENT_USER_ON_REQUEST === "true" || process.env.AUTH_GET_CURRENT_USER_ON_REQUEST === true) {
        return true;
    }
    return false;
}
const authEmailVerification = () => {
    if (process.env.AUTH_EMAIL_VERIFICATION === "true" || process.env.AUTH_EMAIL_VERIFICATION === true) {
        return true;
    }
    return false;
}

class AuthConfig {

    /**
     * Default user model for auth
     * @returns 
     */
    static user = User


    static getUserOnRequest = getUserOnRequest()


    static emailVerification = authEmailVerification()

}

export default AuthConfig
