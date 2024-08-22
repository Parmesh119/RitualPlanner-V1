import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Simple email validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailValue));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
        <Helmet>
            <title>
                Recover Password - RitualPlanner
            </title>
        </Helmet>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <img
                alt="RitualPlanner"
                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                className="h-12 m-auto mb-4 w-auto"
              />
        {/* Forgot Password Heading */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email to reset your password
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-1 text-left"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="name@mail.com"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        {/* Top Input Field (only visible when email is valid) */}
        {isEmailValid && (
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-1 text-left"
            >
             Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Submit
        </button>

        {/* Back to Login Button */}
        <NavLink to="/login"><button
          className="w-full py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Back to Login
        </button></NavLink>
      </div>
    </div>
  );
};

export default ForgotPassword;
