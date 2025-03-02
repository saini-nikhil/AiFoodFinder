import React from "react";

const SuggestedRestaurants = ({ nearbyRestaurants, selectedRestaurant, setSelectedRestaurant }) => {
    if (nearbyRestaurants.length === 0) return null;

    return (
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">
                Suggested Restaurants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                {nearbyRestaurants.map((restaurant, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-xl transition-all cursor-pointer hover:shadow-md ${
                            selectedRestaurant && selectedRestaurant.place_id === restaurant.place_id
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
                                {[...Array(Math.floor(restaurant.rating || 0))].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
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
    );
};

export default SuggestedRestaurants;