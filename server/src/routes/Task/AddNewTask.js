const express = require('express')
const Router = express.Router()
const NewTask = require('../../models/NewTask')

Router.post('/tasks/add/new', async (req, res) => {
    const {taskName, description, date, amount, location, finalAssignUser} = req.body

    try {
        const existingTask = await NewTask.findOne({
            taskName,
            description,
            date,
            amount,
            location,
            finalAssignUser
          });
      
          if (existingTask) {
            return res.status(400).send({ error: "Data already exists!" });
          }
      
          const newTask = new NewTask({ taskName, description, date, amount, location, finalAssignUser });
          await newTask.save();
          res.status(200).send({ success: "New Task added successfully", data: newTask });
    } catch(error) {
        console.log(error.message)
        return res.status(500).send({ error: "Server error...!" });
    }
})

module.exports = Router