import fse from 'fs-extra'
import path from "path";
import os from 'os'
import busboy from "busboy";


// the body - parser middleware is configured to handle application / json 
// and application / x - www - form - urlencoded content types.
// To handle form - data using middleware like multer or busboy


const isArray = (name) => {
    const a = name.indexOf("[")
    const b = name.indexOf("]")
    if (a !== -1 && b !== -1) {
        if (b - 1 === a || b - 2 === a) {
            return true
        }
    }
    return false
}

/**
 * start remove all temp files after respon is send back to client
 * @param {*} res response of expres 
 * @param {*} files files
 */
const clearTempFiles = (res, files) => {
    res.on("finish", () => {
        try {
            for (let fieldName in files) {
                try {
                    if (fse.pathExistsSync(files[fieldName].tempDir))
                        fse.removeSync(files[fieldName].tempDir)
                } catch (error1) {
                    console.log(error1)
                }
            }
        } catch (error) {
            console.log(error)
        }
    })
}



const handleField = (req, fieldName, value) => {

    if (fieldName.endsWith('[]'))  // comment[]
    {
        const key = fieldName.slice(0, -2);
        req.body[key] = req.body[key] || [];
        req.body[key].push(value);
    } else if (/\[\d+\]\[\w+\]/.test(fieldName)) {
        const match = fieldName.match(/(\w+)\[(\d+)\]\[(\w+)\]/); // "name" or  [0] or [name]
        const key = match[1]; // name
        const index = match[2]; // [0]
        const subKey = match[3]; //[name]
        req.body[key] = req.body[key] || [];
        req.body[key][index] = req.body[key][index] || {};
        req.body[key][index][subKey] = value;
    } else if (fieldName.endsWith(']')) {
        const match = fieldName.match(/(\w+)\[(\d+)\]/);
        const key = match[1];
        const index = match[2];
        req.body[key] = req.body[key] || [];
        req.body[key][index] = value;
    } else {
        req.body[fieldName] = value;
    }
}


const mediaRequestHandling = async (req, res, next) => {

    if (req.method === 'POST'
        && req.headers['content-type'].startsWith('multipart/form-data') ||
        req.method === 'POST'
        && req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {

        var bb = busboy({ headers: req.headers })
        let tempFiles = {}

        bb.on('file', function (fieldName, file, info) {

            //ex: file[]
            if (isArray(fieldName)) {
                if (!req.body[fieldName]) {
                    req.body[fieldName] = []
                    tempFiles[fieldName] = []
                }
            }


            let tempDir = path.join(os.tmpdir(), info.filename ?? 'temp.temp');

            let fileSize = 0
            file.pipe(fse.createWriteStream(tempDir));

            file.on("data", (data) => {
                fileSize += data.length
            })
            file.on('end', function () {

                let newFile = {
                    name: info.filename,
                    encoding: info.encoding,
                    type: info.mimeType,
                    size: fileSize,
                    sizeUnit: 'bytes',
                    extension: path.extname(info.filename ?? 'temp.temp'),
                    tempDir: tempDir
                }

                if (isArray(fieldName) && Array.isArray(req.body[fieldName])) {
                    if (info.filename) {
                        req.body[fieldName].push(newFile)
                    }
                    tempFiles[fieldName].push(newFile)
                }
                else {
                    if (info.filename) {
                        req.body[fieldName] = newFile
                    }
                    tempFiles[fieldName] = newFile
                }
            })
        })

        // let formData = {};
        bb.on('field', (fieldName, value) => {
            handleField(req, fieldName, value)
        })

        bb.on("finish", () => {
            clearTempFiles(res, tempFiles)
            next()
        })
        req.pipe(bb);
    }
    else {
        next()
    }
}

export default mediaRequestHandling

