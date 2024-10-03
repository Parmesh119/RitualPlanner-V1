// Notifications.js
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBell, FaUserCheck, FaInfoCircle, FaTimes } from 'react-icons/fa'; // Importing icons
import { useNavigate } from 'react-router-dom';

const notificationsData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  message: `You have a new message from user #${i + 1}`,
  section: i % 6 === 0 ? 'Expense Tracking' :
    i % 6 === 1 ? 'Task Management' :
      i % 6 === 2 ? 'Notes' :
        i % 6 === 3 ? 'Report' :
          i % 6 === 4 ? 'Advance Booking' :
            'Profile',
  hoursAgo: Math.floor(Math.random() * 5) + 1, // Random time from 1 to 5 hours ago
  type: i % 3 === 0 ? 'info' : i % 3 === 1 ? 'success' : 'warning',
}));

const ITEMS_PER_PAGE = 10;

const Notifications = () => {
  
  const [isOpen, setIsOpen] = useState(true)

  const navigate = useNavigate()

  const toggleNotification = () => {
    setIsOpen(!isOpen)
    navigate(-1)
  }
  
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState(notificationsData);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentNotifications = notifications.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => Math.min(Math.max(prevPage + direction, 1), totalPages));
  };

  const handleCloseNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <>
    <Helmet>
      <title>
        Notifications | RitualPlanner
      </title>
    </Helmet>
    {
      isOpen &&
      <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg font-bold tracking-wide">
        <span className='flex flex-row justify-between items-start mb-4'>
          <h2 className="text-2xl font-bold text-start tracking-wide">Notifications</h2>
          <button onClick={toggleNotification}>
            <abbr title="close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </abbr>
          </button>
        </span>
        <div className="max-h-80 overflow-y-auto mb-4 border border-gray-300 rounded-lg p-4">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center space-x-5 justify-between p-4 mb-3 rounded-lg ${notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                  notification.type === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}
            >
              <div className="flex items-center">
                {notification.type === 'info' && <FaInfoCircle className="mr-3 text-xl" />}
                {notification.type === 'success' && <FaUserCheck className="mr-3 text-xl" />}
                {notification.type === 'warning' && <FaBell className="mr-3 text-xl" />}
                <span className="text-lg">{notification.message}</span>
                <span className="text-gray-500 ml-3 text-sm">({notification.section} - {notification.hoursAgo}h ago)</span>
              </div>
              <button
                onClick={() => handleCloseNotification(notification.id)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white py-2 px-4 rounded text-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center text-lg">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white py-2 px-4 rounded text-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    }
    </>
  );
};

export default Notifications;
