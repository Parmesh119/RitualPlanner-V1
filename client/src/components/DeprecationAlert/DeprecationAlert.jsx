import { useState, useEffect } from 'react';

const DeprecationAlert = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Handle "Go Back" button click
  const handleGoBack = () => {
    window.history.back();
  };

  // This effect prevents users from bypassing the alert using browser developer tools
  useEffect(() => {
    // Function to check if the alert is still visible
    const checkVisibility = () => {
      const alertElement = document.getElementById('deprecation-alert');
      
      // If the alert is not visible but should be, force reload the page
      if (alertElement && (
        window.getComputedStyle(alertElement).display === 'none' ||
        window.getComputedStyle(alertElement).visibility === 'hidden' ||
        alertElement.style.display === 'none' ||
        alertElement.style.visibility === 'hidden'
      )) {
        window.location.reload();
      }
    };

    // Check visibility every 500ms
    const intervalId = setInterval(checkVisibility, 500);
    
    // Prevent right-click to access developer tools context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Prevent keyboard shortcuts for developer tools
    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
        return false;
      }
    };
    
    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div id="deprecation-alert" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-lg overflow-hidden">
        <div className="bg-red-600 p-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">⚠️</span> Version Deprecation Notice
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            This version of RitualPlanner is deprecated and is not recommended for use by the official RitualPlanner team. 
            It has security vulnerabilities and other issues that may cause the software to function inefficiently.
          </p>
          <p className="text-gray-700">
            You may experience problems while using this version. If you choose to continue, 
            please be aware that the RitualPlanner official team will not be responsible for any issues that occur.
          </p>
          <p className="font-semibold text-gray-800">
            Version 2 is currently under development. Please stay tuned for updates.
          </p>
        </div>
        <div className="bg-gray-100 p-4 flex justify-center">
          <button 
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            onClick={handleGoBack}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeprecationAlert;