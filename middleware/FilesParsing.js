
import fs from 'fs'
import path from "path";
import os from 'os'
import busboy from "busboy";
import { randomFillSync } from "crypto";

const random = (() => {
    const buf = Buffer.alloc(16);
    return () => randomFillSync(buf).toString('hex');
})();

const FileParsing = async (req, res, next) => {

    if (req.method === 'POST') {
        var bb = busboy({ headers: req.headers });
        bb.on('file', function (name, file, info) {
            console.log("name", name)
            console.log("info", info)
            // var saveTo = 'temp/' + filename;
            // const saveTo = path.join("temp", `busboy-upload-${random()}`);
            const tempDir = path.join(os.tmpdir(), info.filename);
            file.pipe(fs.createWriteStream(tempDir));
            file.on('end', function () {
                req.body[name] = {
                    name,
                    info,
                    tempDir
                }
                // move the file from the temporary location to a permanent location
                // fs.rename(saveTo, 'permanent-location/' + filename, (err) => {
                //     if (err) {
                //         console.log(err);
                //         return res.status(500).send(err);
                //     }
                // res.send("File uploaded and moved successfully.");
                // });
                next()
            });
        });
        req.pipe(bb);
    }

}

export default FileParsing