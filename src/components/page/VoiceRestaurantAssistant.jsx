import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import RestaurantMap from "./RestaurantMap";
import VoiceInterface from "./VoiceInterface";
import Footer from "./Footer";
import { ThemeContext } from "./Themecontext";
import { useAuth } from "../auth/Authcontext";
import Navheader from "./header";
import LoadingScreen from "./LoadingScreen";
// Make sure the import path and casing are correct

const VoiceRestaurantAssistant5 = () => {
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

  // Use the ThemeContext correctly
  const { theme, toggleTheme } = useContext(ThemeContext);

  const gmapsApiKey = "AIzaSyDHTUzAPE4mdiY6bKHtghFPEzmOJQUXI6I";
  const geminiApiKey = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g";
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(userLocation);
          setIsLoadingLocation(false);
          setSearchedLocations([
            { name: "Your Location", location: userLocation },
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setResponse(
            "I need location access to find nearby restaurants. Please enable location services."
          );
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    processQuery(query);
  };

  const processQuery = async (userQuery) => {
    setIsProcessing(true);
    setSearchHistory((prev) => [userQuery, ...prev.slice(0, 9)]);

    try {
      const lowerQuery = userQuery.toLowerCase();
      let targetRestaurant = null;

      for (const restaurant of nearbyRestaurants) {
        if (lowerQuery.includes(restaurant.name.toLowerCase())) {
          targetRestaurant = restaurant;
          setSelectedRestaurant(restaurant);
          break;
        }
      }

      const locationPattern =
        /restaurants near (.*)|food near (.*)|places to eat (?:near|around|by) (.*)/i;
      const locationMatch = userQuery.match(locationPattern);

      if (locationMatch) {
        const locationName =
          locationMatch[1] || locationMatch[2] || locationMatch[3];
        if (locationName) {
          return;
        }
      }

      const restaurantContext = nearbyRestaurants.map((r) => ({
        name: r.name,
        cuisine: r.types ? r.types.join(", ") : "Various",
        rating: r.rating,
        address: r.vicinity,
        priceLevel: r.price_level,
        opening_hours: r.opening_hours,
      }));

      const prompt = `
        You are a restaurant assistant helping someone find food nearby.
        Nearby restaurants: ${JSON.stringify(restaurantContext)}
        User query: "${userQuery}"
        ${
          targetRestaurant
            ? `The user is asking about ${targetRestaurant.name}.`
            : ""
        }
        Provide a helpful response about these restaurants. If they ask about cuisines or specific restaurants, provide accurate information.
        If they're looking for a type of cuisine not shown in the list, suggest the closest match or say you don't have that information.
        Keep your response conversational and under 100 words. Don't apologize for limitations.
        For location-specific queries like "restaurants near [specific place]", tell them you'll search for that location.
      `;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (
          data &&
          data.candidates &&
          data.candidates[0]?.content?.parts?.[0]?.text
        ) {
          const aiResponse = data.candidates[0].content.parts[0].text;
          setResponse(aiResponse);
        } else {
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
      setResponse(
        "I'm having trouble processing your request. Please try again in a moment."
      );
    } finally {
      setIsProcessing(false);
    }
  };
  const getFallbackResponse = (userQuery) => {
    const lowerQuery = userQuery.toLowerCase();
    const locationPattern = /near (.*)|around (.*)|by (.*)/i;
    const locationMatch = lowerQuery.match(locationPattern);

    if (
      locationMatch &&
      (lowerQuery.includes("restaurant") ||
        lowerQuery.includes("food") ||
        lowerQuery.includes("places to eat"))
    ) {
      const locationName =
        locationMatch[1] || locationMatch[2] || locationMatch[3];
      return `I'll search for restaurants near ${locationName}. Please use the location search feature to get specific results.`;
    }

    if (
      lowerQuery.includes("restaurant") &&
      (lowerQuery.includes("recommend") || lowerQuery.includes("suggestion"))
    ) {
      if (nearbyRestaurants.length > 0) {
        return `Here are some nearby restaurants: ${nearbyRestaurants
          .slice(0, 3)
          .map((r) => r.name)
          .join(", ")}. You can ask about their details and ratings.`;
      }
    }

    for (const restaurant of nearbyRestaurants) {
      if (lowerQuery.includes(restaurant.name.toLowerCase())) {
        return `${restaurant.name} has a rating of ${
          restaurant.rating || "N/A"
        }. ${
          restaurant.opening_hours?.open_now
            ? "It's currently open."
            : "It might be closed now."
        } It's located at ${restaurant.vicinity}.`;
      }
    }

    const cuisineTypes = [
      "american",
      "italian",
      "japanese",
      "mexican",
      "indian",
      "chinese",
      "thai",
    ];
    for (const cuisine of cuisineTypes) {
      if (lowerQuery.includes(cuisine)) {
        const matchingRestaurants = nearbyRestaurants.filter(
          (r) =>
            r.types &&
            r.types.some((type) => type.toLowerCase().includes(cuisine))
        );

        if (matchingRestaurants.length > 0) {
          return `For ${cuisine} food, you might want to try ${matchingRestaurants[0].name} at ${matchingRestaurants[0].vicinity}.`;
        }
      }
    }

    return "You can ask me about nearby restaurants, specific cuisines, or get recommendations. You can also search for restaurants near specific locations like 'VKS Public School' using the search box.";
  };

  const searchLocationRestaurants = async (locationName, radius = 1000) => {
    try {
      const geocodeUrl = `/api/geocode?address=${encodeURIComponent(
        locationName
      )}`;
      const geocodeResponse = await fetch(geocodeUrl);

      if (!geocodeResponse.ok) {
        throw new Error(
          `Geocoding failed with status: ${geocodeResponse.status}`
        );
      }

      const geocodeData = await geocodeResponse.json();

      if (
        geocodeData.status !== "OK" ||
        !geocodeData.results ||
        geocodeData.results.length === 0
      ) {
        setResponse(
          `I couldn't find "${locationName}". Please try a different location name.`
        );
        return false;
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;
      const formattedAddress = geocodeData.results[0].formatted_address;
      const newLocation = { latitude: lat, longitude: lng };
      setLocation(newLocation);

      setSearchedLocations((prev) => [
        {
          name: locationName,
          location: newLocation,
          address: formattedAddress,
        },
        ...prev.filter((loc) => loc.name !== locationName).slice(0, 4),
      ]);

      const nearbyUrl = `/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=restaurant`;
      const nearbyResponse = await fetch(nearbyUrl);

      if (!nearbyResponse.ok) {
        throw new Error(
          `Nearby search failed with status: ${nearbyResponse.status}`
        );
      }

      const nearbyData = await nearbyResponse.json();

      if (
        nearbyData.status !== "OK" ||
        !nearbyData.results ||
        nearbyData.results.length === 0
      ) {
        setResponse(
          `I found ${formattedAddress}, but there don't seem to be any restaurants nearby within ${
            radius / 1000
          }km.`
        );
        return false;
      }

      setNearbyRestaurants(nearbyData.results);

      const topOptions = nearbyData.results.slice(0, 5);
      const restaurantNames = topOptions.map((r) => r.name).join(", ");
      setResponse(
        `I found ${nearbyData.results.length} restaurants near ${formattedAddress}. Some options include: ${restaurantNames}.`
      );

      return true;
    } catch (error) {
      console.error("Error searching for location:", error);
      setResponse(
        "I had trouble searching for that location. Please try again."
      );
      return false;
    }
  };
  if (isLoadingLocation) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-indigo-50 to-white"
      } transition-colors duration-300`}
    >
      <Navheader viewMode={viewMode} setViewMode={setViewMode} />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              theme === "dark" ? "text-indigo-200" : "text-indigo-900"
            } mb-4`}
          >
            Find Your Perfect Meal with{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                theme === "dark"
                  ? "from-indigo-400 to-purple-400"
                  : "from-indigo-600 to-purple-600"
              }`}
            >
              Voice AI
            </span>
          </h2>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Simply ask what you're craving and let our AI assistant guide you to
            the best dining experiences nearby.
          </p>
        </div>

        <div className="md:hidden mb-6">
          <div
            className={`${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            } rounded-lg p-1 flex`}
          >
            <button
              onClick={() => setViewMode("split")}
              className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "split"
                  ? `${
                      theme === "dark"
                        ? "bg-gray-600 text-indigo-300"
                        : "bg-white text-indigo-700"
                    } shadow-sm`
                  : `${
                      theme === "dark"
                        ? "text-gray-300 hover:text-indigo-300"
                        : "text-gray-600 hover:text-indigo-600"
                    }`
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "map"
                  ? `${
                      theme === "dark"
                        ? "bg-gray-600 text-indigo-300"
                        : "bg-white text-indigo-700"
                    } shadow-sm`
                  : `${
                      theme === "dark"
                        ? "text-gray-300 hover:text-indigo-300"
                        : "text-gray-600 hover:text-indigo-600"
                    }`
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode("voice")}
              className={`flex-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "voice"
                  ? `${
                      theme === "dark"
                        ? "bg-gray-600 text-indigo-300"
                        : "bg-white text-indigo-700"
                    } shadow-sm`
                  : `${
                      theme === "dark"
                        ? "text-gray-300 hover:text-indigo-300"
                        : "text-gray-600 hover:text-indigo-600"
                    }`
              }`}
            >
              Voice
            </button>
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {(viewMode === "split" || viewMode === "map") && (
            <div className={viewMode === "map" ? "col-span-full" : ""}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div
                  className={`p-4 bg-gradient-to-r from-indigo-600 to-purple-600 ${
                    theme === "dark" ? "text-gray-300" : "text-white"
                  }`}
                >
                  <h3 className="text-xl font-bold">Interactive Map</h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-indigo-100" : "text-indigo-200"
                    }`}
                  >
                    Discover restaurants around you
                  </p>
                </div>
                <div
                  className={`${
                    viewMode === "map" ? "h-[120vh]" : "h-[100vh]"
                  }`}
                >
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

              {selectedRestaurant && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          theme === "dark"
                            ? "text-indigo-300"
                            : "text-indigo-900"
                        } mb-2`}
                      >
                        {selectedRestaurant.name}
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 mr-2">
                          {[
                            ...Array(
                              Math.floor(selectedRestaurant.rating || 0)
                            ),
                          ].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {[
                            ...Array(
                              5 - Math.floor(selectedRestaurant.rating || 0)
                            ),
                          ].map((_, i) => (
                            <span key={i} className="text-gray-300">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {selectedRestaurant.rating} (
                          {selectedRestaurant.user_ratings_total || 0} reviews)
                        </span>
                      </div>
                    </div>

                    {selectedRestaurant.opening_hours && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedRestaurant.opening_hours.open_now
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedRestaurant.opening_hours.open_now
                          ? "Open Now"
                          : "Closed"}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">
                    {selectedRestaurant.vicinity}
                  </p>

                  {selectedRestaurant.types && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedRestaurant.types.slice(0, 3).map((type, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs capitalize"
                        >
                          {type.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-3 mt-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        selectedRestaurant.vicinity
                      )}`}
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

              {nearbyRestaurants.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">
                    Suggested Restaurants
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                    {nearbyRestaurants.map((restaurant, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl transition-all cursor-pointer hover:shadow-md ${
                          selectedRestaurant &&
                          selectedRestaurant.place_id === restaurant.place_id
                            ? "bg-indigo-50 border border-indigo-200"
                            : "bg-gray-50"
                        }`}
                        onClick={() => setSelectedRestaurant(restaurant)}
                      >
                        <h4 className="font-bold text-indigo-800">
                          {restaurant.name}
                        </h4>
                        <div className="flex items-center my-1">
                          <div className="flex text-yellow-400 text-sm mr-2">
                            {[...Array(Math.floor(restaurant.rating || 0))].map(
                              (_, i) => (
                                <span key={i}>★</span>
                              )
                            )}
                          </div>
                          <span className="text-gray-600 text-xs">
                            {restaurant.rating}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm truncate">
                          {restaurant.vicinity}
                        </p>
                        {restaurant.price_level && (
                          <p className="text-gray-600 text-sm mt-1">
                            {"$".repeat(restaurant.price_level)}
                          </p>
                        )}
                        {restaurant.opening_hours && (
                          <span
                            className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                              restaurant.opening_hours.open_now
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {restaurant.opening_hours.open_now
                              ? "Open"
                              : "Closed"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {(viewMode === "split" || viewMode === "voice") && (
            <div className={viewMode === "voice" ? "col-span-full" : ""}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div
                  className={`p-4 bg-gradient-to-r from-indigo-600 to-purple-600 ${
                    theme === "dark" ? "text-gray-300" : "text-white"
                  }`}
                >
                  <h3 className="text-xl font-bold">Voice Assistant</h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-indigo-100" : "text-indigo-200"
                    }`}
                  >
                    Ask for what you're craving
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div
                      className={`bg-gray-100 rounded-2xl p-6 transition-all ${
                        response ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-gray-800 prose">
                            {response ||
                              "Hello! I'm your food assistant. What are you in the mood for today?"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {query && (
                    <div className="mb-6">
                      <div className="bg-indigo-100 rounded-2xl p-6 ml-12">
                        <div className="text-indigo-800">{query}</div>
                      </div>
                    </div>
                  )}

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
                    processQuery={processQuery}
                    searchLocationRestaurants={searchLocationRestaurants}
                  />

                  <div className="mt-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Try asking:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Italian restaurants nearby",
                        "Places with outdoor seating",
                        "Best sushi in the area",
                        "Cheap eats open now",
                      ].map((suggestion, index) => (
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
      <Footer />
    </div>
  );
};

export default VoiceRestaurantAssistant5;
