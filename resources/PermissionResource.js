import Resource from "../core/resource/Resource.js"


class PermissionResource extends Resource {
    constructor() {
        super().load(this)
    }

    toArray(data) {
        return {
            "id": data.id,
            "name": data.name
        }
    }
}


export default PermissionResource

