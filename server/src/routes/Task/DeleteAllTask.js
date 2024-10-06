const express = require('express')
const router = express.Router()
const NewTask = require('../../models/NewTask')
const CompletedTask = require('../../models/CompletedTask')

router.delete('/tasks/delete/all', async (req, res) => {
    try {
        const selectedTasks = req.body;
        if (selectedTasks.length === 0) {
            return res.status(400).send({ error: "No tasks selected to delete." });
        }
        const result1 = await NewTask.deleteMany({ _id: { $in: selectedTasks } });
        const result2 = await CompletedTask.deleteMany({_id: {$in: selectedTasks}});

        if(result1 && result2) return res.status(200).send({success:"All Tasks Deleted Successfully!"})

        return res.status(400).send({error: "Error while deleting all tasks!"})
    } catch(error) {
        res.status(500).send({error: "Server Error!"})
    }
})

module.exports = router