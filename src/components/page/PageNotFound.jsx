import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const PageNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      {/* Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-indigo-900 ml-2">FoodFinder</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </header>
      
      {/* 404 Content */}
      <section className="flex-grow flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        
        <div className="text-center max-w-2xl z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-indigo-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">404</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 text-lg mb-10">
            Oops! It seems the restaurant you're looking for is no longer on the menu.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-medium"
            >
              Back to Home
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-white text-indigo-700 border-2 border-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageNotFound;