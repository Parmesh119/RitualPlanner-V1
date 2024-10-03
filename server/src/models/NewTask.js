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
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    assignUser: {
        type: String,
        required: true
    }
}, {
    Timestamp: true
})

const NewTask = mongoose.model("New-Tasks", NewtaskSchema)
module.exports = NewTask