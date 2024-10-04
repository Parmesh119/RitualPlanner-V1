const express = require('express')
const router = express.Router()
const NewTask = require('../../models/NewTask')
const CompletedTask = require('../../models/CompletedTask')
const { boolean } = require('zod')

router.delete("/tasks/modify/delete/:id", async (req, res) => {
    try {
        let New;
        let suc;
        const complete = await CompletedTask.deleteOne({_id: req.body._id })
        if(complete.deletedCount == 0)  {
            New = await NewTask.deleteOne({_id: req.body._id})
            suc = New
        } else {
            suc = complete
        }
        if(!suc) return res.status(400).send({error: "Error while deleting note!"})
        res.status(200).send({success: "Successfully deleted note!"})
    } catch(error) {
        res.status(400).send({error: "not get"})
    }
})
module.exports = router