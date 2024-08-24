const dotenv = require("dotenv")
dotenv.config()

const {
    HOST_URL, 
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
} = process.env

module.exports = {
    HOST_URL,
    firebaseConfig: {
        apiKey: apiKey,
        authDomain: authDomain,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
        measurementId: measurementId
    }
}