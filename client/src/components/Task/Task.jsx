import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader/Loading';

const TasksDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('All'); // For filtering tasks
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/users/tasks', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTasks(response.data.tasks);
      setFilteredTasks(response.data.tasks); // Initially show all tasks
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Filter tasks whenever tasks or filter changes
    handleFilterChange(filter);
  }, [tasks, filter]);

  const handleFilterChange = (filterOption) => {
    setFilter(filterOption);
    let newFilteredTasks;

    if (filterOption === 'Upcoming') {
      newFilteredTasks = tasks.filter(task => new Date(task.date) > new Date());
    } else if (filterOption === 'Finished') {
      newFilteredTasks = tasks.filter(task => new Date(task.date) <= new Date());
    } else {
      newFilteredTasks = tasks; // 'All'
    }

    setFilteredTasks(newFilteredTasks);
  };

  return (
    <div className="p-4 sm:p-16 py-10">
  <Helmet>
    <title>Task Management | RitualPlanner</title>
  </Helmet>
  <h1 className="text-xl sm:text-2xl font-bold mb-4">Tasks Dashboard</h1>

  {/* Task Statistics */}
  <div className="grid sm:p-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">Total Tasks</h2>
      <p className="text-2xl sm:text-4xl font-bold">{tasks.length}</p>
    </div>
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">Completed Tasks</h2>
      <p className="text-2xl sm:text-4xl font-bold">
        {tasks.filter(task => new Date(task.date) <= new Date()).length}
      </p>
    </div>
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">Upcoming Tasks</h2>
      <p className="text-2xl sm:text-4xl font-bold">
        {tasks.filter(task => new Date(task.date) > new Date()).length}
      </p>
    </div>
  </div>

  {/* Search and Add Task Button */}
  <div className="mt-8">
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <input
        type="text"
        placeholder="Search Tasks by Person Name only"
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="w-full sm:w-auto flex items-center justify-center text-white bg-blue-600 font-bold py-2 px-4 sm:px-14 rounded-md hover:bg-blue-500 hover:text-white">
        <NavLink to="/tasks/add/complete" className="flex">
          <h1>+&nbsp;&nbsp;</h1> Add Completed Task
        </NavLink>
      </button>
      <button className="w-full sm:w-auto flex items-center justify-center text-white bg-blue-600 font-bold py-2 px-4 sm:px-14 rounded-md hover:bg-blue-500 hover:text-white">
        <NavLink to="/tasks/add/new" className="flex">
          <h1>+&nbsp;&nbsp;</h1> Add New Task
        </NavLink>
      </button>
    </div>
  </div>

  {/* Filter Options */}
  <div className="mt-4">
    <div className="flex space-x-4">
      <button
        className={`px-4 py-2 rounded ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => handleFilterChange('All')}
      >
        All
      </button>
      <button
        className={`px-4 py-2 rounded ${filter === 'Upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => handleFilterChange('Upcoming')}
      >
        Upcoming Tasks
      </button>
      <button
        className={`px-4 py-2 rounded ${filter === 'Finished' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => handleFilterChange('Finished')}
      >
        Completed Tasks
      </button>
    </div>
  </div>

  {/* Task List in Table View */}
  <div className="mt-8 overflow-x-auto"> {/* Added overflow-x-auto */}
    {loading ? (
      <div className="col-span-full flex items-center justify-center h-48">
        <Loader />
      </div>
    ) : filteredTasks.length === 0 ? (
      <p style={{ textAlign: "start", marginLeft: "32%", padding: "5rem 10px" }}>
        No Task available right now but you can add it if you want by{' '}
        <NavLink className="text-blue-800 font-bold underline" to="/tasks/add/new">
          clicking on this link
        </NavLink>
      </p>
    ) : (
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="w-full bg-gray-100 border-b">
            <th className="py-2 px-4">Sr. No.</th>
            <th className="py-2 px-4">Task Name</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">Assigned User</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks
            .filter(val => search === "" || val.taskName.toLowerCase().includes(search.toLowerCase()))
            .map((data, index) => (
              <tr key={index} className="text-center border-b">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{data.taskName}</td>
                <td className="py-2 px-4">{data.description}</td>
                <td className="py-2 px-4">{data.location}</td>
                <td className="py-2 px-4">{data.finalAssignUser}</td>
                <td className="py-2 px-4">{data.amount === "undefined" ? 0 : data.amount}</td>
                <td className="py-2 px-4">{new Date(data.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 flex justify-center space-x-2">
                  <NavLink to={`/tasks/modify/update/${data._id}`}><abbr title="Update Note">
                    <button className="text-black hover:text-gray-700">
                      <PencilIcon className="h-6 w-6" />
                    </button>
                  </abbr></NavLink>
                  <NavLink to={`/tasks/modify/delete/${data._id}`}><abbr title="Delete Note">
                    <button className="text-black hover:text-gray-800">
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </abbr></NavLink>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
</div>

  );
};

export default TasksDashboard;
