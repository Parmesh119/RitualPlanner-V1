const mongoose = require('mongoose')

const NewtaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    finalAssignUser: {
        type: String,
        required: true
    }
}, {
    Timestamp: true
})

const NewTask = mongoose.model("New-Tasks", NewtaskSchema)
module.exports = NewTask