import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader/Loading';
import toast from 'react-hot-toast';

const TasksDashboard = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate()

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('All'); // For filtering tasks
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalAmountEarn, setTotalAmountEarn] = useState(0);
  const [monthAmountEarn, setMonthAmountEarn] = useState(0);
  const [previousMonth, setPreviousMonth] = useState(0)
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/task/tasks', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTasks(response.data.tasks);
      setFilteredTasks(response.data.tasks); // Initially show all tasks
      calculateAmounts(response.data.tasks); // Calculate total and month amounts after fetching tasks
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate total amount and monthly amount

  const calculateAmounts = (tasks) => {
    let totalEarned = 0;
    let monthEarned = 0;
    let previousEarned = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 for January, 11 for December
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // 0-based

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      // Check if the task date is in the past or today
      if (taskDate <= currentDate) {
        totalEarned += task.amount; // Add to total earnings

        // Check if the task is from the current month
        if (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear) {
          monthEarned += task.amount; // Add to current month earnings
        }
        // Check if the task is from the previous month
        else if (taskDate.getMonth() === previousMonth && taskDate.getFullYear() === currentYear) {
          previousEarned += task.amount; // Add to previous month earnings
        }
      }
    });

    // Update state variables with the calculated amounts
    setTotalAmountEarn(totalEarned);
    setMonthAmountEarn(monthEarned);
    setPreviousMonth(previousEarned);
  };


  const tasksPerPageFirst = 5; // Tasks per page for the first page
  const tasksPerPageRest = 5; // Tasks per page for other pages

  // const filteredTasks = tasks.filter(val => search === "" || val.taskName.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredTasks.length / (currentPage === 1 ? tasksPerPageFirst : tasksPerPageRest));

  // Pagination logic
  const indexOfFirstTask = (currentPage - 1) * (currentPage === 1 ? tasksPerPageFirst : tasksPerPageRest);
  const indexOfLastTask = indexOfFirstTask + (currentPage === 1 ? tasksPerPageFirst : tasksPerPageRest);
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);



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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks([]);
    } else {
        const allTaskIds = tasks.map(task => task._id);
        setSelectedTasks(allTaskIds);
    }
    setSelectAll(!selectAll);
  };

  const handleAllDelete = async () => {

    if(confirm("Are you sure want to delete your all tasks?")) {
      try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/task/tasks/delete/all', {
          method: 'DELETE',
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify(selectedTasks)
        })

        const res = await response.json()

        if(res.error) {
          toast.error(res.error)
          navigate("/tasks")
          setSelectAll(false)
          setSelectedTasks([])
        } else {
          toast.success(res.success)
          fetchTasks()
          navigate("/tasks")
          setSelectAll(false)
          setSelectedTasks([]);
        }
      } catch(error) {
        toast.error(error.message)
        navigate("/tasks")
        setSelectAll(false)
        setSelectedTasks(new Set())
      }
    } else {
      navigate(-1)
    }
  }
    

  return (
    <div className="p-4 sm:p-16 py-10">
      <Helmet>
        <title>Task Management | RitualPlanner</title>
      </Helmet>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Tasks Dashboard</h1>

      {/* Task Statistics */}
      <div className="grid sm:p-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Total Amount Earned (Completed tasks)</h2>
          <p className="text-2xl sm:text-4xl font-bold">
            {totalAmountEarn}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Amount Earned This Month</h2>
          <p className="text-2xl sm:text-4xl font-bold">
            {monthAmountEarn}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Amount Earned Previous Month</h2>
          <p className="text-2xl sm:text-4xl font-bold">
            {previousMonth}
          </p>
        </div>
      </div>

      {/* Search and Add Task Button */}
      <div className="mt-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search Tasks by Person Name only"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <nav className='flex items-center space-x-4'>
          <label className='flex items-center gap-1'>
            <input
              checked={selectAll}
              onChange={handleSelectAll}
              type='checkbox'
              className='px-4 py-2 size-4 -mt-0.5'
            />
            <span className='text-xl tracking-wide'>Select All</span>
          </label>
          <button
            className={`text-xl ml-4 font-bold tracking-wide cursor-pointer px-4 py-2 rounded-full 
                    ${selectAll ? 'hover:bg-blue-600 bg-blue-500 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
            disabled={!selectAll}
            onClick={handleAllDelete}
          >
            Delete All
          </button>
        </nav>
        <NavLink to="/calendar-view">
          <abbr title="Calendar-View">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              fill="currentColor"
              className="bi bi-calendar-date"
              viewBox="0 0 16 16"
            >
              <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
          </abbr>
        </NavLink>
      </div>


      {/* Task List in Table View */}
      <div className="mt-8 overflow-x-auto">
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
              <tr>
                <th className="py-2 px-4">Sr. No.</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Assigned User</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.filter(val => search === "" || val.taskName.toLowerCase().includes(search.toLowerCase())).map((data, index) => (
                <tr key={data._id} className="text-center border-b"  style={{ backgroundColor: selectAll || selectedTasks.includes(data._id) ? 'lightblue' : 'transparent' }}>
                  <td className="py-2 px-4">{index + 1 + indexOfFirstTask}</td>
                  <td className="py-2 px-4">{data.taskName}</td>
                  <td className="py-2 px-4">{data.description}</td>
                  <td className="py-2 px-4">{data.location}</td>
                  <td className="py-2 px-4">{data.finalAssignUser}</td>
                  <td className="py-2 px-4">{data.amount}</td>
                  <td className="py-2 px-4">{new Date(data.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 flex justify-center space-x-2">
                    <NavLink to={`/tasks/modify/update/${data._id}`}>
                      <abbr title="Update Note">
                        <button className="text-black hover:text-gray-700">
                          <PencilIcon className="h-6 w-6" />
                        </button>
                      </abbr>
                    </NavLink>
                    <NavLink to={`/tasks/modify/delete/${data._id}`}>
                      <abbr title="Delete Note">
                        <button className="text-black hover:text-gray-800">
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      </abbr>
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className='font-bold tracking-wide'>Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TasksDashboard;
