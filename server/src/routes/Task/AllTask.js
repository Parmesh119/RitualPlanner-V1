const express = require('express');
const Router = express.Router();
const Task = require('../../models/Task');

Router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();

        // Map over all tasks and create an array of task objects
        const allTasks = tasks.map(task => ({
            taskName: task.taskName,
            description: task.description,
            date: task.date,
            amount: task.amount,
            location: task.location,
            assignUser: task.assignUser
        }));

        console.log(allTasks);
        res.status(200).json({ success: true, tasks: allTasks }); // Return all tasks
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error while fetching tasks." });
    }
});

module.exports = Router;
