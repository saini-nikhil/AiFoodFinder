import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { ThemeContext } from './Themecontext'; // Make sure the import path and casing are correct
import { useAuth } from '../auth/Authcontext'

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();
  
  // Use the ThemeContext correctly
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };
  // Features to showcase
  const features = [
    {
      title: "Voice-Powered Discovery",
      description: "Find your next meal using just your voice. Ask for cuisines, prices, or specific dishes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 18.5a6.5 6.5 0 0 0 6.5-6.5v-6a6.5 6.5 0 1 0-13 0v6a6.5 6.5 0 0 0 6.5 6.5Z" />
          <path d="M16 9.5v1M12 9.5v1M8 9.5v1M12 18.5v2M8.5 21h7" />
        </svg>
      )
    },
    {
      title: "Interactive Maps",
      description: "Visualize nearby restaurants and get directions with a single tap.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
        </svg>
      )
    },
    {
      title: "AI Recommendations",
      description: "Get personalized suggestions based on your preferences and past favorites.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M5.5 5.5l2.5 2.5M2 12h4M5.5 18.5l2.5-2.5M12 22v-4M18.5 18.5l-2.5-2.5M22 12h-4M18.5 5.5l-2.5 2.5M16 12l-4-4-4 4 4 4 4-4z" />
        </svg>
      )
    }
  ];
  
  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  
  // If still loading, show loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto"></div>
          <h1 className="text-white text-3xl font-bold mt-6">FoodFinder</h1>
          <p className="text-indigo-100 mt-2">Discovering delicious dining nearby...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-indigo-50 to-white'} transition-colors duration-300`}>
      {/* Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} ml-2`}>FoodFinder</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Features</a>
            <a href="#how-it-works" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>How It Works</a>
            <a href="#testimonials" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Testimonials</a>
          </nav>
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
                  { currentUser.displayName || 'User'}
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
      
      {/* Hero Section with Animation */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10">
              <h1 className={`text-4xl md:text-6xl font-bold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'} leading-tight`}>
                Find Perfect Restaurants with <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600'}`}>Voice AI</span>
              </h1>
              <p className={`mt-6 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-lg`}>
                Discover restaurants tailored to your taste with our voice-activated AI assistant. Simply ask and find your next favorite meal.
              </p>
              <div onClick={() => navigate("./VoiceRestaurantAssistant5")} className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-medium">
                  Try Now
                </button>
                <button className={`px-8 py-4 ${theme === 'dark' ? 'bg-gray-800 text-indigo-300 border-gray-700' : 'bg-white text-indigo-700 border-indigo-100'} border-2 rounded-xl shadow-md hover:shadow-lg transition-all`}>
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                {/* Phone mockup */}
                <div>
                  <div className="rounded-3xl overflow-hidden border-8 border-gray-800 shadow-2xl">
                    <img src="https://media.gettyimages.com/id/1331919924/photo/technology-makes-life-so-much-easier-for-young-asian-woman-using-mobile-app-device-on.jpg?b=1&s=2048x2048&w=0&k=20&c=KfY4IgcA-DRifFoeHEJMArplxVsX0P9n95bA0eP52A0=" alt="App Interface" className="w-full h-full object-cover" />
                    {/* Voice animation overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'} rounded-full flex items-center justify-center animate-pulse`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className={`absolute top-1/4 right-0 w-64 h-64 ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-70`}></div>
        <div className={`absolute bottom-1/4 left-0 w-80 h-80 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-70`}></div>
      </section>
      
      {/* Feature Highlights with Animation */}
      <section id="features" className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-b from-white to-indigo-50'} relative`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'} mb-16`}>Smart Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                  currentFeature === index ? 'ring-2 ring-indigo-500 scale-105' : ''
                }`}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-3`}>{feature.title}</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'} mb-16`}>How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className={`hidden md:block absolute top-1/2 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-200'}`}></div>
            
            {/* Steps */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg relative`}>
              <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'} text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto`}>1</div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-3 text-center`}>Enable Location</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center`}>Allow FoodFinder to access your location to discover nearby restaurants.</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg relative`}>
              <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'} text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto`}>2</div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-3 text-center`}>Ask Via Voice</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center`}>Simply tap the microphone and ask for what you're craving.</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg relative`}>
              <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'} text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto`}>3</div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-3 text-center`}>Get Directions</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center`}>View restaurant details and get directions with a single tap.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-b from-indigo-50 to-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'} mb-16`}>What Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-200'} flex items-center justify-center`}>
                  <span className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'} font-bold`}>SM</span>
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>Sarah M.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} italic`}>"The voice recognition is amazing! I asked for 'Italian with outdoor seating' and it found the perfect spot."</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-200'} flex items-center justify-center`}>
                  <span className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'} font-bold`}>JD</span>
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>James D.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} italic`}>"I use this app every time I travel for work. It's saved me from eating at chain restaurants in unfamiliar cities."</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-200'} flex items-center justify-center`}>
                  <span className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'} font-bold`}>KL</span>
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>Kelly L.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} italic`}>"The map feature is so helpful! I love being able to see all the restaurants around me and get directions instantly."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-16 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 shadow-xl relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Discover Amazing Food?</h2>
              <p className="text-indigo-100 text-lg mb-8">Join thousands of food lovers who are discovering new restaurants every day with FoodFinder.</p>
              <button onClick={() => navigate("./VoiceRestaurantAssistant5")} className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Try Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className={`absolute -bottom-24 -right-24 w-64 h-64 ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-70`}></div>
        <div className={`absolute -top-24 -left-24 w-64 h-64 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-70`}></div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;