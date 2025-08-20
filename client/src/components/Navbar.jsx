import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaBell, FaUserCircle, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import tnLogo from '../assets/tn.png';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="shadow sticky top-0 z-50 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={tnLogo}
            alt="TopNews"
            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border-2 border-orange-500"
          />
          <span className="text-xl md:text-3xl font-bold text-orange-500 dark:text-orange-400 transition-colors">
            TopNews
          </span>
        </Link>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div className={`flex-col md:flex-row md:flex items-center gap-4 md:gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent p-4 md:p-0 transition-all duration-300 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            <FaHome /> Home
          </Link>

          {user ? (
            <>
              <Link
                to="/CreatePost"
                className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaPlus /> Create
              </Link>

              <Link
                to="/notifications"
                className="relative text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaBell size={20} />
              </Link>

              <Link
                to="/EditProfile"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaUserCircle size={22} />
                <span>{user.username}</span>
              </Link>

              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-orange-500 dark:hover:text-orange-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaUserCircle /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-orange-500 dark:hover:text-orange-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaPlus /> Register
              </Link>
            </>
          )}

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition text-xl"
          >
            {darkMode ? <><FaSun /> Light</> : <><FaMoon /> Dark</>}
          </button>
        </div>
      </div>
    </nav>
  );
}
