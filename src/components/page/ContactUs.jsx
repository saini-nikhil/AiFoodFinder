import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { ThemeContext } from '../ThemeContext/Themecontext'; 
import { useAuth } from '../auth/Authcontext'; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
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
            <Link to="/about" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>About Us</Link>
            <Link to="/contact" className={`${theme === 'dark' ? 'text-white bg-indigo-600 px-3 py-1 rounded-md' : 'text-indigo-900 border-b-2 border-indigo-600'} transition-colors`}>Contact</Link>
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
                <Link to="/login" className={`px-4 py-2 border ${theme === 'dark' ? 'border-indigo-400 text-indigo-400 hover:bg-gray-700' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors hidden md:block`}>
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Page Title Section */}
      <section className={`py-12 md:py-20 relative overflow-hidden ${theme === 'dark' ? 'text-white' : ''}`}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6`}>Contact Us</h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions, feedback, or need assistance? We're here to help!
            </p>
          </div>
        </div>
        
        {/* Background decorative elements */}
        {theme !== 'dark' && (
          <>
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          </>
        )}
      </section>
      
      {/* Contact Form Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6`}>Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className={`${theme === 'dark' ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-800'} border rounded-xl p-6 text-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mx-auto mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-800'} mb-2`}>Message Sent!</h3>
                  <p className={theme === 'dark' ? 'text-green-200' : 'text-green-700'}>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)} 
                    className={`mt-6 px-6 py-2 ${theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors`}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
            
            {/* Contact Info */}
            <div>
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-8`}>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6`}>Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-1`}>Phone</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>+1 (555) 123-4567</p>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Mon-Fri, 9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-1`}>Email</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>support@foodfinder.com</p>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>info@foodfinder.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-1`}>Address</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>123 FoodTech Boulevard</p>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>San Francisco, CA 94103</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6`}>Connect With Us</h2>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Follow us on social media for the latest updates and features.</p>
                
                <div className="flex space-x-4 mt-6">
                  <a href="#" aria-label="Twitter" className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'} rounded-full flex items-center justify-center transition-colors`}>
                    <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'} rounded-full flex items-center justify-center transition-colors`}>
                    <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="YouTube" className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'} rounded-full flex items-center justify-center transition-colors`}>
                    <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="instagram" className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'} rounded-full flex items-center justify-center transition-colors`}>
                  <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-b from-white to-indigo-50'} transition-colors duration-300`}>
  <div className="container mx-auto px-6">
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-4`}>Frequently Asked Questions</h2>
      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Find quick answers to common questions about FoodFinder.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>How accurate is the voice recognition?</h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Our voice recognition technology is designed to understand a wide range of accents and speaking styles with over 95% accuracy in most environments.</p>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>Does FoodFinder work offline?</h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>While basic map functionality can work offline if you've previously loaded the area, voice recognition and restaurant data require an internet connection.</p>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>How is my location data used?</h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Your location is only used to find restaurants near you and provide directions. We never store your location history or share it with third parties.</p>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>Is there a premium version available?</h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Yes, our premium version offers additional features like restaurant reservations, personalized recommendations, and ad-free experience for $4.99/month.</p>
      </div>
    </div>
  </div>
</section>
      
         {/* Footer */}
        <Footer/>
    </div>
      );
    };
    
    export default ContactUs;