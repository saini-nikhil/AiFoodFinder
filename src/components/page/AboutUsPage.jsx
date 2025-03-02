import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { ThemeContext } from './Themecontext'; // Ensure the import path and casing are correct
import { useAuth } from '../auth/Authcontext'; // Ensure the import path matches your file structure

const AboutUsPage = () => {
  // Use the ThemeContext correctly
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-indigo-50 to-white'} transition-colors duration-300`}>
      {/* Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} ml-2`}>FoodFinder</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Home</Link>
            <Link to="/about" className={`${theme === 'dark' ? 'text-indigo-300 border-b-2 border-indigo-600' : 'text-indigo-900 border-b-2 border-indigo-600'} transition-colors`}>About Us</Link>
            <Link to="/contact" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Contact</Link>
          </nav>
          <div className="flex items-center space-x-3">
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
              <button
                onClick={handleLogout}
                className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
              >
                Logout
              </button>
            ) : (
              <>
                <button className={`px-4 py-2 border ${theme === 'dark' ? 'border-indigo-400 text-indigo-400 hover:bg-gray-700' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors hidden md:block`}>Sign In</button>
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Get Started</button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Page Content */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'} mb-8`}>About FoodFinder</h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="mb-12 relative">
                <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://startupsmagazine.co.uk/sites/default/files/2020-11/AdobeStock_291895827ed.jpg" 
                    alt="FoodFinder Team" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Background decorative element */}
                <div className={`absolute -bottom-6 -right-6 w-64 h-64 ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10`}></div>
              </div>
              
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>Our Mission</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                At FoodFinder, we believe that finding great food should be effortless and enjoyable. 
                Our mission is to connect people with delicious dining experiences through innovative 
                technology that understands what you're craving before you even know it yourself.
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Founded in 2023, FoodFinder started with a simple idea: what if you could just speak 
                naturally about what you want to eat, and instantly get personalized recommendations? 
                No more endless scrolling through menus or reading hundreds of reviews.
              </p>
              
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mt-8 mb-4`}>Our Story</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                FoodFinder was born from personal frustration. Our founders, food enthusiasts living in 
                busy urban environments, found themselves spending too much time trying to decide where 
                to eat. The existing apps required too many taps, too many filters, and still didn't 
                provide truly personalized recommendations.
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                After months of development and testing, we launched our voice-first approach to 
                restaurant discovery. By combining natural language processing with location data and 
                preference learning, we created an experience that feels like asking a knowledgeable 
                friend for a recommendation.
              </p>
              
              <div className={`bg-${theme === 'dark' ? 'gray-800' : 'indigo-50'} p-8 rounded-xl my-8`}>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} mb-2`}>Innovation</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      We continuously explore new technologies and approaches to make finding great food 
                      even easier and more personalized.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} mb-2`}>Local Focus</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      We prioritize helping users discover local gems and independent restaurants that 
                      bring unique flavors to their communities.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} mb-2`}>Inclusivity</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      We ensure our platform helps all users find food that meets their dietary needs, 
                      preferences, and accessibility requirements.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} mb-2`}>Privacy</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      We respect user data and prioritize security in all aspects of our service, 
                      using your information only to improve your food discovery experience.
                    </p>
                  </div>
                </div>
              </div>
              
            
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;