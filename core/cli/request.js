// const fse = require("fs-extra")
import fse from "fs-extra"


const scripts = () => {
    return `

class ClassName extends RequestValidation {
    constructor(req) {
        super(req).load(this)
    }

    rules() {
        return {
           
        }
    }
}


export default ClassName
    
    `
}

const makeRequest = (name) => {

    // console.log("Model name: ", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    const file = `requests/${name}.js`;

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            // add path tree
            let importRequestValidaion = `core/validation/RequestValidation.js"`
            let count = file.split("").filter(c => c === "/").length

            for (let i = 0; i < count; i++) {
                importRequestValidaion = `../` + importRequestValidaion
            }
            importRequestValidaion = `import RequestValidation from "` + importRequestValidaion + `\n`

            // get model name from path
            let names = name.split("/") // Catalog/ProductRequest  
            let modelName = names[names.length - 1] // ProductRequest

            // change model name from default script
            const content = scripts().replace(/ClassName/g, modelName)

            // adding import packages on top of line
            let lines = content.split("\n")
            lines[0] = importRequestValidaion + lines[0]
            let updatedContent = lines.join("\n")

            fse.writeFile(file, updatedContent, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `Request created: ${file}`, "\x1b[0m")
            });
        })

    }
    else {
        console.log("\x1b[31m", `Request already exists: ${file}`, "\x1b[0m")
    }
}





export default makeRequest
// module.exports = makeRequest