import React from "react";
import VoiceInterface from "./VoiceInterface";


const VoiceSection = ({
    viewMode,
    setViewMode,
    query,
    setQuery,
    response,
    setResponse,
    isProcessing,
    setIsProcessing,
    isListening,
    setIsListening,
    nearbyRestaurants,
    location,
    geminiApiKey,
    selectedRestaurant,
    setSelectedRestaurant,
    processQuery,
    searchLocationRestaurants,
    theme,
}) => {
    return (
        <div className={viewMode === "voice" ? "col-span-full" : ""}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white`}>
                    <h3 className="text-xl font-bold">Voice Assistant</h3>
                    <p className={`text-sm text-indigo-200`}>Ask for what you're craving</p>
                </div>
                <div className="p-6">
                    
                    <div className="mb-6">
                        <div className={`bg-gray-100 rounded-2xl p-6 transition-all ${response ? "opacity-100" : "opacity-70"}`}>
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
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Try asking:</h4>
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
    );
};

export default VoiceSection;