const mongoose = require("mongoose")
 
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        min: 8,
        max:20
    }
}, {
    Timestamp: true
}) 

const User = mongoose.model("Users", UserSchema)
module.exports = User