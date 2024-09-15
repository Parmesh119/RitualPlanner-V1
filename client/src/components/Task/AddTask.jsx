import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const TaskAddForm = ({ loggedInUser }) => {
  // State for form fields
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [assignee, setAssignee] = useState(loggedInUser); // Initially assign the logged-in user
  const [isOwnTask, setIsOwnTask] = useState(true); // Toggle for own task or someone else

  const Email = localStorage.getItem('userEmail')
    let assign_user = ""

  useEffect(() => {
    const handleAssigneeOwn = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/users/getLoggedInUser', {
          method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Email })
        })

        const response_data = await response.json();

        if(!response_data) {
          toast.error(response_data.error)
        } else {
          assign_user = response_data
        }
      } catch(error) {
        console.log(error.message)
      }
    }

    handleAssigneeOwn()
  }, [])

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      taskName,
      description,
      date,
      amount,
      location,
      assignee,
    };

    // Handle the form data here (save to DB, state, etc.)
    console.log("New Task Created: ", newTask);

    // Reset form after submission
    setTaskName('');
    setDescription('');
    setDate('');
    setAmount('');
    setLocation('');
    setAssignee(loggedInUser); // Reset to logged-in user for future tasks
    setIsOwnTask(true); // Reset toggle
  };

  // Handle the toggle change
  const handleToggleChange = () => {
    setIsOwnTask(!isOwnTask);
    if (!isOwnTask) {
      setAssignee(loggedInUser); // If it's user's own task, set the assignee to logged-in user
    } else {
      setAssignee(''); // Reset the assignee for someone else
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg py-20 shadow-md">
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
            placeholder="Enter amount earned"
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

        {/* Toggle for Task Ownership */}
        <div className="flex items-center justify-between">
          <label className="block text-gray-700">
            Is this your task?
          </label>
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
              value={assign_user}
              className="w-full p-2 border border-gray-300 rounded-md"
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
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Add Completed Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskAddForm;
