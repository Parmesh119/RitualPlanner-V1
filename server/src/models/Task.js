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
    assignUser: {
        type: String,
        required: true
    }
}, {
    Timestamp: true
})

const Task = mongoose.model("tasks", taskSchema)
module.exports = Task