class UserResource extends Resource {

    constructor(data) {
        super(data)
    }

    getData() {
        return super.getData({
            "name": "name",
            "uuid": "id",
        })
    }

}