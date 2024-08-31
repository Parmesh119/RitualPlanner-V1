const express = require('express')
const cors = require('cors')

const connectToDB = require("./config/mongoDB/connect")
const users = require("./src/routes/userRoute")
const notes = require("./src/routes/notesRoute")
const deleteNotes = require('./src/routes/deleteNoteRoute')
const updatePasswordRoute = require("./src/routes/updatePasswordRoute")
const updateNoteRoute = require('./src/routes/updateNoteRoute')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("RitualPlanner")
})

app.use("/api/users", users)
app.use("/api/note", notes, deleteNotes)
app.use("/api/note", updateNoteRoute)
app.use("/api", updatePasswordRoute)

app.listen(PORT, connectToDB);