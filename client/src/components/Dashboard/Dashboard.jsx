import React from 'react';
import { useState } from 'react';

const Dashboard = () => {
  // Placeholder user data and task data for now
  const tasks = [
    { id: 1, task: "Finalize client ceremony details", status: "Pending" },
    { id: 2, task: "Prepare pooja materials", status: "In Progress" },
    { id: 3, task: "Update Karmakand schedule", status: "Completed" },
  ];

  const activities = [
    { id: 1, activity: "Added new task for upcoming event", time: "2 hours ago" },
    { id: 2, activity: "Completed pooja booking", time: "5 hours ago" },
    { id: 3, activity: "Scheduled new ritual appointment", time: "1 day ago" },
  ];

  // Responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 p-6 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all`}>
        <div className="flex justify-between items-center">
          <h2 className={`${sidebarOpen ? 'text-lg' : 'hidden'} font-bold`}>RitualPlanner</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-icons">menu</span>
          </button>
        </div>
        <ul className="mt-6 space-y-4">
          <li>Dashboard</li>
          <li>Tasks</li>
          <li>Notes</li>
          <li>Notifications</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="space-x-6">
            <span className="text-sm">Visitors: 1237</span>
            <span className="text-sm">Orders: 397</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="rounded-full w-10 h-10"
            />
          </div>
        </div>

        {/* Task Summary and Social Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Task Summary</h3>
            <ul>
              {tasks.map(task => (
                <li key={task.id} className="flex justify-between mb-2">
                  <span>{task.task}</span>
                  <span className={`text-xs py-1 px-2 rounded ${task.status === 'Completed' ? 'bg-green-100 text-green-500' : task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-500' : 'bg-gray-100 text-gray-500'}`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <ul>
              {activities.map(activity => (
                <li key={activity.id} className="flex justify-between mb-2">
                  <span>{activity.activity}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Get in Touch */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md"
            />
            <textarea
              placeholder="Message"
              className="w-full p-2 border rounded-md"
              rows="4"
            ></textarea>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
