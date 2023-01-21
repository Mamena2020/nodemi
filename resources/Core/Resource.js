class Resource {

    constructor(data) {
        this.data = data
    }

    getData(format = []) {

        if(format.length==0) return this.data

        if (Array.isArray(data)) {

        }
        else
            if (typeof this.data === "object" && this.data !== null) {


            }
            else {
                return []
            }

    }
}