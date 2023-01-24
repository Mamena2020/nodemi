import fse from 'fs-extra'
import path from "path";
import os from 'os'
import busboy from "busboy";

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
        bb.on('file', function (name, file, info) {

            //ex: file[]
            if (isArray(name)) {
                if (!req.body[name]) {
                    req.body[name] = []
                    tempFiles[name] = []
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
                    name: name,
                    info: info,
                    tempDir: tempDir
                }

                if (isArray(name) && Array.isArray(req.body[name])) {
                    req.body[name].push(newFile)
                    tempFiles[name].push(newFile)
                }
                else {
                    req.body[name] = newFile
                    tempFiles[name] = newFile
                }
            });
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