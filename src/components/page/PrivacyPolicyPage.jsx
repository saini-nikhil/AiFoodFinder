import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const PrivacyPolicyPage = () => {
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
            <Link to="/about" className="text-indigo-700 hover:text-indigo-900 transition-colors">About Us</Link>
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
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="mb-10">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 text-center mb-2">Privacy Policy</h1>
              <p className="text-gray-500 text-center">Last Updated: March 1, 2025</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                At FoodFinder, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our mobile application and website.
                Please read this policy carefully. If you disagree with any part of this policy, please
                discontinue use of our application and services immediately.
              </p>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-lg font-bold text-indigo-700 mt-6 mb-2">Personal Data</h3>
              <p>
                We may collect personally identifiable information, such as:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Date of birth</li>
                <li>Demographic information</li>
                <li>Location data</li>
                <li>Device information</li>
              </ul>
              
              <h3 className="text-lg font-bold text-indigo-700 mt-6 mb-2">Usage Data</h3>
              <p>
                We automatically collect certain information about how you interact with our application, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Restaurant searches and preferences</li>
                <li>Voice commands and queries</li>
                <li>Times and dates of visits</li>
                <li>Other statistics</li>
              </ul>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience</li>
                <li>Improve our application and services</li>
                <li>Process transactions</li>
                <li>Send administrative information</li>
                <li>Provide customer support</li>
                <li>Send marketing and promotional communications</li>
                <li>Respond to legal requests and prevent harm</li>
              </ul>
              
              <div className="bg-indigo-50 p-6 rounded-xl my-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-4">Voice Data Processing</h2>
                <p className="mb-4">
                  FoodFinder uses voice recognition technology to process your verbal requests and commands.
                  Here's what you should know about how we handle voice data:
                </p>
                <ul className="list-disc pl-6">
                  <li className="mb-2">Voice data is processed in real-time to provide restaurant recommendations</li>
                  <li className="mb-2">We may store anonymized voice commands to improve our voice recognition system</li>
                  <li className="mb-2">You can delete your voice data history through the app settings</li>
                  <li>We do not continuously record audio; recording is only activated when you use the microphone feature</li>
                </ul>
              </div>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Sharing Your Information</h2>
              <p>
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Service providers and business partners</li>
                <li>Affiliated companies</li>
                <li>Legal authorities when required by law</li>
                <li>Business transferees in the event of a merger, acquisition, or sale</li>
              </ul>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information from unauthorized access, alteration, disclosure, or destruction. However,
                no method of transmission over the Internet or electronic storage is 100% secure, so
                we cannot guarantee absolute security.
              </p>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information,
                including the right to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If you are a parent or guardian and believe your
                child has provided us with personal information, please contact us.
              </p>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We reserve the right to update or change our Privacy Policy at any time. We will notify you
                of any changes by posting the new Privacy Policy on this page and updating the "Last Updated"
                date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              
              <h2 className="text-xl font-bold text-indigo-800 mt-8 mb-4">Contact Us</h2>
              <p className="mb-8">
                If you have questions or concerns about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@foodfinder.com" className="text-indigo-600 hover:text-indigo-800">privacy@foodfinder.com</a>
                <br />
                Or visit our <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">Contact Us</Link> page.
              </p>
            </div>
          </div>
        </div>
      </section>
      
         {/* Footer */}
 <Footer/>
    </div>
      );
    };
    
    export default PrivacyPolicyPage ;