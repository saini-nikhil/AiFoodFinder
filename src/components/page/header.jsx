import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from "../ThemeContext/Themecontext";
import { useAuth } from '../auth/Authcontext';

const Navheader = ({ viewMode, setViewMode }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll and apply blur when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Add blur when scrolled more than 50px
      } else {
        setIsScrolled(false); // Remove blur when scrolled to the top
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <header
      className={`py-4 px-6 shadow-md sticky top-0 z-20 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md" : ""
      } ${theme === 'light' ? 'bg-white text-indigo-900' : 'bg-gray-900 text-white'}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1>
            <Link
              className={`text-2xl font-bold ${theme === "dark" ? "text-indigo-300" : "text-indigo-900"} ml-2`}
              to="/"
            >
              FoodFinder
            </Link>
          </h1>
        </div>

        <div className={`hidden md:flex ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
  <button
    onClick={() => setViewMode("split")}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      viewMode === "split"
        ? `${theme === 'dark' ? 'bg-gray-600 text-indigo-300' : 'bg-white text-indigo-700'} shadow-sm`
        : `${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`
    }`}
  >
    Split View
  </button>
  <button
    onClick={() => setViewMode("map")}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      viewMode === "map"
        ? `${theme === 'dark' ? 'bg-gray-600 text-indigo-300' : 'bg-white text-indigo-700'} shadow-sm`
        : `${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`
    }`}
  >
    Map View
  </button>
  <button
    onClick={() => setViewMode("voice")}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      viewMode === "voice"
        ? `${theme === 'dark' ? 'bg-gray-600 text-indigo-300' : 'bg-white text-indigo-700'} shadow-sm`
        : `${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`
    }`}
  >
    Voice View
  </button>
</div>


        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'} transition-colors`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              <span className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                {currentUser.displayName || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2 border ${theme === 'dark' ? 'border-indigo-400 text-indigo-400 hover:bg-gray-700' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors hidden md:block`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navheader;
