const config = require('./config')
const firebase = require("firebase/app")
let db 

try {
    db = firebase.initializeApp(config.firebaseConfig)
    console.log("connected")
} catch(error) {
    console.log("error")
}

module.exports = db

