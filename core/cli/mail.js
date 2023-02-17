import fse from "fs-extra"



const scriptsEmail = () => {
    return `

class ClassName extends Mail {
    constructor(from = '', to = [], subject = '') {
        super().load({
            from: from,
            to: to,
            subject: subject,
            text: "Just need to verify that this is your email address.",
            attachments: [
                {
                    filename: "theFile.txt",
                    path: "exampleFileName"
                },
            ],
            html: {
                path: "htmlName",
                data: {
                    title: "Welcome to the party!",
                    message: "Just need to verify that this is your email address."
                }
            },
        })
    }
}

export default ClassName
    
    `
}

const scriptsHtml = () => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <%= title %>
    </title>
</head>

<body>
    <h3>Hello!</h3>
    <p>
        <%= message %>
    </p>
    <p>
        Regards.
    </p>
    <p>
        Nodemi
    </p>
</body>

</html>
    
    `
}



const makeMail = (name) => {

    // console.log("Model name: ", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    /**
     
     input:
     mails/account/VerifyAccount/VerifyAccount.js
     mails/VerifyAccount/VerifyAccount.js
     
     **/

    const names = name.split("/") // Account/VerifyAccount  
    const className = names[names.length - 1] // VerifyAccount 

    const file = `mails/${name}/${className}.js`;
    const htmlName = `mails/${name}/template.ejs`;
    const exampleFileName = `mails/${name}/examplefile.txt`;

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            // add path tree
            let importMail = `core/mail/Mail.js"`
            let count = file.split("").filter(c => c === "/").length

            for (let i = 0; i < count; i++) {
                importMail = `../` + importMail
            }
            importMail = `import Mail from "` + importMail + `\n`

            // get model name from path


            // change classname and others name from default script
            const content = scriptsEmail().replace(/ClassName/g, className).replace(/htmlName/g, htmlName).replace(/exampleFileName/g, exampleFileName)

            // adding import packages on top of line
            let lines = content.split("\n")
            lines[0] = importMail + lines[0]
            let updatedContent = lines.join("\n")

            fse.writeFile(file, updatedContent, async (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `Mail created: ${file}`, "\x1b[0m")

                await createHtmlTemplate(htmlName)
                createExampleFile(exampleFileName)
            });
        })

    }
    else {
        console.log("\x1b[31m", `Mail already exists: ${file}`, "\x1b[0m")
    }
}


const createHtmlTemplate = (file) => {

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }

            const content = scriptsHtml()
            fse.writeFile(file, content, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `Mail html template created: ${file}`, "\x1b[0m")
            })
        })
    }
    else {
        console.log("\x1b[31m", `Mail html template already exists: ${file}`, "\x1b[0m")
    }
}

const createExampleFile = (file) => {

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            fse.writeFile(file, 'Hello world!', (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `Mail example file created: ${file}`, "\x1b[0m")
            })
        })
    }
    else {
        console.log("\x1b[31m", `Mail example file already exists: ${file}`, "\x1b[0m")
    }
}




export default makeMail