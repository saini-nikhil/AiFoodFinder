import { useState, useEffect } from "react";
import RestaurantMap from "./RestaurantMap";
import VoiceInterface from "./VoiceInterface";
import { Link } from "react-router-dom";
import Footer from "./Footer";

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [viewMode, setViewMode] = useState("split"); // split, map, voice
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchedLocations, setSearchedLocations] = useState([]);
  
  // API keys - These should be environment variables
  // Replace these with environment variables in production
   const gmapsApiKey = "AIzaSyDHTUzAPE4mdiY6bKHtghFPEzmOJQUXI6I";
  const geminiApiKey = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g";
  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(userLocation);
          setIsLoadingLocation(false);
          
          // Store the user's default location in the searched locations
          setSearchedLocations([{
            name: "Your Location",
            location: userLocation
          }]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setResponse("I need location access to find nearby restaurants. Please enable location services.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  // Handle form submission in the main component
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    processQuery(query);
  };

  // Function to process queries - will be passed to VoiceInterface
  const processQuery = async (userQuery) => {
    setIsProcessing(true);
    
    // Store query in search history
    setSearchHistory(prev => [userQuery, ...prev.slice(0, 9)]);
    
    try {
      // Check if query mentions any restaurant by name
      const lowerQuery = userQuery.toLowerCase();
      let targetRestaurant = null;
      
      for (const restaurant of nearbyRestaurants) {
        if (lowerQuery.includes(restaurant.name.toLowerCase())) {
          targetRestaurant = restaurant;
          setSelectedRestaurant(restaurant);
          break;
        }
      }
      
      // Check for location-specific queries
      const locationPattern = /restaurants near (.*)|food near (.*)|places to eat (?:near|around|by) (.*)/i;
      const locationMatch = userQuery.match(locationPattern);
      
      if (locationMatch) {
        const locationName = locationMatch[1] || locationMatch[2] || locationMatch[3];
        if (locationName) {
          // This is handled in the VoiceInterface component
          return;
        }
      }
      
      // Create context for Gemini about nearby restaurants
      const restaurantContext = nearbyRestaurants.map(r => {
        return {
          name: r.name,
          cuisine: r.types ? r.types.join(', ') : "Various",
          rating: r.rating,
          address: r.vicinity,
          priceLevel: r.price_level,
          opening_hours: r.opening_hours
        };
      });
      
      const prompt = `
        You are a restaurant assistant helping someone find food nearby.
        
        Nearby restaurants: ${JSON.stringify(restaurantContext)}
        
        User query: "${userQuery}"
        
        ${targetRestaurant ? `The user is asking about ${targetRestaurant.name}.` : ''}
        
        Provide a helpful response about these restaurants. If they ask about cuisines or specific restaurants, provide accurate information.
        If they're looking for a type of cuisine not shown in the list, suggest the closest match or say you don't have that information.
        Keep your response conversational and under 100 words. Don't apologize for limitations.
        
        For location-specific queries like "restaurants near [specific place]", tell them you'll search for that location.
      `;
      
      // Use try-catch for API call to handle errors gracefully
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 200,
            }
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the API response is valid
        if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const aiResponse = data.candidates[0].content.parts[0].text;
          setResponse(aiResponse);
        } else {
          // Use fallback response logic
          const fallbackResponse = getFallbackResponse(userQuery);
          setResponse(fallbackResponse);
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        const fallbackResponse = getFallbackResponse(userQuery);
        setResponse(fallbackResponse);
      }
    } catch (error) {
      console.error("Error processing query:", error);
      setResponse("I'm having trouble processing your request. Please try again in a moment.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fallback response generator
  const getFallbackResponse = (userQuery) => {
    const lowerQuery = userQuery.toLowerCase();
    
    // Check for location-specific queries
    const locationPattern = /near (.*)|around (.*)|by (.*)/i;
    const locationMatch = lowerQuery.match(locationPattern);
    
    if (locationMatch && (lowerQuery.includes("restaurant") || lowerQuery.includes("food") || lowerQuery.includes("places to eat"))) {
      const locationName = locationMatch[1] || locationMatch[2] || locationMatch[3];
      return `I'll search for restaurants near ${locationName}. Please use the location search feature to get specific results.`;
    }
    
    // Restaurant recommendations
    if (lowerQuery.includes("restaurant") && (lowerQuery.includes("recommend") || lowerQuery.includes("suggestion"))) {
      if (nearbyRestaurants.length > 0) {
        return `Here are some nearby restaurants: ${nearbyRestaurants.slice(0, 3).map(r => r.name).join(", ")}. You can ask about their details and ratings.`;
      }
    }
    
    // Specific restaurant
    for (const restaurant of nearbyRestaurants) {
      if (lowerQuery.includes(restaurant.name.toLowerCase())) {
        return `${restaurant.name} has a rating of ${restaurant.rating || "N/A"}. ${
          restaurant.opening_hours?.open_now ? "It's currently open." : "It might be closed now."
        } It's located at ${restaurant.vicinity}.`;
      }
    }
    
    // Cuisine types
    const cuisineTypes = ["american", "italian", "japanese", "mexican", "indian", "chinese", "thai"];
    for (const cuisine of cuisineTypes) {
      if (lowerQuery.includes(cuisine)) {
        const matchingRestaurants = nearbyRestaurants.filter(r => 
          r.types && r.types.some(type => type.toLowerCase().includes(cuisine))
        );
        
        if (matchingRestaurants.length > 0) {
          return `For ${cuisine} food, you might want to try ${matchingRestaurants[0].name} at ${matchingRestaurants[0].vicinity}.`;
        }
      }
    }
    
    return "You can ask me about nearby restaurants, specific cuisines, or get recommendations. You can also search for restaurants near specific locations like 'VKS Public School' using the search box.";
  };

  // Function to search for a specific location and find restaurants nearby
  const searchLocationRestaurants = async (locationName, radius = 1000) => {
    try {
      // In a production environment, these API calls should be proxied through a backend
      // to avoid exposing API keys
      
      // First, geocode the location name to get coordinates
      const geocodeUrl = `/api/geocode?address=${encodeURIComponent(locationName)}`;
      
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding failed with status: ${geocodeResponse.status}`);
      }
      
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status !== "OK" || !geocodeData.results || geocodeData.results.length === 0) {
        setResponse(`I couldn't find "${locationName}". Please try a different location name.`);
        return false;
      }
      
      // Get coordinates
      const { lat, lng } = geocodeData.results[0].geometry.location;
      const formattedAddress = geocodeData.results[0].formatted_address;
      
      // Update the map location
      const newLocation = { latitude: lat, longitude: lng };
      setLocation(newLocation);
      
      // Store this location in the searched locations
      setSearchedLocations(prev => [
        { name: locationName, location: newLocation, address: formattedAddress },
        ...prev.filter(loc => loc.name !== locationName).slice(0, 4)
      ]);
      
      // Now search for restaurants near this location
      const nearbyUrl = `/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=restaurant`;
      
      const nearbyResponse = await fetch(nearbyUrl);
      
      if (!nearbyResponse.ok) {
        throw new Error(`Nearby search failed with status: ${nearbyResponse.status}`);
      }
      
      const nearbyData = await nearbyResponse.json();
      
      if (nearbyData.status !== "OK" || !nearbyData.results || nearbyData.results.length === 0) {
        setResponse(`I found ${formattedAddress}, but there don't seem to be any restaurants nearby within ${radius/1000}km.`);
        return false;
      }
      
      // Update the restaurants
      setNearbyRestaurants(nearbyData.results);
      
      // Create a response about the found restaurants
      const topOptions = nearbyData.results.slice(0, 5);
      const restaurantNames = topOptions.map(r => r.name).join(", ");
      
      setResponse(`I found ${nearbyData.results.length} restaurants near ${formattedAddress}. Some options include: ${restaurantNames}.`);
      
      return true;
    } catch (error) {
      console.error("Error searching for location:", error);
      setResponse("I had trouble searching for that location. Please try again.");
      return false;
    }
  };

  // If still loading location, show loading screen
  if (isLoadingLocation) {
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
      <header className="py-4 px-6 bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-indigo-900 ml-2"><Link to="/">FoodFinder</Link>  </h1>
          </div>
          
          {/* View mode toggle buttons */}
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode("split")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "split" 
                  ? "bg-white shadow-sm text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Split View
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "map" 
                  ? "bg-white shadow-sm text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Map View
            </button>
            <button 
              onClick={() => setViewMode("voice")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "voice" 
                  ? "bg-white shadow-sm text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Voice View
            </button>
          </div>
          
          <nav className="hidden lg:flex space-x-6">
            <a href="#" className="text-indigo-700 hover:text-indigo-900 transition-colors">Home</a>
            <a href="#" className="text-indigo-700 hover:text-indigo-900 transition-colors">Browse</a>
            <a href="#" className="text-indigo-700 hover:text-indigo-900 transition-colors">My Orders</a>
            <a href="#" className="text-indigo-700 hover:text-indigo-900 transition-colors">Account</a>
          </nav>
          <div className="md:hidden">
            <button className="text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Find Your Perfect Meal with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Voice AI</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simply ask what you're craving and let our AI assistant guide you to the best dining experiences nearby.
          </p>
        </div>

        {/* Mobile view selector (only shown on smaller screens) */}
        <div className="md:hidden mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button 
              onClick={() => setViewMode("split")}
              className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "split" 
                  ? "bg-white shadow-sm text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Both
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "map" 
                  ? "bg-white shadow-sm text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Map
            </button>
            <button 
              onClick={() => setViewMode("voice")}
              className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "voice" 
                  ? "bg-white shadow-sm text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Voice
            </button>
          </div>
        </div>

        {/* Conditional rendering based on view mode */}
        <div className={`grid gap-6 ${
          viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}>
          {/* Map Section */}
          {(viewMode === "split" || viewMode === "map") && (
            <div className={viewMode === "map" ? "col-span-full" : ""}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <h3 className="text-xl font-bold">Interactive Map</h3>
                  <p className="text-indigo-100 text-sm">Discover restaurants around you</p>
                </div>
                <div className={`${viewMode === "map" ? "h-[120vh]" : "h-[100vh]"}`}>
                  <RestaurantMap 
                    location={location}
                    mapLoaded={mapLoaded}
                    setMapLoaded={setMapLoaded}
                    nearbyRestaurants={nearbyRestaurants}
                    setNearbyRestaurants={setNearbyRestaurants}
                    setResponse={setResponse}
                    gmapsApiKey={gmapsApiKey}
                    selectedRestaurant={selectedRestaurant}
                    setSelectedRestaurant={setSelectedRestaurant}
                    fullWidth={viewMode === "map"}
                  />
                </div>
              </div>
              
              {/* Restaurant Info Card - Displayed when a restaurant is selected */}
              {selectedRestaurant && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900 mb-2">{selectedRestaurant.name}</h3>
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(Math.floor(selectedRestaurant.rating || 0))].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {[...Array(5 - Math.floor(selectedRestaurant.rating || 0))].map((_, i) => (
                            <span key={i} className="text-gray-300">★</span>
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">{selectedRestaurant.rating} ({selectedRestaurant.user_ratings_total || 0} reviews)</span>
                      </div>
                    </div>
                    
                    {selectedRestaurant.opening_hours && (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        selectedRestaurant.opening_hours.open_now 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedRestaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                      </span>
                    )}
                  </div>

                  
                  
                  <p className="text-gray-700 mb-4">{selectedRestaurant.vicinity}</p>
                  
                  {selectedRestaurant.types && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedRestaurant.types.slice(0, 3).map((type, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs capitalize">
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  
                  <div className="flex space-x-3 mt-4">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedRestaurant.vicinity)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      Get Directions
                    </a>
                    <button 
                      onClick={() => {
                        const newQuery = `Tell me about ${selectedRestaurant.name}`;
                        setQuery(newQuery);
                        processQuery(newQuery);
                      }}
                      className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      More Details
                    </button>
                  </div>
                </div>
              )}
                        {/* Restaurant suggestions section */}
                        {nearbyRestaurants.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Suggested Restaurants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                    {nearbyRestaurants.map((restaurant, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl transition-all cursor-pointer hover:shadow-md ${
                          selectedRestaurant && selectedRestaurant.place_id === restaurant.place_id
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'bg-gray-50'
                        }`}
                        onClick={() => setSelectedRestaurant(restaurant)}
                      >
                        <h4 className="font-bold text-indigo-800">{restaurant.name}</h4>
                        <div className="flex items-center my-1">
                          <div className="flex text-yellow-400 text-sm mr-2">
                            {[...Array(Math.floor(restaurant.rating || 0))].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                          <span className="text-gray-600 text-xs">{restaurant.rating}</span>
                        </div>
                        <p className="text-gray-700 text-sm truncate">{restaurant.vicinity}</p>
                        {restaurant.price_level && (
                          <p className="text-gray-600 text-sm mt-1">
                            {"$".repeat(restaurant.price_level)}
                          </p>
                        )}
                        {restaurant.opening_hours && (
                          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                            restaurant.opening_hours.open_now 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {restaurant.opening_hours.open_now ? 'Open' : 'Closed'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          )}
          
          
          {/* Voice Interface Section */}
          {(viewMode === "split" || viewMode === "voice") && (
            <div className={viewMode === "voice" ? "col-span-full" : ""}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <h3 className="text-xl font-bold">Voice Assistant</h3>
                  <p className="text-indigo-100 text-sm">Ask for what you're craving</p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className={`bg-gray-100 rounded-2xl p-6 transition-all ${response ? 'opacity-100' : 'opacity-70'}`}>
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-gray-800 prose">
                            {response || "Hello! I'm your food assistant. What are you in the mood for today?"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  

                  {/* User query display */}
                  {query && (
                    <div className="mb-6">
                      <div className="bg-indigo-100 rounded-2xl p-6 ml-12">
                        <div className="text-indigo-800">{query}</div>
                      </div>
                    </div>
                  )}

                  {/* Voice Interface Component */}
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
                    processQuery={processQuery} // Pass the query processor
                    searchLocationRestaurants={searchLocationRestaurants} // Pass the location search function
                  />

                  {/* Example queries */}
                  <div className="mt-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Try asking:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Italian restaurants nearby", "Places with outdoor seating", "Best sushi in the area", "Cheap eats open now"].map((suggestion, index) => (
                        <button 
                          key={index}
                          className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
                          onClick={() => {
                            setQuery(suggestion);
                            processQuery(suggestion);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

    
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
     <Footer/>
    </div>
  );
}

export default VoiceRestaurantAssistant5;
