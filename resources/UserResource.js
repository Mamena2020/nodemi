import Resource from "./Core/Resource.js"

class UserResource extends Resource {

    constructor() {
        super().load(this)
    }

    toArray(data) {
        return {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "image": data.getFirstMedia()?.url || '',
            "role": data.getRole()?.name || '',
            "permissions" : data.getPermissionsName() || []
        }
    }

}

export default UserResource