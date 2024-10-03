const express = require('express')
const Router = express.Router()
const User = require('../../models/user')
const Task = require('../../models/CompletedTask')

Router.post('/tasks/getLoggedInUser', async (req, res) => {
    const {Email} = req.body
    try {
        let user = await User.findOne({email: Email})
        if(!user) return res.status(400).send({error: "Error!"})

        return res.status(200).send({success: user.name})
    } catch(error) {
        return res.status(500).send({ error: "Server error...!" });
    }
})

Router.post('/tasks/add/completed', async (req, res) => {
    const {taskName, description, date, amount, location, assignUser} = req.body

    try {
        const existingTask = await Task.findOne({
            taskName,
            description,
            date,
            amount,
            location,
            assignUser
          });
      
          if (existingTask) {
            return res.status(400).send({ error: "Data already exists!" });
          }
      
          const newTask = new Task({ taskName, description, date, amount, location, assignUser });
          await newTask.save();
          res.status(200).send({ success: "Completed Task added successfully", data: newTask });
    } catch(error) {
        console.log(error.message)
        return res.status(500).send({ error: "Server error...!" });
    }
})

module.exports = Router