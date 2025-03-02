import React from "react";

const RestaurantDetails = ({ selectedRestaurant, theme, setQuery, processQuery }) => {

    
    if (!selectedRestaurant) return null;

    return (
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            {/* Restaurant Detail Logic (same as before) */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-xl font-bold ${theme === "dark" ? "text-indigo-300" : "text-indigo-900"} mb-2`}>
                        {selectedRestaurant.name}
                    </h3>
                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 mr-2">
                            {[...Array(Math.floor(selectedRestaurant.rating || 0))].map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                            {[...Array(5 - Math.floor(selectedRestaurant.rating || 0))].map((_, i) => (
                                <span key={i} className="text-gray-300">
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                            {selectedRestaurant.rating} ({selectedRestaurant.user_ratings_total || 0} reviews)
                        </span>
                    </div>
                </div>

                {selectedRestaurant.opening_hours && (
                    <span className={`px-3 py-1 rounded-full text-sm ${selectedRestaurant.opening_hours.open_now ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {selectedRestaurant.opening_hours.open_now ? "Open Now" : "Closed"}
                    </span>
                )}
            </div>

            <p className="text-gray-700 mb-4">{selectedRestaurant.vicinity}</p>

            {selectedRestaurant.types && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedRestaurant.types.slice(0, 3).map((type, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs capitalize">
                            {type.replace(/_/g, " ")}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex space-x-3 mt-4">
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=$${encodeURIComponent(selectedRestaurant.vicinity)}`}
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
    );
};

export default RestaurantDetails;