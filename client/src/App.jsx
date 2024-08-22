import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import HomePage from './components/Hero/HomePage'
import Contact from './components/Contact/Contact'
import About from './components/About/About'
import Profile from './components/Profile/Profile'
import Task from './components/Task/Task'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import Footer from './components/Footer/Footer'
import Forgot_Password from './components/Forgot Password/Forgot_Password'

import { Toaster } from 'react-hot-toast'

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<Forgot_Password />} />
        </Routes>
        <Toaster />
        <Footer />
      </Router>
    </>
  )
}

export default App
