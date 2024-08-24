
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = () => {

  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")

  const navigate = useNavigate()
  
  const handleSubmit = async () => {
    if(!email || !password) {
      return toast.error("Provide all details...!")
    } 
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/users/login', {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email, password})
      })

      const response_data = await response.json()
      console.log(response_data)
      
      if(response_data.error) {
        return toast.error(response_data.error)
      } else {
        const loadingToastId = toast.loading('Checking Credentials...');
        setEmail("")
        setPassword("")
        navigate("/")
        toast.dismiss(loadingToastId)
        return toast.success(response_data.success)
      }
    } catch(error) {
      return toast.error(error.message)
    }
  }

  function myFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Login to Your Account - RitualPlanner</title>
      </Helmet>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Sign In Heading */}
        <img
          alt="RitualPlanner"
          src="https://i.ibb.co/wS8fFBn/logo-color.png"
          className="h-12 w-auto m-auto mb-2"
        />
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email and password to sign in
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="credentials"
            className="block text-sm font-semibold text-gray-700 mb-1 text-left"
          >
            Your Email
          </label>
          <input
            type="text"
            id="credentials"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="name@gmail.com"
            autoFocus
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-1 text-left"
          >
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>
          <div className="text-left">
            <input type="checkbox" onClick={myFunction} className="mt-4 mx-1 p-2 " />Show Password
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Login
        </button>

        {/* Forgot Password Link */}
        <div className="flex justify-between items-center mb-4">
          <NavLink
            to="/forgot-password"
            className="text-sm text-blue-800 font-bold hover:underline"
          >
            Forgot password?
          </NavLink>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 flex justify-center items-center mb-4"
        >
          <img
            src="https://logowik.com/content/uploads/images/985_google_g_icon.jpg"
            alt="Google Logo"
            className="w-45 h-8 mr-2"
          />
          Login With Google
        </button>

        {/* Create Account Link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don`t have an account?{" "}
            <NavLink
              to="/register"
              className="text-blue-800 font-semibold hover:underline"
            >
              Create account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
