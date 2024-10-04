import { useEffect, useState } from 'react';
import { format, isSameDay, isBefore, isAfter } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Calendar = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [action, setAction] = useState('add');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/tasks');
            const data = await response.json();
            if (data.success) {
                setTasks(data.tasks);
            }
        };
        fetchTasks();
    }, []);

    const tasksForSelectedDate = tasks.filter(task => 
        isSameDay(new Date(task.date), selectedDate)
    );

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
        setCurrentTask(null);
        setAction('add');
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        // Add logic to save the task to the database
        setIsModalOpen(false);
    };

    const handleUpdateTask = (task) => {
        setTitle(task.taskName);
        setDescription(task.description);
        setCurrentTask(task);
        setAction('update');
        setIsModalOpen(true);
    };

    const handleDeleteTask = (task) => {
        // Add logic to delete the task from the database
    };

    const highlightClass = (task) => {
        return task.completed ? 'bg-green-200' : 'bg-yellow-200'; // Different colors for completed and upcoming tasks
    };

    return (
        <div className="container mx-auto p-10 mt-10">
            <Helmet>
                <title>Calendar View | RitualPlanner</title>
            </Helmet>
            <h1 className="text-2xl font-bold">Task Management Calendar</h1>
            <div className="grid grid-cols-7 gap-4 mt-4">
                {/* Calendar View */}
                {Array.from({ length: 42 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index - date.getDay());
                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(date)}
                            className={`border p-2 cursor-pointer ${tasks.some(task => isSameDay(new Date(task.date), date)) ? highlightClass(tasks.find(task => isSameDay(new Date(task.date), date))) : ''}`}
                        >
                            {format(date, 'd')}
                        </div>
                    );
                })}
            </div>
            <div className="mt-10">
                <h3 className="text-xl font-bold tracking-wide">Tasks for {format(selectedDate, 'MMMM dd, yyyy')}:</h3>
                <ul className="bg-white shadow-md rounded-lg p-4 mt-2">
                    {tasksForSelectedDate.length > 0 ? (
                        tasksForSelectedDate.map((task, index) => (
                            <li key={index} className={`border-b py-2 ${task.completed ? 'text-gray-500 line-through' : ''}`}>
                                <span className="font-medium">{task.taskName}</span> - {task.description}
                                <button onClick={() => handleUpdateTask(task)} className="ml-2 text-blue-500">Update</button>
                                <button onClick={() => handleDeleteTask(task)} className="ml-2 text-red-500">Delete</button>
                            </li>
                        ))
                    ) : (
                        <li className="py-2 text-gray-500">No tasks for this date. Add If you want to by <NavLink to="/tasks/add/new" className="text-blue-900 font-bold tracking-wide underline">clicking on this link</NavLink></li>
                    )}
                </ul>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-xl font-bold mb-4">{action === 'update' ? 'Update Task' : 'Add Task'}</h2>
                        <form onSubmit={handleAddTask}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border rounded w-full p-2 mb-2"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border rounded w-full p-2 mb-2"
                                required
                            />
                            <input
                                type="date"
                                value={format(selectedDate, 'yyyy-MM-dd')}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">{action === 'update' ? 'Update Task' : 'Add Task'}</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="ml-2 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition duration-200">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
