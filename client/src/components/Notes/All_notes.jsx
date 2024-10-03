import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'; // Import PlusIcon
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../Loader/Loading';
import axios from 'axios';
import { format } from 'date-fns';
import Helmet from 'react-helmet';
import toast from 'react-hot-toast';

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <>
      <div className="container mx-auto mt-16 p-4">
        <Helmet>
          <title>All Notes</title>
        </Helmet>
        {/* Header with Add Note Button */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-left tracking-wider mb-4 lg:mb-0">
            All Notes
          </h2>
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 items-center w-full lg:w-auto">
            <input
              placeholder="Search Notes by Person Name"
              name="search"
              value={search}
              id="search"
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg py-2 px-4 w-full lg:w-80 focus:ring-blue-500 border-gray-300 border"
            />
            <NavLink to="/notes/create" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
              <PlusIcon className="h-6 w-6" />
              <span className="font-bold">Add Note</span>
            </NavLink>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-48">
              <Loading />
            </div>
          ) : notes.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-48">
              <span className="text-lg font-semibold text-gray-600">
                No notes available right now but you can add it if you want by{' '}
                <NavLink className="text-blue-800 font-bold underline" to="/notes/create">
                  clicking on this link
                </NavLink>
              </span>
            </div>
          ) : (
            notes
              .filter((val) =>
                search === "" ? val : val.person.toLowerCase().includes(search.toLowerCase())
              )
              .map((note) => (
                <div key={note.id} className="bg-white text-black p-4 rounded-lg shadow-md flex flex-col justify-between">
                  <div className="text-black text-justify">
                    <h3 className="text-xl">
                      <strong>Person Name: </strong>
                      {note.person}
                    </h3>
                    <p>
                      <strong>Work Name:</strong> {note.work}
                    </p>
                    <p>
                      <strong>Note:</strong> {note.noteText}
                    </p>
                    <p>
                      <strong>Work Date:</strong> {format(new Date(note.noteDate), 'MMMM dd, yyyy')}
                    </p>
                    <p>
                      <strong>Reminder Date:</strong> {format(new Date(note.reminderDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <NavLink to={`/notes/modify/update/${note._id}`}>
                      <abbr title="Update Note">
                        <button className="text-black hover:text-gray-700">
                          <PencilIcon className="h-6 w-6" />
                        </button>
                      </abbr>
                    </NavLink>
                    <NavLink to={`/notes/modify/delete/${note._id}`}>
                      <abbr title="Delete Note">
                        <button className="text-black hover:text-gray-800">
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      </abbr>
                    </NavLink>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotesSection;
