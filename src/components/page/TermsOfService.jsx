import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { ThemeContext } from "../ThemeContext/Themecontext";
import { useAuth } from '../auth/Authcontext'; 

const TermsOfService = () => {
  // Back to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
            <Link to="/about" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>About Us</Link>
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
            <button className="md:hidden text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Terms of Service Content */}
      <div className="container mx-auto px-6 py-12">
        <div className={`max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 md:p-12`}>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-8`}>Terms of Service</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Last Updated: March 1, 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>1. Introduction</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Welcome to FoodFinder. These Terms of Service ("Terms") govern your access to and use of the FoodFinder 
                application, website, and services (collectively, the "Service"). By accessing or using the Service, 
                you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Please read these Terms carefully before using our Service. By accessing or using our Service, you 
                acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>2. Definitions</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                <strong>Service:</strong> The FoodFinder mobile application, website, and related services.
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                <strong>User:</strong> Any individual who accesses or uses the Service.
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                <strong>Content:</strong> Any information, text, graphics, photos, or other materials uploaded, downloaded, 
                or appearing on the Service.
              </p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                <strong>User Content:</strong> Content that users submit, post, or transmit to, or via, the Service.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>3. Account Creation and Usage</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                To use certain features of the Service, you may need to create an account. You are responsible for 
                maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                When creating your account, you must provide accurate and complete information. You must immediately 
                notify FoodFinder of any unauthorized use of your account.
              </p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                FoodFinder reserves the right to disable any user account at any time, including if you have failed 
                to comply with any of the provisions of these Terms.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>4. Privacy Policy</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Our <Link to="/privacy" className={`${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:underline'}`}>Privacy Policy</Link> describes how we handle the information you provide to us when you use our Service. 
                By using the Service, you consent to our collection and use of your data as outlined in our Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>5. Prohibited Activities</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className={`list-disc pl-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
                <li>Harassing, threatening, or intimidating other users</li>
                <li>Impersonating or misrepresenting your affiliation with any person or entity</li>
                <li>Interfering with or disrupting the Service or servers or networks connected to the Service</li>
                <li>Attempting to gain unauthorized access to parts of the Service</li>
                <li>Collecting or harvesting any personally identifiable information from the Service</li>
                <li>Using the Service for any commercial solicitation purposes without our prior written consent</li>
                <li>Submitting false or misleading information</li>
              </ul>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>6. User Content</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                You retain all your ownership rights in your User Content. By submitting User Content to the Service, 
                you grant FoodFinder a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, 
                adapt, modify, publish, transmit, display, and distribute such content.
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                You represent and warrant that: (i) you own the User Content posted by you or otherwise have the right 
                to grant the rights and licenses set forth in these Terms; and (ii) the posting of your User Content 
                does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights 
                of any person.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>7. Intellectual Property Rights</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of FoodFinder and its licensors. The Service is protected by copyright, trademark, and other 
                laws of both the United States and foreign countries.
              </p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Our trademarks and trade dress may not be used in connection with any product or service without the 
                prior written consent of FoodFinder.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>8. Termination</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
                or liability, under our sole discretion, for any reason whatsoever, including without limitation if you 
                breach these Terms.
              </p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                All provisions of these Terms which by their nature should survive termination shall survive termination, 
                including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>9. Limitation of Liability</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                In no event shall FoodFinder, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your 
                access to or use of or inability to access or use the Service; (ii) any conduct or content of any third 
                party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or 
                alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), 
                or any other legal theory, whether or not we have been informed of the possibility of such damage.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>10. Changes to Terms</h2>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
                provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
                will be determined at our sole discretion. By continuing to access or use our Service after any revisions 
                become effective, you agree to be bound by the revised terms.
              </p>
            </section>
            
            <section>
              <h2 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} mb-4`}>11. Contact Us</h2>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                If you have any questions about these Terms, please <Link to="/contact" className={`${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:underline'}`}>contact us</Link>.
              </p>
            </section>
          </div>
          
          <div className="flex justify-center mt-12">
            <button 
              onClick={scrollToTop} 
              className={`px-6 py-3 ${theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfService;