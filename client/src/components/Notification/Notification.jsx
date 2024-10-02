import React, { useState } from 'react';

const Notification = () => {
  // Sample notifications to display
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your task has been created successfully!', type: 'success' },
    { id: 2, message: 'Unable to connect to the server.', type: 'error' },
    { id: 3, message: 'Your settings have been saved.', type: 'info' },
  ]);

  // Function to dismiss a notification
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 w-80 space-y-4 z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-md flex justify-between items-center 
            ${notification.type === 'success' ? 'bg-green-100 border border-green-400' : ''}
            ${notification.type === 'error' ? 'bg-red-100 border border-red-400' : ''}
            ${notification.type === 'info' ? 'bg-blue-100 border border-blue-400' : ''}`}
        >
          <span className="text-gray-800">{notification.message}</span>
          <button
            className="ml-4 text-sm text-gray-500 hover:text-gray-900"
            onClick={() => dismissNotification(notification.id)}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
