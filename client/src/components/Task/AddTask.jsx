import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Helmet from 'react-helmet'
import { NavLink, useNavigate } from 'react-router-dom';

const TaskAddForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // State for form fields
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  const [assignee, setAssignee] = useState(''); // Initially empty
  const [assignUser, setAssignUser] = useState(''); // Store logged-in user
  const [isOwnTask, setIsOwnTask] = useState(true); // Toggle for own task or someone else

  const Email = localStorage.getItem('userEmail');

  const today = new Date().toISOString().split('T')[0];

  const navigate = useNavigate()

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/task/tasks/getLoggedInUser', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ Email }),
        });

        const responseData = await response.json();

        if (!responseData.success) {
          toast.error(responseData.error);
        } else {
          setAssignUser(responseData.success); // Set the fetched user
           // Set assignee to logged-in user initially
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchLoggedInUser();
  }, [Email]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    let finalAssignUser = isOwnTask ? assignUser : assignee
    // const start = new Date(startTime).toISOString()
    // const end = new Date(endTime).toISOString();

    // if(start >= end) return toast.error("End time must be after start time")

    const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/task/tasks/add/completed', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ taskName, description, date, amount, location, finalAssignUser })
    })

    const res = await response.json()

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      navigate('/tasks')
      
    }
  };

  // Handle the toggle change
  const handleToggleChange = () => {
    setIsOwnTask((prevIsOwnTask) => !prevIsOwnTask);
    if (isOwnTask) {
      setAssignee(''); // Clear assignee if it's for someone else
    } else {
      setAssignee(assignUser); // Reset to logged-in user when toggled back
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg py-20 shadow-md">
      <Helmet>
        <title>
           Completed Task | Task Management
        </title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-6">Add Completed Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Task Name */}
        <div>
          <label className="block text-gray-700">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter task name"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder="Enter task description"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700">Date (Task Completed)</label>
          <input
            type="date"
            max={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Amount Earned */}
        <div>
          <label className="block text-gray-700">Amount Earned</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0/-"
            required
          />
        </div>

        {/* Location of Work */}
        <div>
          <label className="block text-gray-700">Location of Work</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter location of work"
            required
          />
        </div>

        {/* Start Time of work */}
        {/* <div className='flex flex-row justify-between'>
          <span className='text-end'>
        <label className="block text-gray-700">Start Time </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-50 py-2 px-1 border border-gray-300 rounded-md"
          required />
        
        </span>
        End Time of work
        <span className='mt-6 lg:mt-8 tracking-wide text-md text-center'>Time of you work</span>
        <span className='text-center'>
        <label className="block text-gray-700 " >End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-50 py-2 px-1 border border-gray-300 rounded-md"
          required />
          </span>
        </div> */}

        {/* Toggle for Task Ownership */}
        <div className="flex items-center justify-between">
          <label className="block text-gray-700">Is this your task?</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle-checkbox h-6 w-6 rounded-full border border-gray-300 focus:ring-0 focus:outline-none"
              checked={isOwnTask}
              onChange={handleToggleChange}
            />
            <span className="ml-2">Yes</span>
          </div>
        </div>

        {/* Assignee (conditionally rendered) */}
        {isOwnTask ? (
          <div>
            <label className="block text-gray-700">Assignee (Yourself)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              value={assignUser} // Display the fetched user value
              readOnly
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-700">Assignee (Someone Else)</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter assignee's name"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div className='flex gap-2 justify-around'>
        <NavLink to="/tasks"><button
            type="submit"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-black"
          >
            Go to All Task
          </button></NavLink>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskAddForm;
