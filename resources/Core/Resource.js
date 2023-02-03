class Resource {

    constructor() {
    }
    load(child) {
        this.child = child
    }
    async collection(list = []) {
        let newList = []
        for (let data of list) {
            let newData = await this.make(data)
            newList.push(newData)
        }
        return newList
    }

    async make(data) {
        return this.child.toArray(data)
    }
 
}

export default Resource