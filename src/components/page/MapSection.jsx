import React from "react";
import RestaurantMap from "./RestaurantMap";
import SuggestedRestaurants from "./SuggestedRestaurants";
import RestaurantDetails from "./RestaurantDetails";


const MapSection = ({
    viewMode, 
    setViewMode, 
    location, 
    mapLoaded, 
    setMapLoaded, 
    nearbyRestaurants, 
    setNearbyRestaurants, 
    setResponse, 
    gmapsApiKey, 
    selectedRestaurant, 
    setSelectedRestaurant, 
    fullWidth,
    theme 
    ,setQuery,
    query,processQuery
}) => {
  return (
    <div className={viewMode === "map" ? "col-span-full" : ""}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div
          className={`p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white`}
        >
          <h3 className="text-xl font-bold">Interactive Map</h3>
          <p className={`text-sm text-indigo-200`}>
            Discover restaurants around you
          </p>
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
            fullWidth={(viewMode = "map")}
          />
        </div>
        {/* SuggestedRestaurants and RestaurantDetails moved outside the grid */}
        {viewMode === "map" && selectedRestaurant && (
          <RestaurantDetails
            selectedRestaurant={selectedRestaurant}
            theme={theme}
            setQuery={setQuery}
            processQuery={processQuery}
          />
        )}
        {viewMode === "map" && nearbyRestaurants.length > 0 && (
          <SuggestedRestaurants
            nearbyRestaurants={nearbyRestaurants}
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        )}

   
      </div>
    </div>
  );
};

export default MapSection;
