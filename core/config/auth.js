import User from "../../models/User.js"



class AuthConfig {

    /**
     * Default user model for auth
     * @returns 
     */
    static user = User

}

export default AuthConfig
