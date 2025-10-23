import { useState, useEffect } from 'react';
import './DeprecationAlert.css';

const DeprecationAlert = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  
  // Close the dialog and store in localStorage to prevent showing again in this session
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('deprecationAlertShown', 'true');
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    window.history.back();
  };

  // Check if the alert has been shown before
  useEffect(() => {
    const alertShown = localStorage.getItem('deprecationAlertShown');
    if (alertShown) {
      setIsOpen(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="deprecation-alert-overlay">
      <div className="deprecation-alert-container">
        <div className="deprecation-alert-header">
          <h2>⚠️ Version Deprecation Notice</h2>
        </div>
        <div className="deprecation-alert-content">
          <p>
            This version of RitualPlanner is deprecated and is not recommended for use by the official RitualPlanner team. 
            It has security vulnerabilities and other issues that may cause the software to function inefficiently.
          </p>
          <p>
            You may experience problems while using this version. If you choose to continue, 
            please be aware that the RitualPlanner official team will not be responsible for any issues that occur.
          </p>
          <p>
            <strong>Version 2 is currently under development. Please stay tuned for updates.</strong>
          </p>
          
          <div className="deprecation-alert-checkbox">
            <input 
              type="checkbox" 
              id="acknowledgment" 
              checked={isChecked} 
              onChange={handleCheckboxChange} 
            />
            <label htmlFor="acknowledgment">
              I am aware of the potential threats and take full responsibility for using this version
            </label>
          </div>
        </div>
        <div className="deprecation-alert-actions">
          <button 
            className="go-back-btn" 
            onClick={handleGoBack}
          >
            Go Back
          </button>
          <button 
            className={`continue-btn ${!isChecked ? 'disabled' : ''}`} 
            onClick={handleClose} 
            disabled={!isChecked}
          >
            Visit RitualPlanner Version 1
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeprecationAlert;