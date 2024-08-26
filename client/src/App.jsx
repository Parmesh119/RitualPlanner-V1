import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';
import './App.css';
import All_notes from './components/Notes/All_notes';
import One_note from './components/Notes/One_note';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/tasks" element={<Task />} />
            <Route path="/notes/create" element={<Create_Notes />} />
            <Route path="/notes/all" element={<All_notes />} />
            <Route path="/notes/modify/delete/:id" element={<Delete />} />
            <Route path="/notes/modify/update/:id" element={<Update />} />
            <Route path="/notes/detail/:id" element={<One_note />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgot-password" element={<Forgot_Password />} />
            <Route path="/company/terms-conditions" element={<T_C />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
