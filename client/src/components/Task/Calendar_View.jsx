import React, { useEffect, useState } from 'react';
import { format, endOfMonth, addMonths, subMonths, isToday, startOfMonth, getDay, subDays, isBefore, isAfter } from 'date-fns';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editCommentIndex, setEditCommentIndex] = useState(null);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null); // State for task details
  const [newTask, setNewTask] = useState(''); // State for new task input
  const [isNewTaskVisible, setIsNewTaskVisible] = useState(false); // State for showing new task input

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/task/tasks', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTasks(response.data.tasks);
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

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = Array.from({ length: end.getDate() }, (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1));

    const startDay = getDay(start);
    const prevMonthDays = startDay > 0 ? Array.from({ length: startDay }, (_, i) => subDays(start, startDay - i)) : [];

    return [...prevMonthDays, ...daysInMonth];
  };

  const handleClick = (date) => {
    setSelectedDate(date);
    setIsCommentSectionVisible(true);
    setNewComment('');
    setEditCommentIndex(null);

    // Check for tasks on the selected date
    const taskForDate = tasks.find(task => format(new Date(task.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    if (taskForDate) {
      setTaskDetails(taskForDate); // Set task details if they exist
      setIsNewTaskVisible(false); // Hide new task input
    } else {
      setTaskDetails(null); // Clear task details if no task exists
      setIsNewTaskVisible(true); // Show new task input
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const addComment = () => {
    if (selectedDate && newComment.trim()) {
      setComments(prevComments => ({
        ...prevComments,
        [format(selectedDate, 'yyyy-MM-dd')]: [
          ...(prevComments[format(selectedDate, 'yyyy-MM-dd')] || []),
          newComment
        ]
      }));
      setNewComment('');
      setEditCommentIndex(null);
    }
  };

  const editComment = (index) => {
    setNewComment(comments[format(selectedDate, 'yyyy-MM-dd')][index]);
    setEditCommentIndex(index);
  };

  const updateComment = () => {
    if (selectedDate && newComment.trim()) {
      setComments(prevComments => {
        const updatedComments = [...(prevComments[format(selectedDate, 'yyyy-MM-dd')] || [])];
        updatedComments[editCommentIndex] = newComment;

        return {
          ...prevComments,
          [format(selectedDate, 'yyyy-MM-dd')]: updatedComments
        };
      });
      setNewComment('');
      setEditCommentIndex(null);
    }
  };

  const deleteComment = (index) => {
    setComments(prevComments => {
      const updatedComments = [...(prevComments[format(selectedDate, 'yyyy-MM-dd')] || [])];
      updatedComments.splice(index, 1);

      return {
        ...prevComments,
        [format(selectedDate, 'yyyy-MM-dd')]: updatedComments
      };
    });
  };

  const closeCommentsSection = () => {
    setIsCommentSectionVisible(false);
    setNewComment('');
    setEditCommentIndex(null);
    setTaskDetails(null); // Clear task details
    setNewTask(''); // Clear new task input
    setIsNewTaskVisible(false); // Hide new task input
  };

  const reopenCommentsSection = () => {
    setIsCommentSectionVisible(true);
  };

  const handleNewTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const addNewTask = () => {
    if (newTask.trim()) {
      // You can replace this part with an API call to add the task
      const newTaskObject = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        task: newTask,
        completed: false // Set completed status as needed
      };

      setTasks([...tasks, newTaskObject]); // Update the local state
      setNewTask('');
      setIsNewTaskVisible(false); // Hide the new task input
      alert("Task added successfully!"); // You can replace this with a toast notification
    }
  };

  const today = new Date();
  const selectedDateObj = new Date(selectedDate); // Ensure selectedDate is a valid date string or object

  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  selectedDateObj.setHours(0, 0, 0, 0);


  return (
    <div className="p-5 flex flex-col md:flex-row mt-10">
      <Helmet>
        <title>Calendar View | RitualPlanner</title>
      </Helmet>
      {/* Calendar Section */}
      <div className="flex-1 mb-4 md:mb-0">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
          <div className="flex items-center">
            <button className="bg-gray-600 text-white px-2 py-2 rounded mr-2" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              &lt; {/* Previous Icon */}
            </button>
            <button className="bg-gray-600 text-white px-2 py-2 rounded mr-2" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              &gt; {/* Next Icon */}
            </button>
            <NavLink to="/tasks"><button className="bg-blue-500 text-white px-4 py-2 rounded" >
              {/* Go to Dashboard */}
              <abbr title="Go to Dashboard">←</abbr>
            </button></NavLink>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold text-center">{day}</div>
          ))}

          {getDaysInMonth().map((date, index) => {
            const taskForDate = tasks.find(task => format(new Date(task.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
            const isCompletedTask = taskForDate && isBefore(new Date(taskForDate.date), new Date());
            const isUpcomingTask = taskForDate && isAfter(new Date(taskForDate.date), new Date());

            return (
              <div
                key={index}
                className={`py-4 px-1 border rounded-lg ${isToday(date) ? 'bg-blue-200' : ''} 
                ${isCompletedTask ? 'bg-green-200' : isUpcomingTask ? 'bg-yellow-200' : ''}`}
                onClick={() => handleClick(date)}
              >
                <span>{format(date, 'd')}</span>
                {comments[format(date, 'yyyy-MM-dd')] && comments[format(date, 'yyyy-MM-dd')].length > 0 && <span className="text-xs">💬</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments and Task Details Section */}
      <div className="w-full md:w-1/3 ml-0 md:ml-4">
        {selectedDate && isCommentSectionVisible && (
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">{format(selectedDate, 'MMMM d, yyyy')}</h3>

            {taskDetails ? (
              <div className="mt-2">
                <h4 className="font-semibold">Task Details:</h4>
                <p>{taskDetails.task}</p>
              </div>
            ) : (
              <div className="mt-2">
                <h4 className="font-semibold">No Task Found!</h4>
                {isNewTaskVisible && (
                  <div>
                    {selectedDateObj <= today ? (
                      <NavLink to="/tasks/add/complete">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                          Add Completed Task
                        </button>
                      </NavLink>
                    ) : (
                      <NavLink to="/tasks/add/new">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                          Add New Task
                        </button>
                      </NavLink>
                    )}
                  </div>
                )}
              </div>
            )}

            {isCommentSectionVisible && (
              <div className="mt-4">
                <h4 className="font-semibold">Comments:</h4>
                <div className="mt-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    className="border rounded px-2 py-1 w-full"
                  />
                  {editCommentIndex !== null ? (
                    <button
                      onClick={updateComment}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Update Comment
                    </button>
                  ) : (
                    <button
                      onClick={addComment}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Add Comment
                    </button>
                  )}
                </div>
                {comments[format(selectedDate, 'yyyy-MM-dd')] && comments[format(selectedDate, 'yyyy-MM-dd')].map((comment, index) => (
                  <div key={index} className="flex justify-between items-center mt-2">
                    <span>{comment}</span>
                    <div>
                      <button onClick={() => editComment(index)} className="text-blue-500">Edit</button>
                      <button onClick={() => deleteComment(index)} className="text-red-500 ml-2">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={closeCommentsSection}
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
