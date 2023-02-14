import admin from "firebase-admin"
import mediaConfig from "../../config/Media.js";
import { v4 as uuid4 } from 'uuid'
import fse from "fs-extra"

class FirebaseStorage {


    static async init() {

        if (admin.apps.length)
            return

        // console.log("init firebase");
        await new Promise(async (resolve, reject) => {
            return await fse.readFile(mediaConfig.firebaseServiceAccountFile, 'utf-8', async (error, data) => {
                if (error) {
                    console.log("error")
                    console.error(error)
                    reject()
                }
                const jsonData = JSON.parse(data);
            
                admin.initializeApp({
                    credential: admin.credential.cert(jsonData),
                    storageBucket: mediaConfig.firebaseBucket
                });
                resolve()
            })
        })
    }


    /**
     * Save single media to firebase storage
     * @param {*} file 
     * @returns 
     */
    static async saveMedia(file) {

        return await new Promise(async (resolve, reject) => {


            await this.init()

            const bucket = admin.storage().bucket();

            const fileName = uuid4() + file.extension

            const fileFirebase = bucket.file(fileName);

            const stream = fileFirebase.createWriteStream({
                resumable: false,
                public: true
            });

            stream.on('error', (err) => {
                console.error(err);
                reject()
            });

            stream.on('finish', async () => {
                // console.log(`File ${file.tempDir} uploaded to Firebase Storage`);
                const url = await bucket.file(fileName).getSignedUrl({
                    action: "read",
                    expires: '03-09-2491'
                })
                resolve({
                    url: url[0],
                    path: mediaConfig.firebaseBucket + "/" + fileName
                })
            });

            await fse.createReadStream(file.tempDir).pipe(stream);
        })

    }


    /**
     * Delete single file from firebase storage
     * @param {*} path ex: gs://xxxxx.appspot.com/6e2b7970-f56d-4009-b0cb-f3464d8cc847.jpg
     * @returns 
     */
    static async deleteMedia(path) {

        return await new Promise(async (resolve, reject) => {

            await this.init()
            const fileName = path.split("/").pop();
            const bucket = admin.storage().bucket();
            const file = bucket.file(fileName);

            file.delete().then(() => {
                // console.log(`File deleted successfully.`);
                resolve(true)
            }).catch(error => {
                reject()
                console.error(`Error deleting file:`, error);
            });
        })
    }

    /**
     * Delete many media 
     * @param {*} paths must be an array of path firebase storage
     * @returns 
     */
    static async deleteMedias(paths) {
        return await new Promise(async (resolve, reject) => {
            // console.log("start delete firebase files", paths)

            if (!Array.isArray(paths))
                reject()

            for (let path of paths) {
                await this.deleteMedia(path)
            }
            resolve()
        })
    }
}

export default FirebaseStorage