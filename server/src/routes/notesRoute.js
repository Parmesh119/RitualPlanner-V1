const express = require('express')
const Notes = require('../models/note')
const validate = require('../middleware/validate-note')
const noteSchema = require('../validation/notes')
const router = express.Router()

router.post("/notes", validate(noteSchema), async (req, res) => {
    const { person, work, noteText, noteDate, reminderDate } = req.body
    try {  
        let notes = await Notes.findOne({ $or: [
            { person: person },
            { work: work },
            { noteText: noteText },
            {noteDate: noteDate},
            {reminderDate: reminderDate}
        ] })

        if(notes) {
            if(notes.person === person && notes.work === work && notes.noteText === noteText && notes.noteDate === noteDate && notes.reminderDate === reminderDate) {
                return res.status(400).send({error: "Data already exists!"})
            }
        }

        notes = new Notes({person, work, noteText, noteDate, reminderDate})
        await notes.save()
        res.status(201).send({ message: "Note added successfully" })
    } catch(error) {
        console.log(error.meeage)
        res.status(500).send({error: "Server error!"})
    }
})

module.exports = router