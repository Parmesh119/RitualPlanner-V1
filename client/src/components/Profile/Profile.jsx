import { useState } from 'react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { AiOutlineSetting } from 'react-icons/ai';
import { Helmet } from 'react-helmet';

const ProfilePageAdvanced = () => {
  const [user, setUser] = useState({
    name: 'Parmesh Bhatt',
    email: 'parmesh.bhatt@example.com',
    phone: '+91 9876543210',
    address: '123, ABC Street, India',
    dob: '1999-08-15',
    profilePic: 'https://via.placeholder.com/150',
    tasksCompleted: 50,
    upcomingTasks: 5,
    bio: 'Cloud Developer focused on AWS and modern web technologies.',
    skills: ['React', 'AWS', 'TailwindCSS', 'Node.js'],
    twitter: 'https://twitter.com/parmesh_bhatt',
    linkedin: 'https://www.linkedin.com/in/parmesh-bhatt/',
    instagram: 'https://instagram.com/parmesh_bhatt',
    progress: 70,
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showModal, setShowModal] = useState(false);

  const handleProfilePicChange = (e) => {
    const newProfilePic = URL.createObjectURL(e.target.files[0]);
    setUser({ ...user, profilePic: newProfilePic });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>
          {user.name + " | RitualPlanner"}
        </title>
      </Helmet>
      {/* Profile Banner Section */}
      <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg mb-8 h-48 md:h-60">
        <div className="absolute bottom-0 left-0 flex items-center space-x-6 p-6">
          <img
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white"
            src={user.profilePic}
            alt="Profile"
          />
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-semibold">{user.name}</h1>
            <p className="text-sm md:text-base mt-1">{user.bio}</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-6">
          <button
            onClick={() => setShowModal(true)}
            className="text-white bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            <AiOutlineSetting className="inline-block mr-2" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs for Profile, Settings, Activity */}
      <div className="flex justify-around mb-8 text-lg font-semibold">
        <button
          className={`px-4 py-2 ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {/* Main Section */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="mt-2 w-full bg-gray-100 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-2 w-full bg-gray-100 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={user.phone}
                  disabled
                  className="mt-2 w-full bg-gray-100 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={user.address}
                  disabled
                  className="mt-2 w-full bg-gray-100 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={user.dob}
                  disabled
                  className="mt-2 w-full bg-gray-100 border rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Profile Progress */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{user.progress}% complete</p>
            {user.progress < 100 && (
              <p className="mt-4 text-sm text-red-500">
                Complete your profile by adding more information!
              </p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            <div className="space-y-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-lg mr-2"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div>
            <label className="block text-sm font-medium">Change Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="mt-2 w-full bg-gray-100 border rounded-lg p-2"
            />
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg w-full">
            Update Password
          </button>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <FaTwitter />
              </div>
              <p className="text-sm">You followed someone on Twitter.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <FaLinkedin />
              </div>
              <p className="text-sm">You updated your LinkedIn profile.</p>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="flex justify-center space-x-6 mt-10">
        <a href={user.twitter} target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-blue-400 text-2xl" />
        </a>
        <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-blue-600 text-2xl" />
        </a>
        <a href={user.instagram} target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-500 text-2xl" />
        </a>
      </div>

      {/* Modal for Profile Picture Change */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Change Profile Picture</h3>
            <input type="file" onChange={handleProfilePicChange} className="mb-4" />
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePageAdvanced;
