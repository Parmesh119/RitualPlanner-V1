import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const TasksDashboard = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/users/tasks', {
        method: "GET",
        headers: {
          'content-type': 'application/json',
        }
      });
      alert(response.taskName)
      setTasks(response);
    } catch (error) {
      alert(error.message)
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    // Fetch tasks from the backend

    fetchTasks();
  }, []);



  return (
    <div className="p-4 sm:p-16 py-10">
      <Helmet>
        <title>
          Task Management | RitualPlanner
        </title>
      </Helmet>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Tasks Dashboard</h1>

      <div className="grid sm:p-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Total Tasks</h2>
          <p className="text-2xl sm:text-4xl font-bold">{tasks.length}</p>
        </div>
{/* 
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Completed Tasks</h2>
          <p className="text-2xl sm:text-4xl font-bold">{completedTasks}</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Incomplete Tasks</h2>
          <p className="text-2xl sm:text-4xl font-bold">{incompleteTasks}</p>
        </div> */}
      </div>

      <div className="mt-8">
        {/* Adjust for mobile view */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search Tasks"
            autoFocus
            className="flex-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            className="w-full sm:w-auto flex items-center justify-center text-white bg-blue-600 font-bold py-2 px-4 sm:px-14 rounded-md hover:bg-blue-500 hover:text-white"
            style={{
              letterSpacing: "1px",
            }}
          >
            <NavLink to="/tasks/add" className="flex">
              <h1>+&nbsp;&nbsp;</h1> Add Task
            </NavLink>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Task List</h2>
        <ul className="space-y-2">
        {tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center px-4 py-2 rounded-md shadow-md ${
                  task.completed
                    ? 'bg-green-100 hover:bg-green-200'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.taskName}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TasksDashboard;
