import React, { useEffect, useState } from 'react';
import { format, endOfMonth, addMonths, subMonths, isToday, startOfMonth, getDay, subDays } from 'date-fns';
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

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks'); // Replace with your API endpoint
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
  };

  const reopenCommentsSection = () => {
    setIsCommentSectionVisible(true);
  };

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
            const isTaskCompleted = taskForDate && taskForDate.completed;
            const isNewTask = taskForDate && !taskForDate.completed;
  
            return (
              <div 
                key={index} 
                className={`py-4 px-1 border rounded-lg ${isToday(date) ? 'bg-blue-200' : ''} ${isTaskCompleted ? 'bg-green-200' : isNewTask ? 'bg-yellow-200' : ''}`}
                onClick={() => handleClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <span>{format(date, 'd')}</span>
                {comments[format(date, 'yyyy-MM-dd')] && comments[format(date, 'yyyy-MM-dd')].length > 0 && <span className="text-xs">💬</span>}
              </div>
            );
          })}
        </div>
      </div>
  
      {/* Comments Section */}
      <div className="w-full md:w-1/3 ml-0 md:ml-4">
        {selectedDate && (
          <div className="p-4 border rounded-lg bg-white shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{`Comments for ${format(selectedDate, 'MMMM d, yyyy')}`}</h3>
              {/* Close button for PC view */}
              <button className="text-red-500 hidden md:block" onClick={closeCommentsSection}>Close</button>
              {/* Close button for mobile view */}
              <button className="text-red-500 md:hidden ml-4" onClick={closeCommentsSection}>X</button>
            </div>
  
            {comments[format(selectedDate, 'yyyy-MM-dd')] && comments[format(selectedDate, 'yyyy-MM-dd')].length > 0 ? (
              <div className="space-y-2 pt-4">
                {comments[format(selectedDate, 'yyyy-MM-dd')].map((comment, index) => (
                  <div key={index} className="flex justify-between items-center text-gray-600">
                    <p>{comment}</p>
                    <div>
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => editComment(index)}>Edit</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteComment(index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='mt-4'>No comments. Would you like to add?</p>
            )}
  
            {isCommentSectionVisible ? (
              <>
                <textarea 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={handleCommentChange}
                  className="border rounded p-2 w-full mt-2"
                />
                <button 
                  onClick={editCommentIndex !== null ? updateComment : addComment} 
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  {editCommentIndex !== null ? 'Update Comment' : 'Add Comment'}
                </button>
              </>
            ) : (
              <button 
                onClick={reopenCommentsSection} 
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Comment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
