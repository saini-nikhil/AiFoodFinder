import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../ThemeContext/Themecontext";
import { useAuth } from "../auth/Authcontext";
import Navheader from "./header";
import LoadingScreen from "./LoadingScreen";
import MapSection from "./MapSection";
import VoiceSection from "./VoiceSection";
import RestaurantDetails from "./RestaurantDetails";
import SuggestedRestaurants from "./SuggestedRestaurants";
import Footer from "./Footer";
import getFallbackResponse from "./utils/responseUtils";
import { searchLocationRestaurants } from "./utils/locationUtils";

const VoiceRestaurantAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [viewMode, setViewMode] = useState("split");
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchedLocations, setSearchedLocations] = useState([]);

  const { theme } = useContext(ThemeContext);
  const gmapsApiKey = import.meta.env.VITE_MAP_API
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;


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
          const searched = await searchLocationRestaurants(
            locationName,
            1000,
            setResponse,
            setLocation,
            setSearchedLocations,
            setNearbyRestaurants
          );
          if (searched) {
            setIsProcessing(false);
          }
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
                Nearby restaurants: <span class="math-inline">\{JSON\.stringify\(restaurantContext\)\}
User query\: "</span>{userQuery}"
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
          const fallbackResponse = getFallbackResponse(
            userQuery,
            nearbyRestaurants
          );
          setResponse(fallbackResponse);
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        const fallbackResponse = getFallbackResponse(
          userQuery,
          nearbyRestaurants
        );
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

        <responsivebtn viewMode={viewMode} setViewMode={setViewMode} theme = {theme}/>
     

        <div
                    className={`grid gap-6 ${
                        viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                    }`}
                >
                    {(viewMode === "split" || viewMode === "map") && (
                        <MapSection
                            location={location}
                            mapLoaded={mapLoaded}
                            setMapLoaded={setMapLoaded}
                            nearbyRestaurants={nearbyRestaurants}
                            setNearbyRestaurants={setNearbyRestaurants}
                            setResponse={setResponse}
                            gmapsApiKey={gmapsApiKey}
                            selectedRestaurant={selectedRestaurant}
                            setSelectedRestaurant={setSelectedRestaurant}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            theme={theme}
                            query = {query}
                            setQuery = {setQuery}
                            processQuery = {processQuery}
                        />
                    )}

                    {(viewMode === "split" || viewMode === "voice") && (
                        <VoiceSection
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
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            theme={theme}
                        />
                    )}
                </div>

           
            </div>
            <Footer />
        </div>
    );
};

export default VoiceRestaurantAssistant;
