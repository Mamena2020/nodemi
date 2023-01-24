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
    if (a !== -1 && b !== -1 && b - 1 == a) {
        return true
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



const mediaRequestHandling = async (req, res, next) => {

    if (req.method === 'POST'
        && req.headers['content-type'].startsWith('multipart/form-data') ||
        req.method === 'POST'
        && req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {

        var bb = busboy({ headers: req.headers });
        let tempFiles = {}

        bb.on('file', function (fieldName, file, info) {

            //ex: file[]
            if (isArray(fieldName)) {
                if (!req.body[fieldName]) {
                    req.body[fieldName] = []
                    tempFiles[fieldName] = []
                }
            }
            let tempDir = path.join(os.tmpdir(), info.filename);

            let fileSize = 0;
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
                    extension: path.extname(info.filename),
                    tempDir: tempDir
                }

                if (isArray(fieldName) && Array.isArray(req.body[fieldName])) {
                    req.body[fieldName].push(newFile)
                    tempFiles[fieldName].push(newFile)
                }
                else {
                    req.body[fieldName] = newFile
                    tempFiles[fieldName] = newFile
                }
            });
        });

        bb.on('field', (fieldName, val) => {
            req.body[fieldName] = val
        });

        bb.on("close", () => {
            clearTempFiles(res, tempFiles)
            next()
        });



        req.pipe(bb);
    }
    else {
        next()
    }
}

export default mediaRequestHandling