import React, { useState } from 'react';

const TasksDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), name: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;

  return (
    <div className="p-6 py-16">
      <h1 className="text-2xl font-bold mb-4">Tasks Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Total Tasks</h2>
          <p className="text-4xl font-bold">{tasks.length}</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Completed Tasks</h2>
          <p className="text-4xl font-bold">{completedTasks}</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Incomplete Tasks</h2>
          <p className="text-4xl font-bold">{incompleteTasks}</p>
        </div>
      </div>

      <div className="mt-8">
        
        <div className="flex space-x-6">
          <input
            type="text"
            placeholder="Search Tasks"
            value={newTask}
            onChange={handleInputChange}
            autoFocus
            className=" flex-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleAddTask}
            className="flex text-black  font-bold py-2 px-14 rounded-md hover:bg-black hover:text-white"
            style={{
              letterSpacing: "1px"
            }}
          >
            <h1>+&nbsp;&nbsp;</h1> Add Task
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Task List</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center px-4 py-2 rounded-md shadow-md ${
                task.completed
                  ? 'bg-green-100 hover:bg-green-200'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskCompletion(task.id)}
                className="mr-4"
              />
              <span
                className={`flex-1 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksDashboard;