const express = require('express')
const router = express.Router()

const Notes = require('../models/note')
const validate = require('../middleware/validate-note');
const noteSchema = require('../validation/notes');

router.put("/notes/modify/update/:id", validate(noteSchema) , async (req, res) => {
    const { id } = req.params; 
  const { person, work, noteDate, reminderDate, noteText } = req.body;
   try {
        
        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            { 
              person, 
              work, 
              noteDate, 
              reminderDate, 
              noteText 
            },
            { new: true, runValidators: true } 
          );

          if(updatedNote) res.status(200).send({success: "Data Updated Successfully!"})
    } catch(error) {
        res.status(400).send({error: "not get"})
    }
})

module.exports = router