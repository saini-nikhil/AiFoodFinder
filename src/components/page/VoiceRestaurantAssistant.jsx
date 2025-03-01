import { useState, useEffect } from "react";
import RestaurantMap from "./RestaurantMap";
import VoiceInterface from "./VoiceInterface";

function VoiceRestaurantAssistant5() {
  // Shared state between components
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // API keys
  const goMapsApiKey = "AlzaSyAQzf73F3SxHFEsfN4fY93kbcUOLoaRSSB";
  const geminiApiKey = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g";
  
  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setResponse("I need location access to find nearby restaurants. Please enable location services.");
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FoodFinder</h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Browse</a></li>
              <li><a href="#" className="hover:text-indigo-200 transition-colors">My Orders</a></li>
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Account</a></li>
            </ul>
          </nav>
          {/* Mobile menu icon */}
          <div className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section - Left side on large screens, top on mobile */}
          <div className="w-full lg:w-1/2">
            <RestaurantMap 
              location={location}
              mapLoaded={mapLoaded}
              setMapLoaded={setMapLoaded}
              nearbyRestaurants={nearbyRestaurants}
              setNearbyRestaurants={setNearbyRestaurants}
              setResponse={setResponse}
              goMapsApiKey={goMapsApiKey}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
            />
          </div>
          
          {/* Voice Interface Section - Right side on large screens, bottom on mobile */}
          <div className="w-full lg:w-1/2">
            <VoiceInterface
              query={query}
              setQuery={setQuery}
              response={response}
              setResponse={setResponse}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              isListening={isListening}
              setIsListening={setIsListening}
              nearbyRestaurants={nearbyRestaurants}
              location={location}
              geminiApiKey={geminiApiKey}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-3">FoodFinder</h3>
              <p className="text-gray-400 max-w-xs">Discover the best dishes at your favorite restaurants with voice commands.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-3">Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Restaurants</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-3">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>© 2025 FoodFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default VoiceRestaurantAssistant5;