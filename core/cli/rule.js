import fse from "fs-extra"


const scripts = () => {
    return `

class ClassName  {

    constructor() {
    }

    /**
     * Determine if the validation rule passes.
     * @param {*} attribute 
     * @param {*} value 
     * @returns bolean
     */
    passes(attribute, value) {
        return false
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    message() {
        return 'The _attribute_ must be .....'
    }

}


export default ClassName
    
    `
}

const makeRule = (name) => {

    // console.log("Model name: ", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    const file = `rules/${name}.js`;

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            
            // get class name from path
            let names = name.split("/") // Catalog/ProductRequest  
            let className = names[names.length - 1] // ProductRequest

            // change class name from default script
            const content = scripts().replace(/ClassName/g, className)

            fse.writeFile(file, content, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `Rule created: ${file}`, "\x1b[0m")
            });
        })

    }
    else {
        console.log("\x1b[31m", `Rule already exists: ${file}`, "\x1b[0m")
    }
}

export default makeRule