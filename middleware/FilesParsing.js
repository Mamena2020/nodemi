
import fs from 'fs'
import path from "path";
import os from 'os'
import busboy from "busboy";
import { randomFillSync } from "crypto";

const random = (() => {
    const buf = Buffer.alloc(16);
    return () => randomFillSync(buf).toString('hex');
})();

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
            // console.log("name", name)
            // console.log("info", info)
            // const saveTo = path.join("temp", `busboy-upload-${random()}`);
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
                info.fileSize = fileSize
                info.fileSizeUnit = "bytes"
                if (isArray(name) && Array.isArray(req.body[name])) {
                    req.body[name].push({
                        name,
                        info,
                        tempDir
                    })
                }
                else {
                    req.body[name] = {
                        name,
                        info,
                        tempDir
                    }
                }
                // move the file from the temporary location to a permanent location
                // fs.rename(saveTo, 'permanent-location/' + filename, (err) => {
                //     if (err) {
                //         console.log(err);
                //         return res.status(500).send(err);
                //     }
                // res.send("File uploaded and moved successfully.");
                // });
            });

        });
        bb.on("close", () => {
            next()
            // res.writeHead(200, { 'Connection': 'close' });
            // res.end(`That's all folks!`);
        });
        req.pipe(bb);
    }

}

export default FileParsing