import fs from 'fs'
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

const FileParsing = async (req, res, next) => {

    if (req.method === 'POST') {
        var bb = busboy({ headers: req.headers });
        bb.on('file', function (name, file, info) {
            
            if (isArray(name)) {
                if (!req.body[name]) {
                    req.body[name] = []
                }
            }
            let tempDir = path.join(os.tmpdir(), info.filename);

            let fileSize = 0;
            file.pipe(fs.createWriteStream(tempDir));

            file.on("data", (data) => {
                fileSize += data.length
            })
            file.on('end', function () {
                // additional info
                info.fileSize = fileSize
                info.fileSizeUnit = "bytes"
                info.fileExtension = path.extname(info.filename)
                
                if (isArray(name) && Array.isArray(req.body[name])) {

                    req.body[name].push({
                        name: name,
                        info: info,
                        tempDir: tempDir
                    })
                }
                else {
                    req.body[name] = {
                        name: name,
                        info: info,
                        tempDir: tempDir
                    }
                }
            });
        });
        bb.on("close", () => {
            next()
        });
        req.pipe(bb);
    }
    else {
        next()
    }

}

export default FileParsing