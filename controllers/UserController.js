import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import fs from 'fs'
import path from "path";
// import os from 'os'
import busboy from "busboy";
import { randomFillSync } from "crypto";


const getUser = async (req, res) => {

    try {
        console.log("get user")
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401)
        const user = await User.findOne(
            {
                where: {
                    refresh_token: refreshToken
                },
                attributes: ['id', 'name', 'email'],
                include: [{
                    model: UserDetail,
                    as: 'user_details',
                    // required: true,
                    attributes: ['bio']
                }]
            }
        )

        if (!user) return res.sendStatus(404)

        res.json({ message: "get success", "user": user })

    } catch (error) {
        console.log(error)
    }
}

const storeFile = async (req, res) => {

    // const refreshToken = req.cookies.refreshToken;
    // if (!refreshToken) return res.sendStatus(401)
    const file = req.files
    console.log("============================ storeFile")
    console.log(req)
    console.log(file)
    console.log(req.file)
    console.log(req.body.file)

    if (!file) {
        console.log("file not found")
        return res.json({ message: "file not found" }).status(402)
    }

    const user = await User.findOne({
        where: {
            // refresh_token: refreshToken
            refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFuZHJlXG4iLCJlbWFpbCI6ImFuZHJlQGdtYWlsLmNvbSIsImlhdCI6MTY3NDIyOTk0NCwiZXhwIjoxNjc0MjM5OTQ0fQ.ljvatrxWC0yv-kpdg1onsqaeWN-GckF3WbBb5fJMphk"
        }
    })
    if (!user) res.sendStatus(403)
    console.log(user.id)
    await user.saveMedia(
        file,
        "this image"
    )

    res.sendStatus(200)
}
const random = (() => {
    const buf = Buffer.alloc(16);
    return () => randomFillSync(buf).toString('hex');
})();

class FileRequest {
    // { filename: '56kb.jpg', encoding: '7bit', mimeType: 'image/jpeg' }
    constructor(filename, encoding, mimeType, tempDir) {
        this._filename = filename;
        this._encoding = encoding;
        this._mimeType = mimeType;
        this._tempDir = tempDir;
    }

    set filename(value) {
        this._filename = value;
    }
    get filename() {
        return this._filename;
    }
    set encoding(value) {
        this._encoding = value;
    }
    get encoding() {
        return this._encoding;
    }
    set mimeType(value) {
        this._mimeType = value;
    }
    get mimeType() {
        return this._mimeType;
    }
    set tempDir(value) {
        this._tempDir = value;
    }
    get tempDir() {
        return this._tempDir;
    }

}



const FilesRequest = {}

const upload = async (req, res, next) => {
    var bb = busboy({ headers: req.headers });
    bb.on('file', function (fieldname, file, fileObject, encoding, mimetype) {
        console.log("fieldname", fieldname)
        console.log("fileObject", fileObject)
        // var saveTo = 'temp/' + filename;
        // const saveTo = path.join("temp", `busboy-upload-${random()}`);
        const tempDir = path.join("temp", fileObject.filename);
        file.pipe(fs.createWriteStream(tempDir));
        file.on('end', function () {
            // move the file from the temporary location to a permanent location
            // fs.rename(saveTo, 'permanent-location/' + filename, (err) => {
            //     if (err) {
            //         console.log(err);
            //         return res.status(500).send(err);
            //     }
            // res.send("File uploaded and moved successfully.");
            // });
            res.send("File uploaded and moved successfully.");
        });
    });
    req.pipe(bb);
}
const upload3 = async (req, res, next) => {
    console.log(req.body)
    res.status(200).json("upload successfuly")
}


export default {
    getUser,
    storeFile,
    upload,
    upload3
}