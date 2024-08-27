import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../Loader/Loading';
import axios from 'axios';
import { format } from 'date-fns';
import Helmet from 'react-helmet';

const NotesSection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getAllNotes = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/note/notes/all');
      setNotes(response.data);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.log(error.message);
      setLoading(false); // Ensure loading is turned off even if there's an error
    }
  };
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-4">
      <Helmet>
        <title>All Notes</title>
      </Helmet>
      <h2 className="text-2xl font-semibold mb-4">All Notes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        { loading ? (
          <div className="col-span-full flex items-center justify-center h-48">
            <Loading />
          </div>
        ) : (
          notes.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-48">
              <span className="text-lg font-semibold text-gray-600">No notes available right now but you can add it if you want by <NavLink className="text-blue-800 font-bold underline" to="/notes/create">clicking on this link</NavLink></span>
            </div>
          ) : (
            notes.map(note => (
              <div
                key={note.id}
                className={`text-black p-4 rounded-lg shadow-md flex flex-col justify-between`}
              >
                <div className='text-black text-justify'>
                  <h3 className="text-xl"><strong>Person Name: </strong>{note.person}</h3>
                  <p><strong>Work Name:</strong> {note.work}</p>
                  <p><strong>Note:</strong> {note.noteText}</p>
                  <p><strong>Work Date:</strong> {format(new Date(note.noteDate), "MMMM dd, yyyy")}</p>
                  <p><strong>Reminder Date:</strong> {format(new Date(note.reminderDate), "MMMM dd, yyyy")}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <NavLink to={`/notes/modify/update/:id`}>
                    <button className="text-black hover:text-gray-700">
                      <PencilIcon className="h-6 w-6" />
                    </button>
                  </NavLink>
                  <NavLink to={`/notes/modify/delete/:id`}>
                    <button className="text-black hover:text-gray-800">
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </NavLink>
                </div>
              </div>
          ))
        )
        )}
      </div>
    </div>
  );
};

export default NotesSection;
