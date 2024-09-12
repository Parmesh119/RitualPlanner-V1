// TaskManagement.jsx
import React, { useState } from 'react';

const TaskManagement = () => {
  // Sample data - replace with your state management or backend data
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Prepare Ritual Materials', status: 'Pending', dueDate: '2024-09-15' },
    { id: 2, title: 'Meet with Clients', status: 'Completed', dueDate: '2024-09-12' },
    { id: 3, title: 'Prepare Monthly Schedule', status: 'In Progress', dueDate: '2024-09-20' },
  ]);

  // Handler functions
  const handleEdit = (id) => {
    // Edit task logic here
    alert(`Edit task with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Delete task logic here
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Task
        </button>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4 text-left">Task Title</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Due Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="py-2 px-4">{task.title}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-2 px-4">{task.dueDate}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManagement;
