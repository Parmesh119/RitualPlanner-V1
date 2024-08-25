const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    person: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    noteText: {
        type: String,
        required: true,
        default: ""
    },
    noteDate: {
        type: Date,
        required: true
    },
    reminderDate: {
        type: Date,
        required: true
    }
}, {
    Timestamp: true
})

const Notes = mongoose.model("notes", noteSchema)
module.exports = Notes