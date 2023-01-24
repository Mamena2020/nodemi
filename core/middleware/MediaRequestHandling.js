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
const clearTempFiles = async (res, files) => {
    res.on("finish", async () => {
        try {
            for (let file in files) {
                try {
                    if (fse.pathExistsSync(files[file].tempDir))
                        fse.removeSync(files[file].tempDir)
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

        bb.on('file', function (fieldname, file, info) {

            //ex: file[]
            if (isArray(fieldname)) {
                if (!req.body[fieldname]) {
                    req.body[fieldname] = []
                    tempFiles[fieldname] = []
                }
            }
            let tempDir = path.join(os.tmpdir(), info.filename);

            let fileSize = 0;
            file.pipe(fse.createWriteStream(tempDir));

            file.on("data", (data) => {
                fileSize += data.length
            })
            file.on('end', function () {
                // additional info
                info.fileSize = fileSize
                info.fileSizeUnit = "bytes"
                info.fileExtension = path.extname(info.filename)

                let newFile = {
                    name: fieldname,
                    info: info,
                    tempDir: tempDir
                }

                if (isArray(fieldname) && Array.isArray(req.body[fieldname])) {
                    req.body[fieldname].push(newFile)
                    tempFiles[fieldname].push(newFile)
                }
                else {
                    req.body[fieldname] = newFile
                    tempFiles[fieldname] = newFile
                }
            });
        });

        bb.on('field', (fieldname, val) => {
            req.body[fieldname] = val
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