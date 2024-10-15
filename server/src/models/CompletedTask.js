const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
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
        required: true
    },
    location: {
        type: String,
        required: true
    },
    // start: {
    //     type: Date, required: true
    // },
    // end: {
    //     type: Date, 
    //     required: true
    // },
    finalAssignUser: {
        type: String,
        required: true
    }
}, {
    Timestamp: true
})

const Task = mongoose.model("old-tasks", taskSchema)
module.exports = Task