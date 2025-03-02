import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Loader2, Bot, User, RefreshCw, Mic, MicOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

import { ThemeContext } from './Themecontext';
import { useAuth } from '../auth/Authcontext';
import Footer from './Footer';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m your FoodFinder assistant. Ask me to find restaurants by cuisine, price range, or dish. You can also use voice commands!', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark';
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const apiKey = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g";
  
  // Simulated restaurants data that would normally come from an API
  const nearbyRestaurants = [
    { name: "Pasta Paradise", cuisine: "Italian", price: "$$", rating: 4.7, distance: "0.3 miles" },
    { name: "Sushi Wave", cuisine: "Japanese", price: "$$$", rating: 4.8, distance: "0.5 miles" },
    { name: "Taco Time", cuisine: "Mexican", price: "$", rating: 4.5, distance: "0.7 miles" },
    { name: "Curry House", cuisine: "Indian", price: "$$", rating: 4.6, distance: "1.1 miles" }
  ];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  // Speech recognition setup
  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Auto-submit if confident
        if (event.results[0][0].confidence > 0.8) {
          handleVoiceInput(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };
  
  const handleVoiceInput = (transcript) => {
    const syntheticEvent = { preventDefault: () => {} };
    setInput(transcript);
    setTimeout(() => {
      handleSubmit(syntheticEvent);
    }, 500);
  };

  // Check if user is asking about "nearby" locations
  const checkForNearbyRequest = (input) => {
    const nearbyKeywords = ['nearby', 'near me', 'close by', 'around here', 'in this area'];
    const normalizedInput = input.toLowerCase();
    
    return nearbyKeywords.some(keyword => normalizedInput.includes(keyword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if the user is asking for nearby restaurants specifically
      if (checkForNearbyRequest(userMessage.content)) {
        // Add a response message indicating redirect
        const redirectMessage = {
          role: 'bot',
          content: 'I found several restaurants near you! Redirecting you to the detailed map view...',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, redirectMessage]);
        
        // Delay redirect slightly to allow user to see the message
        setTimeout(() => {
          navigate('/VoiceRestaurantAssistant'); // Redirect to your detailed page
        }, 1500);
        
        setIsLoading(false);
        return;
      }
      
      // Process the request - look for restaurant related queries
      let botResponse = '';
      const normalizedInput = input.toLowerCase();
      
      // Check if the query is about restaurants
      if (
        normalizedInput.includes('restaurant') || 
        normalizedInput.includes('food') || 
        normalizedInput.includes('eat') ||
        normalizedInput.includes('dining') ||
        normalizedInput.includes('hungry')
      ) {
        // Look for cuisine type
        const cuisineTypes = ['italian', 'japanese', 'mexican', 'indian', 'chinese', 'thai', 'american', 'french'];
        const matchedCuisine = cuisineTypes.find(cuisine => normalizedInput.includes(cuisine));
        
        if (matchedCuisine) {
          // Filter restaurants by cuisine
          const filteredRestaurants = nearbyRestaurants.filter(
            restaurant => restaurant.cuisine.toLowerCase() === matchedCuisine
          );
          
          if (filteredRestaurants.length > 0) {
            botResponse = `I found ${filteredRestaurants.length} ${matchedCuisine} restaurants near you:\n\n`;
            filteredRestaurants.forEach(restaurant => {
              botResponse += `- **${restaurant.name}** ⭐ ${restaurant.rating} · ${restaurant.price} · ${restaurant.distance}\n`;
            });
            botResponse += "\nWould you like to get directions to any of these places?";
          } else {
            const randomRestaurant = nearbyRestaurants[Math.floor(Math.random() * nearbyRestaurants.length)];
            botResponse = `I don't see any ${matchedCuisine} restaurants nearby, but I found ${randomRestaurant.name} (${randomRestaurant.cuisine}) that's ${randomRestaurant.distance} away. Would you like to try that instead?`;
          }
        } else {
          // General restaurant recommendation
          botResponse = "Here are some restaurants nearby:\n\n";
          nearbyRestaurants.forEach(restaurant => {
            botResponse += `- **${restaurant.name}** - ${restaurant.cuisine} · ⭐ ${restaurant.rating} · ${restaurant.price} · ${restaurant.distance}\n`;
          });
          botResponse += "\nDo any of these interest you? Or would you like to specify a cuisine type?";
        }
      } else {
        // Use AI for other types of queries
        const context = `Context:
FoodFinder is a voice-powered restaurant discovery app that helps users find perfect dining options nearby. The app uses location data to recommend restaurants based on cuisine preferences, price ranges, and specific dishes. FoodFinder provides personalized recommendations based on user preferences and past favorites.`;

        const prompt = `${context}\n\nQuestion: ${userMessage.content}`;

        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          method: "post",
          data: {
            contents: [{ parts: [{ text: prompt }] }],
          },
        });

        botResponse = response.data.candidates[0].content.parts[0].text;
      }
      
      const botMessage = {
        role: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const resetConversation = () => {
    setMessages([
      { role: 'bot', content: 'Hello! I\'m your FoodFinder assistant. Ask me to find restaurants by cuisine, price range, or dish. You can also use voice commands!', timestamp: new Date() }
    ]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-indigo-50 to-white text-gray-900'} transition-colors duration-300`}>
      {/* Navigation Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-900'} ml-2`}>FoodFinder</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`${darkMode ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Home</Link>
            <Link to="/about" className={`${darkMode ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>About Us</Link>
            <Link to="/contact" className={`${darkMode ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Contact</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'} transition-colors`}
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
                <Link to="/login" className={`px-4 py-2 border ${darkMode ? 'border-indigo-400 text-indigo-400 hover:bg-gray-700' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors hidden md:block`}>Sign In</Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="py-8 px-4">
        <div className={`flex flex-col h-[60vh] w-full max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Chat Header */}
          <div className={`flex items-center p-4 ${
            darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
          } border-b ${darkMode ? 'border-gray-700' : 'border-transparent'}`}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-2">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h2 className="font-semibold text-white">
                FoodFinder Voice Assistant
              </h2>
            </div>
            <button 
              onClick={resetConversation}
              className="ml-auto p-2 rounded-full hover:bg-opacity-80 transition-colors hover:bg-white hover:bg-opacity-20"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? darkMode ? 'bg-indigo-600' : 'bg-indigo-100'
                    : darkMode ? 'bg-purple-600' : 'bg-purple-100'
                }`}>
                  {message.role === 'user' ? (
                    <User className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-indigo-600'}`} />
                  ) : (
                    <Bot className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                  )}
                </div>

                {/* Message Content */}
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                    : message.error
                      ? darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-800'
                      : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
                }`}>
                  <div className="text-sm prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <span className={`text-xs mt-1 block ${
                    message.role === 'user'
                      ? 'text-indigo-100'
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className={`p-4 border-t ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about restaurants nearby..."
                className={`flex-1 p-3 rounded-lg border resize-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                rows="2"
                disabled={isLoading || isRecording}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={isRecording ? () => setIsRecording(false) : startVoiceRecognition}
                className={`p-3 rounded-full ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90'
                } text-white transition-colors`}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5 animate-pulse" />
                )}
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim() || isRecording}
                className={`p-3 rounded-lg ${
                  isLoading || !input.trim() || isRecording
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90'
                } text-white transition-colors`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}