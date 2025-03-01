import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  
  // Features to showcase
  const features = [
    {
      title: "Voice-Powered Discovery",
      description: "Find your next meal using just your voice. Ask for cuisines, prices, or specific dishes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 18.5a6.5 6.5 0 0 0 6.5-6.5v-6a6.5 6.5 0 1 0-13 0v6a6.5 6.5 0 0 0 6.5 6.5Z" />
          <path d="M16 9.5v1M12 9.5v1M8 9.5v1M12 18.5v2M8.5 21h7" />
        </svg>
      )
    },
    {
      title: "Interactive Maps",
      description: "Visualize nearby restaurants and get directions with a single tap.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
        </svg>
      )
    },
    {
      title: "AI Recommendations",
      description: "Get personalized suggestions based on your preferences and past favorites.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-indigo-900 ml-2">FoodFinder</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-indigo-700 hover:text-indigo-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-indigo-700 hover:text-indigo-900 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-indigo-700 hover:text-indigo-900 transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors hidden md:block">Sign In</button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Get Started</button>
          </div>
        </div>
      </header>
      
      {/* Hero Section with Animation */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 leading-tight">
                Find Perfect Restaurants with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Voice AI</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Discover restaurants tailored to your taste with our voice-activated AI assistant. Simply ask and find your next favorite meal.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-medium">
                  Try Now
                </button>
                <button className="px-8 py-4 bg-white text-indigo-700 border-2 border-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                {/* Phone mockup */}
                <div className="w-80 h-auto mx-auto relative z-10">
                  <div className="rounded-3xl overflow-hidden border-8 border-gray-800 shadow-2xl">
                    <img src="/api/placeholder/400/800" alt="App Interface" className="w-full h-full object-cover" />
                    {/* Voice animation overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full blur-xl opacity-80"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-xl opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </section>
      
      {/* Feature Highlights with Animation */}
      <section id="features" className="py-16 bg-gradient-to-b from-white to-indigo-50 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-16">Smart Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                  currentFeature === index ? 'ring-2 ring-indigo-500 scale-105' : ''
                }`}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-indigo-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-indigo-200"></div>
            
            {/* Steps */}
            <div className="bg-white rounded-2xl p-8 shadow-lg relative">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">1</div>
              <h3 className="text-xl font-bold text-indigo-800 mb-3 text-center">Enable Location</h3>
              <p className="text-gray-600 text-center">Allow FoodFinder to access your location to discover nearby restaurants.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg relative">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">2</div>
              <h3 className="text-xl font-bold text-indigo-800 mb-3 text-center">Ask Via Voice</h3>
              <p className="text-gray-600 text-center">Simply tap the microphone and ask for what you're craving.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg relative">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">3</div>
              <h3 className="text-xl font-bold text-indigo-800 mb-3 text-center">Get Directions</h3>
              <p className="text-gray-600 text-center">View restaurant details and get directions with a single tap.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-16">What Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">SM</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-indigo-900">Sarah M.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The voice recognition is amazing! I asked for 'Italian with outdoor seating' and it found the perfect spot."</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-indigo-900">James D.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"I use this app every time I travel for work. It's saved me from eating at chain restaurants in unfamiliar cities."</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">KL</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-indigo-900">Kelly L.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The map feature is so helpful! I love being able to see all the restaurants around me and get directions instantly."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 shadow-xl relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Discover Amazing Food?</h2>
              <p className="text-indigo-100 text-lg mb-8">Join thousands of food lovers who are discovering new restaurants every day with FoodFinder.</p>
              <button className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Download Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <h3 className="text-xl font-bold ml-2">FoodFinder</h3>
              </div>
              <p className="text-gray-400 mt-4 max-w-xs">Helping you discover delicious dining experiences through the power of voice and AI.</p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Voice Search</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Restaurant Maps</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AI Recommendations</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Directions</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 FoodFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;