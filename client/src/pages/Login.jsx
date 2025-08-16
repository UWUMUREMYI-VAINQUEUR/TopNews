import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import paperImg from '../assets/paper.jpg';
import tnLogo from '../assets/tn.png';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(emailOrUsername, password);
    setLoading(false);
    if (res.ok) navigate('/');
    else setErr(res.message);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-900 text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          {err && <div className="mb-4 text-center text-red-400">{err}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email or Username"
              className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center bg-blue-600 p-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              Login
            </button>
          </form>

          {/* OR and Signup */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-600" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="flex-1 border-gray-600" />
          </div>
          <div className="text-center">
            <span className="text-gray-400 mr-2">Don't have an account?</span>
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Vertical line with logo */}
      <div className="hidden md:flex flex-col items-center justify-center relative w-24 bg-gray-900">
        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-500"></div>
        <img src={tnLogo} alt="Logo" className="w-20 h-20 z-10 bg-gray-800 rounded-full p-2 mt-4" />
      </div>

      {/* Right image */}
      <div className="md:w-1/2 hidden md:block">
        <img src={paperImg} alt="Paper" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
