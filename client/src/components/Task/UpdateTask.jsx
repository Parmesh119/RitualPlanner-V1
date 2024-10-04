import Helmet from 'react-helmet';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Update() {
  const path = window.location.pathname;
  const _id = path.split('/').pop();

  const navigate = useNavigate();

  const [notes, setNotes] = useState({
    person: '',
    work: '',
    noteDate: '',
    reminderDate: '',
    noteText: '',
  });

  useEffect(() => {
    getAllNotes();
  }, []);

  const getAllNotes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/note/notes/${_id}`
      );
      setNotes(response.data); // Set the notes data
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [name]: value,
    }));
  };

  const updateNote = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/note/notes/modify/update/${_id}`,
        {
          method: 'PUT',
          headers: {
            "content-type": "application/json"
          }, 
          body: JSON.stringify(notes)
        }
      )

      const updateData = await response.json()

      if(updateData.error) {
        toast.error(updateData.error)
      } else {
        toast.success(updateData.success)
        notes.person = ''
        notes.work = ''
        notes.noteDate = ''
        notes.reminderDate = ''
        notes.noteText = ''
        navigate('/notes/all')
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white py-10">
        <Helmet>
          <title>Update Task</title>
        </Helmet>
        <div className="max-w-lg w-full p-5 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-center">Update Task</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-left">
              Name of the person
            </label>
            <input
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              id="name"
              name="person"
              placeholder="Name of the person"
              value={notes.person}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-left">
              Work name
            </label>
            <input
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              value={notes.work}
              id="work"
              name="work"
              placeholder="Work name"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-left">
              Work Date
            </label>
            <input
              type="date"
              id="date"
              name="noteDate"
              placeholder="Date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={notes.noteDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-left">
              Reminder Date
            </label>
            <input
              type="date"
              id="re_date"
              name="reminderDate"
              placeholder="Reminder Date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={notes.reminderDate}
              onChange={handleChange}
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
              name="noteText"
              value={notes.noteText}
              placeholder="Enter your note here..."
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            onClick={updateNote}
            className="w-full font-bold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-1"
          >
            Update Note
          </button>
          <NavLink to="/notes/all">
            <button className="w-full font-bold bg-black text-white py-2 rounded-lg hover:bg-gray-600 mt-1">
              All Note
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
}
