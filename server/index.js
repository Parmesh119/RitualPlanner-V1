const express = require('express')
const cors = require('cors')

const connectToDB = require("./config/mongoDB/connect")
const users = require("./src/routes/userRoute")
const notes = require("./src/routes/Note/notesRoute")
const deleteNotes = require('./src/routes/Note/deleteNoteRoute')
const updatePasswordRoute = require("./src/routes/updatePasswordRoute")
const updateNoteRoute = require('./src/routes/Note/updateNoteRoute')
const AddCompletedTaskRoute = require('./src/routes/Task/AddCompletedTaskRoute')
const AllTask = require('./src/routes/Task/AllTask')
const AddNewTask = require('./src/routes/Task/AddNewTask')
const DeleteTask = require('./src/routes/Task/DeleteTask')
const UpdateTask = require('./src/routes/Task/UpdateTask')

const app = express()
const PORT = process.env.PORT || 3002

app.use(express.json())
app.use(
    cors({
      origin: [
        "https://ritual-planner.vercel.app",
        "http://localhost:5173",
      ],
    })
  );
app.get("/", (req, res) => {
    res.send("RitualPlanner")
})

app.use("/api/users", users, AddCompletedTaskRoute, AllTask, AddNewTask)
app.use("/api/task", DeleteTask, UpdateTask)
app.use("/api/note", notes, deleteNotes, updateNoteRoute)
app.use("/api", updatePasswordRoute)

app.listen(PORT, connectToDB);