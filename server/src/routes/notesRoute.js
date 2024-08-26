const express = require('express');
const Notes = require('../models/note');
const validate = require('../middleware/validate-note');
const noteSchema = require('../validation/notes');
const router = express.Router();

router.post("/notes/create", validate(noteSchema), async (req, res) => {
  const { person, work, noteText, noteDate, reminderDate } = req.body;

  try {
    const existingNote = await Notes.findOne({
      person,
      work,
      noteText,
      noteDate,
      reminderDate
    });

    if (existingNote) {
      return res.status(400).send({ error: "Data already exists!" });
    }

    const newNote = new Notes({ person, work, noteText, noteDate, reminderDate });
    await newNote.save();
    res.status(200).send({ success: "Note added successfully", data: newNote });
  } catch (err) {
    res.status(500).send({ error: "Server error!" });
  }
});

module.exports = router;
