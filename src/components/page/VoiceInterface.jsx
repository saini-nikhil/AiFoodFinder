// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";

// function VoiceInterface({
//   query,
//   setQuery,
//   response,
//   setResponse,
//   isProcessing,
//   setIsProcessing,
//   isListening,
//   setIsListening,
//   nearbyRestaurants,
//   location,
//   geminiApiKey,
//   selectedRestaurant,
//   setSelectedRestaurant,
//   processQuery,
//   searchLocationRestaurants
// }) {
//   const recognitionRef = useRef(null);
//   const synthesisRef = useRef(window.speechSynthesis);

//   // Initialize speech recognition
//   useEffect(() => {
//     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
      
//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setQuery(transcript);
//         handleVoiceQuery(transcript);
//       };
      
//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error", event.error);
//         setIsListening(false);
//       };
      
//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };
//     }
    
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.abort();
//       }
//       if (synthesisRef.current) {
//         synthesisRef.current.cancel();
//       }
//     };
//   }, [setQuery, setIsListening]);

//   const toggleListening = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//     } else {
//       setResponse("");
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const speakText = (text) => {
//     if (synthesisRef.current) {
//       synthesisRef.current.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       synthesisRef.current.speak(utterance);
//     }
//   };

//   const handleVoiceQuery = async (voiceQuery) => {
//     setIsProcessing(true);
    
//     try {
//       // Process the voice query using Gemini API
//       const processedQuery = await processWithGemini(voiceQuery);
//       speakText(processedQuery);
//       setResponse(processedQuery);
//     } catch (error) {
//       console.error("Error processing voice query:", error);
//       const errorMessage = "Sorry, I couldn't process your request. Please try again.";
//       setResponse(errorMessage);
//       speakText(errorMessage);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleTextSubmit = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     handleVoiceQuery(query);
//   };

//   const processWithGemini = async (userQuery) => {
//     try {
//       // Check if it's a command about a specific restaurant
//       const lowerQuery = userQuery.toLowerCase();
//       let targetRestaurant = null;
      
//       // Check if query mentions any restaurant by name
//       for (const restaurant of nearbyRestaurants) {
//         if (lowerQuery.includes(restaurant.name.toLowerCase())) {
//           targetRestaurant = restaurant;
//           setSelectedRestaurant(restaurant);
//           break;
//         }
//       }
      
//       // Create context information about nearby restaurants for Gemini
//       const restaurantContext = nearbyRestaurants.map(r => {
//         return {
//           name: r.name,
//           cuisine: r.cuisine || "Various",
//           rating: r.rating,
//           address: r.vicinity,
//           priceLevel: r.priceLevel
//         };
//       });
      
//       const prompt = `
//         You are a restaurant assistant helping someone find food nearby.
        
//         Nearby restaurants: ${JSON.stringify(restaurantContext)}
        
//         User query: "${userQuery}"
        
//         ${targetRestaurant ? `The user is asking about ${targetRestaurant.name}.` : ''}
        
//         Provide a helpful response about these restaurants. If they ask about cuisines, or specific restaurants, provide that information.
//         If they're looking for a type of cuisine not shown in the list, suggest the closest match.
//         Keep your response conversational and under 100 words. Don't apologize for limitations.
//       `;
      
//       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: {
//             temperature: 0.2,
//             maxOutputTokens: 200,
//           }
//         }),
//       });
      
//       const data = await response.json();
//       const aiResponse = data.candidates[0].content.parts[0].text;
      
//       // If the API response fails or is empty, use fallback logic
//       if (!aiResponse) {
//         return handleFallbackResponse(userQuery);
//       }
      
//       return aiResponse;
//     } catch (error) {
//       console.error("Error with Gemini API:", error);
//       return handleFallbackResponse(userQuery);
//     }
//   };
  
//   const handleFallbackResponse = (userQuery) => {
//     // Use simpler keyword matching as a fallback
//     const lowerQuery = userQuery.toLowerCase();
    
//     // Check if query is about restaurant recommendations
//     if (lowerQuery.includes("restaurant") && (lowerQuery.includes("recommend") || lowerQuery.includes("suggestion"))) {
//       return `Here are some nearby restaurants: ${nearbyRestaurants.slice(0, 3).map(r => r.name).join(", ")}. You can ask about their cuisines and ratings.`;
//     }
    
//     // Check if query is about specific restaurant
//     for (const restaurant of nearbyRestaurants) {
//       if (lowerQuery.includes(restaurant.name.toLowerCase())) {
//         return `${restaurant.name} has a rating of ${restaurant.rating}. They serve ${restaurant.cuisine || "various cuisine"} and are located at ${restaurant.vicinity}.`;
//       }
//     }
    
//     // Check if query is about specific cuisine
//     const cuisineTypes = ["american", "italian", "japanese", "mexican", "indian", "chinese", "thai"];
//     for (const cuisine of cuisineTypes) {
//       if (lowerQuery.includes(cuisine)) {
//         const matchingRestaurants = nearbyRestaurants.filter(r => 
//           r.cuisine && r.cuisine.toLowerCase().includes(cuisine)
//         );
        
//         if (matchingRestaurants.length > 0) {
//           return `For ${cuisine} food, try ${matchingRestaurants[0].name} at ${matchingRestaurants[0].vicinity}.`;
//         }
//       }
//     }
    
//     // Default response
//     return "You can ask me about nearby restaurants, specific cuisines, or recommended dishes. What would you like to know?";
//   };

//   return (
//     <div className="flex-1 p-4 flex flex-col">
//       <div className="bg-white rounded-lg shadow-lg p-4 flex-1 flex flex-col overflow-hidden">
//         <h2 className="text-2xl font-bold mb-4 text-center text-indigo-800">Restaurant Voice Assistant</h2>
        
//         {/* Voice button */}
//         <div className="flex justify-center mb-4">
//           <button
//             onClick={toggleListening}
//             className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
//               isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'
//             } text-white`}
//             aria-label={isListening ? "Stop listening" : "Start listening"}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//               />
//             </svg>
//           </button>
//         </div>
        
//         {/* Status indicator */}
//         <div className="text-center mb-4">
//           {isListening ? (
//             <p className="text-red-500 font-medium">Listening...</p>
//           ) : isProcessing ? (
//             <p className="text-indigo-500 font-medium">Processing...</p>
//           ) : (
//             <p className="text-gray-500">Tap microphone to speak</p>
//           )}
//         </div>

//         {/* Text input as fallback */}
//         <form onSubmit={handleTextSubmit} className="mb-4">
//           <div className="flex items-center">
//             <input
//               type="text"
//               className="flex-1 border border-indigo-300 rounded-l-lg p-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Type your question here..."
//             />
//             <button
//               type="submit"
//               className={`px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors ${
//                 isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               disabled={isProcessing}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </form>

//         {/* Speech examples */}
//         <div className="mb-4">
//           <h3 className="font-medium text-gray-700 mb-2">Try saying:</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"What restaurants are nearby?"</div>
//             <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"Find Italian restaurants"</div>
//             <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"Top items at [Restaurant Name]"</div>
//             <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"Show me closest restaurants"</div>
//           </div>
//         </div>

//         {/* Response area */}
//         <div className="border border-gray-200 rounded-lg p-4 overflow-y-auto flex-1 bg-indigo-50 mb-4 shadow-inner">
//           {response ? (
//             <div className="prose max-w-none">
//               <ReactMarkdown>{response}</ReactMarkdown>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center italic">Ask me about nearby restaurants!</p>
//           )}
//         </div>
        
//         {/* Nearby restaurants list */}
//         <div className="overflow-y-auto max-h-48">
//           {nearbyRestaurants.length > 0 ? (
//             <div>
//               <h3 className="font-bold text-indigo-800 mb-2">Nearby Restaurants:</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {nearbyRestaurants.map(restaurant => (
//                   <div 
//                     key={restaurant.id} 
//                     className="p-3 border rounded-lg hover:shadow-md transition-shadow bg-white cursor-pointer"
//                     onClick={() => {
//                       setQuery(`Tell me about ${restaurant.name}`);
//                       handleVoiceQuery(`Tell me about ${restaurant.name}`);
//                     }}
//                   >
//                     <p className="font-medium text-indigo-700">{restaurant.name}</p>
//                     <div className="flex items-center text-sm">
//                       <span className="text-yellow-500 mr-1">★</span>
//                       <span className="text-gray-700">{restaurant.rating}</span>
//                       <span className="mx-2">•</span>
//                       <span className="text-gray-700 truncate">{restaurant.vicinity}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500 text-center">Loading nearby restaurants...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VoiceInterface;


import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Mic, MicOff, Send, MapPin, AlertTriangle } from 'lucide-react';

function VoiceInterface({
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
    setLocation,
    setSearchedLocations,
    setNearbyRestaurants: setNearbyRestaurantsFromVoice
}) {
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                handleVoiceQuery(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (synthesisRef.current) {
                synthesisRef.current.cancel();
            }
        };
    }, [setQuery, setIsListening]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setResponse("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakText = (text) => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            synthesisRef.current.speak(utterance);
        }
    };

    const handleVoiceQuery = async (voiceQuery) => {
        setIsProcessing(true);

        try {
            const locationPattern = /restaurants near (.*)|food near (.*)|places to eat (?:near|around|by) (.*)/i;
            const locationMatch = voiceQuery.match(locationPattern);

            if (locationMatch) {
                const locationName = locationMatch[1] || locationMatch[2] || locationMatch[3];
                if (locationName) {
                    setResponse(`Searching for restaurants near ${locationName}...`);
                    speakText(`Searching for restaurants near ${locationName}...`);

                    const searched = await searchLocationRestaurants(
                        locationName,
                        1000,
                        setResponse,
                        setLocation,
                        setSearchedLocations,
                        setNearbyRestaurantsFromVoice
                    );

                    if (searched) {
                        setIsProcessing(false);
                        return;
                    } else {
                        setIsProcessing(false);
                        return;
                    }
                }
            }

            const processedQuery = await processWithGemini(voiceQuery);
            speakText(processedQuery);
            setResponse(processedQuery);
        } catch (error) {
            console.error("Error processing voice query:", error);
            const errorMessage = "Sorry, I couldn't process your request. Please try again.";
            setResponse(errorMessage);
            speakText(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        handleVoiceQuery(query);
    };

    const processWithGemini = async (userQuery) => {
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

            const restaurantContext = nearbyRestaurants.map(r => {
                return {
                    name: r.name,
                    cuisine: r.cuisine || "Various",
                    rating: r.rating,
                    address: r.vicinity,
                    priceLevel: r.priceLevel
                };
            });

            const prompt = `
            You are a restaurant assistant helping someone find food nearby.
            Nearby restaurants: ${JSON.stringify(restaurantContext)}
            User query: "${userQuery}"
            ${targetRestaurant ? `The user is asking about ${targetRestaurant.name}.` : ''}
            Provide a helpful response about these restaurants. If they ask about cuisines, or specific restaurants, provide that information.
            If they're looking for a type of cuisine not shown in the list, suggest the closest match.
            Keep your response conversational and under 100 words. Don't apologize for limitations.
        `;

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

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            if (!aiResponse) {
                return handleFallbackResponse(userQuery);
            }

            return aiResponse;
        } catch (error) {
            console.error("Error with Gemini API:", error);
            return handleFallbackResponse(userQuery);
        }
    };

    const handleFallbackResponse = (userQuery) => {
        const lowerQuery = userQuery.toLowerCase();

        if (lowerQuery.includes("restaurant") && (lowerQuery.includes("recommend") || lowerQuery.includes("suggestion"))) {
            return `Here are some nearby restaurants: ${nearbyRestaurants.slice(0, 3).map(r => r.name).join(", ")}. You can ask about their cuisines and ratings.`;
        }

        for (const restaurant of nearbyRestaurants) {
            if (lowerQuery.includes(restaurant.name.toLowerCase())) {
                return `${restaurant.name} has a rating of ${restaurant.rating}. They serve ${restaurant.cuisine || "various cuisine"} and are located at ${restaurant.vicinity}.`;
            }
        }

        const cuisineTypes = ["american", "italian", "japanese", "mexican", "indian", "chinese", "thai"];
        for (const cuisine of cuisineTypes) {
            if (lowerQuery.includes(cuisine)) {
                const matchingRestaurants = nearbyRestaurants.filter(r =>
                    r.cuisine && r.cuisine.toLowerCase().includes(cuisine)
                );

                if (matchingRestaurants.length > 0) {
                    return `For ${cuisine} food, try ${matchingRestaurants[0].name} at ${matchingRestaurants[0].vicinity}.`;
                }
            }
        }

        return "You can ask me about nearby restaurants, specific cuisines, or recommended dishes. What would you like to know?";
    };

    return (
        <div className="flex-1 p-4 flex flex-col">
            <div className="bg-white rounded-lg shadow-lg p-4 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-2xl font-bold mb-4 text-center text-indigo-800">Restaurant Voice Assistant</h2>

                <div className="flex justify-center mb-4">
                    <button
                        onClick={toggleListening}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                            isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'
                        } text-white`}
                        aria-label={isListening ? "Stop listening" : "Start listening"}
                    >
                        {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                    </button>
                </div>

                <div className="text-center mb-4">
                    {isListening ? (
                        <p className="text-red-500 font-medium">Listening...</p>
                    ) : isProcessing ? (
                        <p className="text-indigo-500 font-medium">Processing...</p>
                    ) : (
                        <p className="text-gray-500">Tap microphone to speak</p>
                    )}
                </div>

                <form onSubmit={handleTextSubmit} className="mb-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="flex-1 border border-indigo-300 rounded-l-lg p-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type your question here..."
                        />
                        <button
                            type="submit"
                            className={`px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors ${
                                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isProcessing}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>

                <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Try saying:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"What restaurants are nearby?"</div>
                        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"Find Italian restaurants"</div>
                        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"Top items at [Restaurant Name]"</div>
                        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"Show me closest restaurants"</div>
                        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"restaurants near central park"</div>
                        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">"food near grand hotel"</div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 overflow-y-auto flex-1 bg-indigo-50 mb-4 shadow-inner">
                    {response ? (
                        <div className="prose max-w-none">
                            <ReactMarkdown>{response}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center italic">Ask me about nearby restaurants!</p>
                    )}
                </div>

                <div className="overflow-y-auto max-h-48">
                    {nearbyRestaurants.length > 0 ? (
                        <div>
                            <h3 className="font-bold text-indigo-800 mb-2">Nearby Restaurants:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {nearbyRestaurants.map(restaurant => (
                                    <div
                                        key={restaurant.id}
                                        className="p-3 border rounded-lg hover:shadow-md transition-shadow bg-white cursor-pointer"
                                        onClick={() => {
                                            setQuery(`Tell me about ${restaurant.name}`);
                                            handleVoiceQuery(`Tell me about ${restaurant.name}`);
                                        }}
                                    >
                                        <p className="font-medium text-indigo-700">{restaurant.name}</p>
                                        <div className="flex items-center text-sm">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="text-gray-700">{restaurant.rating}</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-gray-700 truncate">{restaurant.vicinity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center">Loading nearby restaurants...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VoiceInterface;