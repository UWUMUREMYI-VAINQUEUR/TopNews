import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import tnLogo from '../assets/tn.png';
import phoneImg from '../assets/phone.jpg';

export default function Register() {
  const { signupStart, signupVerify } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stage, setStage] = useState(1); // 1 = fill form, 2 = verify
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signupStart(form);
    setLoading(false);
    if (res.ok) {
      setMsg('Verification code sent to email. Enter code to complete.');
      setStage(2);
    } else setMsg(res.message);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signupVerify({ ...form, code });
    setLoading(false);
    if (res.ok) navigate('/');
    else setMsg(res.message);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-900 text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
          {msg && <div className="mb-4 text-center text-red-400">{msg}</div>}

          {stage === 1 ? (
            <form onSubmit={handleStart} className="space-y-4">
              <input
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Username"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Email"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Phone"
                required
              />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Password"
                required
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-green-600 p-3 rounded hover:bg-green-700 transition disabled:opacity-50"
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
                Send Verification
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Verification code"
                className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-green-600 p-3 rounded hover:bg-green-700 transition disabled:opacity-50"
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
                Verify & Create Account
              </button>
            </form>
          )}

          {/* OR and Login link */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-600" />
            <span className="mx-2 text-gray-400">Already have an account?</span>
            <hr className="flex-1 border-gray-600" />
          </div>
          <div className="text-center">
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
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
        <img src={phoneImg} alt="Phone" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
