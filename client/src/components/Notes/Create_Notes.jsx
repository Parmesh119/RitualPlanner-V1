import { useState } from "react";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import {NavLink} from "react-router-dom";

const NoteSection = () => {
  const [person, setPerson] = useState("")
  const [work, setWork] = useState("")
  const [noteText, setNoteText] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [reminderDate, setReminderDate] = useState("")
  
  // const [notes, setNotes] = useState([]);
  // const[notes_length, setNotesLength] = useState(0)
  
  // const notificationsRef = useRef(new Set()); // Ref to keep track of notified notes

  // useEffect(() => {
  //   const checkDates = () => {
  //     const today = new Date();
  //     notes.forEach((note) => {
  //       const noteDate = new Date(note.date);
  //       const diffTime = Math.abs(noteDate - today);
  //       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
  //       if (diffDays <= 3 && !notificationsRef.current.has(note.date)) {
  //         toast(`Reminder: You have a note for ${noteDate.toDateString()}`, {
  //           icon: "🔔",
  //         });
  //         notificationsRef.current.add(note.date); // Mark this date as notified
  //       }
  //     });
  //   };

  //   checkDates();
  //   const interval = setInterval(checkDates, 86400000); // Check every 24 hours

  //   return () => clearInterval(interval);
  // }, [notes]);

  const addNote = async () => {

    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/api/note/notes/create',
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ person, work, noteText, noteDate, reminderDate })
      }
    )
    const res = await response.json()

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-10">
      <Helmet>
        <title>Add Note</title>
      </Helmet>
      <div className="max-w-lg w-full p-5 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Add a Note</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">Name of the person</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              id="name"
              name="name"
              placeholder="Name of the person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}

            />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-left">Work name</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              value={work}
              id="work"
              name="work"
              placeholder="Work name"
              onChange={(e) => setWork(e.target.value)}

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
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
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
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
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
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter your note here..."
          ></textarea>
        </div>
        <button
          onClick={addNote}
          className="w-full font-bold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-1"
        >
          Add Note
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
  );
};

export default NoteSection;
