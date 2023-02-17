
/**
 * Resource for handling mapping data from collections of single object
 */
class Resource {

    constructor() {
    }
    load(child) {
        this.child = child
    }

    /**
     * create resources collection from an array of object
     * @param {*} list 
     * @returns 
     */
    collection(list = []) {
        let newList = []
        for (let data of list) {
            let newData = this.make(data)
            newList.push(newData)
        }
        return newList
    }

    /**
     * create resource from single object
     * @param {*} data 
     * @returns 
     */
    make(data) {
        return this.child.toArray(data)
    }

}

export default Resource