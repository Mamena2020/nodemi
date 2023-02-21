import dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
    firebaseBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseServiceAccountFile: process.env.FIREBASE_SERVICE_ACCOUNT,
    firebaseCloudMessagingServerKey: process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY,
}

export default firebaseConfig