    const express = require('express')
    const Router = express.Router()
    const Task = require('../../models/Task')

    Router.get("/tasks", async (req, res) => {
        try {
        const task = await Task.find()

        const allTask = {
            taskName: task[0].taskName,
            description: task[0].description,
            date: task[0].date,
            amount: task[0].amount,
            location: task[0].location,
            assignUser: task[0].assignUser
        }
        console.log(allTask)
        res.json(allTask)
        } catch(error) {
        //   console.log(error.message)
        res.status(500).json({ error: "Error while fetching Tasks..!" });
        }
    })

    module.exports = Router