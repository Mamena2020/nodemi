class Resource {

    constructor() {
    }
    load(child) {
        this.child = child
    }
    collection(list = []) {
        let newList = []
        for (let data of list) {
            let newData = this.make(data)
            newList.push(newData)
        }
        return newList
    }

    make(data) {
        return this.child.toArray(data)
    }

}

export default Resource