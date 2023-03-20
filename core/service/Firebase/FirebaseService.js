
import admin from "firebase-admin"
import { v4 as uuid4 } from 'uuid'
import fse from "fs-extra"
import firebaseConfig from "../../config/Firebase.js";

class FirebaseService {


    /**
     * Init firebase service to firebase admin
     * @returns 
     */
    static async init() {

        if (admin.apps.length)
            return

        await new Promise(async (resolve, reject) => {
            return await fse.readFile(firebaseConfig.firebaseServiceAccountFile, 'utf-8', async (error, data) => {
                if (error) {
                    console.log("error")
                    console.error(error)
                    reject()
                }
                const jsonData = JSON.parse(data);

                admin.initializeApp({
                    credential: admin.credential.cert(jsonData),
                    storageBucket: firebaseConfig.firebaseBucket
                });
                resolve()
            })
        })
    }


    /**
   * Save single media to firebase storage
   * @param {*} file 
   * @returns {url, path}
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
                    path: firebaseConfig.firebaseBucket + "/" + fileName
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




    static async sendMessage({
        title = '', body = '', data = {}, registrationTokens = []
    }) {

        if (!Array.isArray(registrationTokens) || registrationTokens.length === 0)
            return

        await this.init()

        const message = {}
        const notification = {}
        notification["title"] = title
        notification["body"] = body
        message["notification"] = notification

        if (Object.keys(data).length > 0) {
            message["data"] = data
        }
        message["token"] = registrationTokens.length === 1 ? registrationTokens[0] : registrationTokens

        if (registrationTokens.length === 1) {
            await admin.messaging().send(message)
                .then((response) => {
                    console.log("Successfully sent message:", response);
                })
                .catch((error) => {
                    console.log("Error sending message:", error);
                })
        }
        else {
            await admin.messaging().sendMulticast(message)
                .then((response) => {
                    console.log(`${response.successCount} messages were sent successfully`);
                })
                .catch((error) => {
                    console.log(`Error sending message: ${error}`);
                });
        }


    }

}


export default FirebaseService