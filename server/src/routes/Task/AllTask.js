const express = require('express');
const Router = express.Router();
const Task = require('../../models/CompletedTask');
const NewTask = require('../../models/NewTask')

Router.get("/tasks", async (req, res) => {
    try {
        const completetasks = await Task.find();
        const newTasks = await NewTask.find();

        // Map over all tasks and create an array of task objects
        const CompletedTasks = completetasks.map(task => ({
            _id: task._id,
            taskName: task.taskName,
            description: task.description,
            date: task.date,
            amount: task.amount,
            location: task.location,
            assignUser: task.assignUser
        }));

        const NewTasks = newTasks.map(task => ({
            _id: task._id,
            taskName: task.taskName,
            description: task.description,
            date: task.date,
            amount: task.amount,
            location: task.location,
            assignUser: task.assignUser
        }))
        
        const allTasks = [...CompletedTasks, ...NewTasks]
        res.status(200).json({ success: true, tasks: allTasks }); // Return all tasks
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error while fetching tasks." });
    }
});

module.exports = Router;
