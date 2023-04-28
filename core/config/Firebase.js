import dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
    firebaseBucket: process.env.FIREBASE_STORAGE_BUCKET,
    ServiceAccountBase64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    firebaseCloudMessagingServerKey: process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY,
}

export default firebaseConfig