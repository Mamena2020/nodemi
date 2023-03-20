import fse from "fs-extra"


const scripts = () => {
    return `

class ClassName extends Resource {
    constructor() {
        super().load(this)
    }

    /**
     * Transform the resource into custom object.
     *
     * @return 
    */
    toArray(data) {
        return {
           
        }
    }
}


export default ClassName
    
    `
}

const makeResource = (name) => {

    // console.log("Model name: ", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    const file = `resources/${name}.js`;

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            // add path tree
            let importResource = `core/resource/Resource.js"`
            let count = file.split("").filter(c => c === "/").length

            for (let i = 0; i < count; i++) {
                importResource = `../` + importResource
            }
            importResource = `import Resource from "` + importResource + `\n`

            // get class name from path
            let names = name.split("/") // Catalog/ProductRequest  
            let className = names[names.length - 1] // ProductRequest

            // change class name from default script
            const content = scripts().replace(/ClassName/g, className)

            // adding import packages on top of line
            let lines = content.split("\n")
            lines[0] = importResource + lines[0]
            let updatedContent = lines.join("\n")

            fse.writeFile(file, updatedContent, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `Resource created: ${file}`, "\x1b[0m")
            });
        })

    }
    else {
        console.log("\x1b[31m", `Resource already exists: ${file}`, "\x1b[0m")
    }
}





export default makeResource