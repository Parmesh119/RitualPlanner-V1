import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Update() {

  const path = window.location.pathname
    const _id = path.split("/").pop()

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getAllNotes()
  }, [])
  
  const getAllNotes = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + `/api/note/notes/${_id}`, {
        method: "GET",
      });
      setNotes(response.data); // Set loading to false after fetching data
    } catch (error) {
      console.log(error.message); // Ensure loading is turned off even if there's an error
    }
  };

  const updateNote = () => {
    // try {

    // } catch(error) {
    //     console.log(error.message)
    // }
  }

  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-white py-10">
      <Helmet>
        <title>Update Note</title>
      </Helmet>
      <div className="max-w-lg w-full p-5 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Update Note</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">Name of the person</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              id="name"
              name="name"
              placeholder="Name of the person"
              value={notes.person}

            />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">Work name</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              value={notes.work}
              id="work"
              name="work"
              placeholder="Work name"

            />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">
            Work Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            placeholder="Date"
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={notes.noteDate}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">
            Reminder Date
          </label>
          <input
            type="date"
            id="re_date"
            name="re_date"
            placeholder="Reminder Date"
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={notes.reminderDate}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">
            Reminder message
          </label>
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
            id="notes"
            name="notes"
            value={notes.noteText}
            placeholder="Enter your note here..."
          ></textarea>
        </div>
        <button
          onClick={updateNote}
          className="w-full font-bold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-1"
        >
          Update Note
        </button>
        <NavLink to="/notes/all"><button className="w-full font-bold bg-black text-white py-2 rounded-lg hover:bg-gray-600 mt-1">All Note</button></NavLink>
        {/* <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Notes</h3>
          <ul>
            {notes_length == 0 ? <p>No notes</p> : notes.map((note, index) => (
              <li key={index} className="mb-2 p-3 border rounded-lg bg-gray-50">
                <p className="font-medium">{note.text}</p>
                <p className="text-gray-500 text-sm">
                  To be reminded on: {new Date(note.date).toDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </div>
    </>
  )
}
