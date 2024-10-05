import { useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

const notificationsData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  message: `Hello, how are you doing today? This is notification number ${i + 1}.`,
  avatarColor: i % 2 === 0 ? 'bg-blue-500' : 'bg-orange-500',
  time: `${Math.floor(Math.random() * 24)} May`,
}));

const Notifications = () => {
  const [selectedTab, setSelectedTab] = useState('All'); // Manage tabs
  const [notifications, setNotifications] = useState(notificationsData);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  // Get current notifications for the page
  const currentNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleMarkAllAsRead = () => {
    // Implement mark all as read logic
    console.log("All notifications marked as read");
  };

  const handleCloseNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white text-white">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl shadow-lg"> {/* Increased padding and width */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <span className="text-blue-400 cursor-pointer">Help</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-3 py-1 rounded-full ${selectedTab === 'All' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => handleTabChange('All')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full ${selectedTab === 'Unread' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => handleTabChange('Unread')}
          >
            Unread
          </button>
          <button
            className={`px-3 py-1 rounded-full ${selectedTab === 'Archived' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => handleTabChange('Archived')}
          >
            Archived
          </button>
        </div>

        {/* Mark all as read */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">You have {notifications.length} new notifications</span>
          <button onClick={handleMarkAllAsRead} className="text-blue-400">Mark all as read</button>
        </div>

        {/* Notification List */}
        <div className="space-y-4 max-h-96 overflow-y-auto"> {/* Increased max height */}
          {currentNotifications.map((notification) => (
            <div key={notification.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full ${notification.avatarColor} flex justify-center items-center text-white mr-4`}>
                  {notification.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{notification.name}</p>
                  <p className="text-gray-400 text-xs">{notification.message}</p>
                </div>
              </div>
              <div className="text-gray-400 text-xs">
                {notification.time}
              </div>
              <button onClick={() => handleCloseNotification(notification.id)} className="text-gray-500 hover:text-red-500">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-3 py-1 rounded-full ${currentPage > 1 ? 'text-blue-400' : 'text-gray-400 cursor-not-allowed'}`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
          <button
            className={`px-3 py-1 rounded-full ${currentPage < totalPages ? 'text-blue-400' : 'text-gray-400 cursor-not-allowed'}`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
