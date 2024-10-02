import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar';
import HomePage from './components/Hero/HomePage';
import Contact from './components/Contact/Contact';
import About from './components/About/About';
import Profile from './components/Profile/Profile';
import Task from './components/Task/Task';
import Create_Notes from './components/Notes/Create_Notes';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Footer from './components/Footer/Footer';
import Forgot_Password from './components/Forgot Password/Forgot_Password';
import T_C from './components/Company/Terms & Conditions/T&C';
import Delete from './components/Notes/Delete'
import Update from './components/Notes/Update'
import All_notes from './components/Notes/All_notes';
import One_note from './components/Notes/One_note';
import New_Password from './components/New-Password/New_Password';
import Dashboard from './components/Dashboard/Dashboard';
import Notification from './components/Notification/Notification';
import AddTask from './components/Task/AddTask';
import SettingsPage from './components/Setting/Setting';
import AddNewTask from './components/Task/AddNewTask'

import './App.css';
import CookieConsent from './components/Cookie/Cookie';

function App() {

  const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem("token");
    if (token) {
      return children; 
    } else {
      return <Navigate to={"/login"} />;
    }
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
            <CookieConsent />
        <main className="flex-grow">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <Profile />
                </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute >
                <Task />
                </ProtectedRoute>
                }
                
            />

            <Route path="/notes/create" element={
              <ProtectedRoute>
                <Create_Notes />
                </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            } />

            <Route path="/tasks/add/complete" element={<AddTask />} />
            <Route path="/tasks/add/new" element={<AddNewTask />} />

            <Route path="/notes/all" element={
              <ProtectedRoute >
              <All_notes />
              </ProtectedRoute>
            } />
            <Route path="/notes/modify/delete/:id" element={<Delete />} />
            <Route path="/notes/modify/update/:id" element={<Update />} />
            <Route path="/notes/detail/:id" element={<One_note />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/recover-password/verify-otp" element={<Forgot_Password />} />
            <Route path="/recover-password/new-password" element={<New_Password />} />
            <Route path="/company/terms-conditions" element={<T_C />} />
            <Route path="/profile/:id/dashboard" element={
              <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>} />
              <Route path="/profile/:id/setting" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
