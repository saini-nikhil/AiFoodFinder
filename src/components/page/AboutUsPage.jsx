import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-indigo-900 ml-2">FoodFinder</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-indigo-700 hover:text-indigo-900 transition-colors">Home</Link>
            <Link to="/about" className="text-indigo-900 font-medium transition-colors border-b-2 border-indigo-600">About Us</Link>
            <Link to="/contact" className="text-indigo-700 hover:text-indigo-900 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors hidden md:block">Sign In</button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Get Started</button>
            <button className="md:hidden text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Page Content */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-8">About FoodFinder</h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="mb-12 relative">
                <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="/api/placeholder/1200/600" 
                    alt="FoodFinder Team" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Background decorative element */}
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">Our Mission</h2>
              <p>
                At FoodFinder, we believe that finding great food should be effortless and enjoyable. 
                Our mission is to connect people with delicious dining experiences through innovative 
                technology that understands what you're craving before you even know it yourself.
              </p>
              <p>
                Founded in 2023, FoodFinder started with a simple idea: what if you could just speak 
                naturally about what you want to eat, and instantly get personalized recommendations? 
                No more endless scrolling through menus or reading hundreds of reviews.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-800 mt-8 mb-4">Our Story</h2>
              <p>
                FoodFinder was born from personal frustration. Our founders, food enthusiasts living in 
                busy urban environments, found themselves spending too much time trying to decide where 
                to eat. The existing apps required too many taps, too many filters, and still didn't 
                provide truly personalized recommendations.
              </p>
              <p>
                After months of development and testing, we launched our voice-first approach to 
                restaurant discovery. By combining natural language processing with location data and 
                preference learning, we created an experience that feels like asking a knowledgeable 
                friend for a recommendation.
              </p>
              
              <div className="bg-indigo-50 p-8 rounded-xl my-8">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">Innovation</h3>
                    <p className="text-gray-700">
                      We continuously explore new technologies and approaches to make finding great food 
                      even easier and more personalized.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">Local Focus</h3>
                    <p className="text-gray-700">
                      We prioritize helping users discover local gems and independent restaurants that 
                      bring unique flavors to their communities.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">Inclusivity</h3>
                    <p className="text-gray-700">
                      We ensure our platform helps all users find food that meets their dietary needs, 
                      preferences, and accessibility requirements.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">Privacy</h3>
                    <p className="text-gray-700">
                      We respect user data and prioritize security in all aspects of our service, 
                      using your information only to improve your food discovery experience.
                    </p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-indigo-800 mt-8 mb-4">Meet the Team</h2>
              <p>
                Our diverse team brings together expertise in AI, user experience design, and culinary 
                knowledge. Based across three continents, we share a passion for technology and food.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {/* Team Member Cards */}
                {['CEO & Founder', 'CTO', 'Design Lead'].map((role, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-indigo-200 mb-4 overflow-hidden">
                      <img src={`/api/placeholder/${100 + index}/100`} alt={role} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900">Jane Smith</h3>
                    <p className="text-indigo-600">{role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
   <Footer/>
    </div>
  );
};

export default AboutUsPage;