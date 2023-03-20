import Resource from "../core/resource/Resource.js"
import PermissionResource from "./PermissionResource.js"

class UserResource extends Resource {

    constructor() {
        super().load(this)
    }

    toArray(data) {
        return {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "avatar": data.getMediaByName("avatar")?.url || '',
            "media_urls": data.getMediaUrl(),
            "media_except": data.getMediaUrlExcept(["avatar2","test"]),
            "role": data.getRole()?.name || '',
            "permissions": new PermissionResource().collection(data.getPermissions() || []),
        }
    }

}

export default UserResource