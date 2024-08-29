const express = require('express')
const router = express.Router()
const Note = require('../models/note')

router.delete("/notes/modify/delete/:id", async (req, res) => {
    try {
        const deleteNote = await Note.deleteOne({_id: req.body._id })
        if(!deleteNote) return res.status(400).send({error: "Error while deleting note!"})
        res.status(200).send({success: "Successfully deleted note!"})
    } catch(error) {
        res.status(400).send({error: "not get"})
    }
})
module.exports = router