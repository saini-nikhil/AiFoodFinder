import { useRef, useEffect } from "react";

function RestaurantMap({ 
  location, 
  mapLoaded, 
  setMapLoaded, 
  nearbyRestaurants, 
  setNearbyRestaurants, 
  setResponse, 
  gmapsApiKey,
  selectedRestaurant,
  setSelectedRestaurant
}) {
  const mapContainerRef = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${gmapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Define global initMap function that will be called when the script loads
    window.initMap = () => {
      setMapLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [gmapsApiKey, setMapLoaded]);

  // Initialize map and find nearby restaurants when location is available and map is loaded
  useEffect(() => {
    if (location && mapLoaded && mapContainerRef.current) {
      try {
        // Initialize the map
        const newMap = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: location.latitude, lng: location.longitude },
          zoom: 14,
          styles: [
            {
              "featureType": "poi.business",
              "elementType": "labels",
              "stylers": [{ "visibility": "on" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{ "color": "#e5e5e5" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#c9c9c9" }]
            }
          ]
        });
        
        mapRef.current = newMap;
        
        // Initialize directions service and renderer
        directionsServiceRef.current = new window.google.maps.DirectionsService();
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 5
          }
        });
        
        // Create a marker for user's location
        new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: newMap,
          title: "Your Location",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
        
        // Initialize the autocomplete search box
        if (inputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
          autocomplete.bindTo('bounds', newMap);
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (!place.geometry) {
              console.log("No details available for input: " + place.name);
              return;
            }
            
            if (place.geometry.viewport) {
              newMap.fitBounds(place.geometry.viewport);
            } else {
              newMap.setCenter(place.geometry.location);
              newMap.setZoom(17);
            }
            
            // Place a marker
            new window.google.maps.Marker({
              position: place.geometry.location,
              map: newMap
            });
          });
        }
        
        // Search for nearby restaurants
        fetchNearbyRestaurants(newMap, location);
      } catch (error) {
        console.error("Error initializing map:", error);
        setResponse("Unable to load the map. Please try refreshing the page.");
      }
    }
  }, [location, mapLoaded, setResponse]);

  // Calculate and display directions when a restaurant is selected
  useEffect(() => {
    if (selectedRestaurant && location && directionsServiceRef.current && directionsRendererRef.current) {
      // Request directions from user location to selected restaurant
      directionsServiceRef.current.route({
        origin: { lat: location.latitude, lng: location.longitude },
        destination: selectedRestaurant.position,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRendererRef.current.setDirections(result);
          
          // Extract route information for display
          const route = result.routes[0].legs[0];
          const distanceText = route.distance.text;
          const durationText = route.duration.text;
          
          setResponse(`Directions to ${selectedRestaurant.name}: ${distanceText} away, approximately ${durationText} by car. ${selectedRestaurant.rating} stars. Located at: ${selectedRestaurant.vicinity}`);
        } else {
          console.error('Directions request failed: ' + status);
          setResponse(`Couldn't get directions to ${selectedRestaurant.name}. Error: ${status}`);
        }
      });
    }
  }, [selectedRestaurant, location, setResponse]);

  const fetchNearbyRestaurants = async (mapInstance, userLocation) => {
    try {
      // Create a Places Service instance
      const service = new window.google.maps.places.PlacesService(mapInstance);
      
      // Request parameters
      const request = {
        location: new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude),
        radius: 2000,
        type: 'restaurant',
        keyword: 'restaurant',
        openNow: true
      };
      
      // Perform the nearby search
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Process results
          const restaurantsList = results.slice(0, 10).map(place => {
            // Create a photo URL if available, otherwise use placeholder
            let photoUrl = '/api/placeholder/200/200';
            if (place.photos && place.photos.length > 0) {
              photoUrl = place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 });
            }
            
            return {
              id: place.place_id,
              name: place.name,
              vicinity: place.vicinity,
              rating: place.rating || "No rating",
              priceLevel: place.price_level || "Not available",
              cuisine: place.types ? place.types.filter(type => type !== 'restaurant' && type !== 'establishment').join(', ') : 'Various',
              position: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              image: photoUrl
            };
          });
          
          if (restaurantsList.length === 0) {
            setResponse("No nearby restaurants found.");
          } else {
            setNearbyRestaurants(restaurantsList);
          }
          
          // Add markers for each restaurant
          const infoWindow = new window.google.maps.InfoWindow();
          
          restaurantsList.forEach(restaurant => {
            const marker = new window.google.maps.Marker({
              position: restaurant.position,
              map: mapInstance,
              title: restaurant.name,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });
            
            // Add click listener to marker
            marker.addListener('click', () => {
              const content = `
                <div class="info-window">
                  <h3 class="font-bold text-lg">${restaurant.name}</h3>
                  <div class="mt-1">
                    <span class="text-yellow-500">★</span> ${restaurant.rating}
                  </div>
                  <p class="text-gray-600 mt-1">${restaurant.vicinity}</p>
                  <button id="directions-btn" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">Get Directions</button>
                </div>
              `;
              
              infoWindow.setContent(content);
              infoWindow.open(mapInstance, marker);
              
              // Set selected restaurant
              setSelectedRestaurant(restaurant);
              
              // Add event listener for directions button after the info window is created
              setTimeout(() => {
                const directionsBtn = document.getElementById('directions-btn');
                if (directionsBtn) {
                  directionsBtn.addEventListener('click', () => {
                    if (directionsServiceRef.current && directionsRendererRef.current) {
                      directionsServiceRef.current.route({
                        origin: { lat: userLocation.latitude, lng: userLocation.longitude },
                        destination: restaurant.position,
                        travelMode: window.google.maps.TravelMode.DRIVING
                      }, (result, status) => {
                        if (status === 'OK') {
                          directionsRendererRef.current.setDirections(result);
                          
                          // Extract route information
                          const route = result.routes[0].legs[0];
                          setResponse(`Directions to ${restaurant.name}: ${route.distance.text} away, approximately ${route.duration.text} by car.`);
                        }
                      });
                    }
                  });
                }
              }, 100);
            });
          });
          
          const welcomeMessage = `Hello! I found ${restaurantsList.length} restaurants near you. You can ask me about specific cuisines or restaurants.`;
          setResponse(welcomeMessage);
        } else {
          console.error("Places API Error:", status);
          setResponse(`Sorry, I couldn't find nearby restaurants. Error: ${status}`);
        }
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setResponse(`Sorry, I couldn't find nearby restaurants. Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-indigo-800">Nearby Restaurants</h2>
      
      {/* Search Box */}
      <div className="mb-4">
        <input
          ref={inputRef}
          id="pac-input"
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search for restaurants or locations"
        />
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-64 md:h-96 rounded-lg shadow-md overflow-hidden"
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600">Loading map...</span>
          </div>
        )}
      </div>
      
      {/* Location Status */}
      {!location && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please enable location services to find nearby restaurants
          </p>
        </div>
      )}
      
      {/* Directions info */}
      {selectedRestaurant && (
        <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v1.586L5.707 4.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 5.586V4a1 1 0 00-1-1z" clipRule="evenodd" />
              <path d="M10 12a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1z" />
            </svg>
            <p>Directions to <strong>{selectedRestaurant.name}</strong> shown on map</p>
          </div>
          <div className="mt-2 flex space-x-2">
            <button 
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              onClick={() => {
                if (directionsServiceRef.current && directionsRendererRef.current && location) {
                  directionsServiceRef.current.route({
                    origin: { lat: location.latitude, lng: location.longitude },
                    destination: selectedRestaurant.position,
                    travelMode: window.google.maps.TravelMode.WALKING
                  }, (result, status) => {
                    if (status === 'OK') {
                      directionsRendererRef.current.setDirections(result);
                      const route = result.routes[0].legs[0];
                      setResponse(`Walking directions to ${selectedRestaurant.name}: ${route.distance.text}, approximately ${route.duration.text}.`);
                    }
                  });
                }
              }}
            >
              Walking
            </button>
            <button 
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              onClick={() => {
                if (directionsServiceRef.current && directionsRendererRef.current && location) {
                  directionsServiceRef.current.route({
                    origin: { lat: location.latitude, lng: location.longitude },
                    destination: selectedRestaurant.position,
                    travelMode: window.google.maps.TravelMode.DRIVING
                  }, (result, status) => {
                    if (status === 'OK') {
                      directionsRendererRef.current.setDirections(result);
                      const route = result.routes[0].legs[0];
                      setResponse(`Driving directions to ${selectedRestaurant.name}: ${route.distance.text}, approximately ${route.duration.text}.`);
                    }
                  });
                }
              }}
            >
              Driving
            </button>
            <button 
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              onClick={() => {
                if (directionsServiceRef.current && directionsRendererRef.current && location) {
                  directionsRendererRef.current.setDirections(null);
                  mapRef.current.setCenter({ lat: location.latitude, lng: location.longitude });
                  mapRef.current.setZoom(14);
                  setResponse(`Showing all nearby restaurants again.`);
                }
              }}
            >
              Clear Directions
            </button>
          </div>
        </div>
      )}
      
      {/* Restaurants List Preview */}
      {nearbyRestaurants.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {nearbyRestaurants.map(restaurant => (
              <div 
                key={restaurant.id} 
                className={`flex-shrink-0 w-40 rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all ${
                  selectedRestaurant && selectedRestaurant.id === restaurant.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <div className="h-24 bg-gray-300" style={{
                  backgroundImage: `url('${restaurant.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                <div className="p-2">
                  <h3 className="font-bold text-sm truncate">{restaurant.name}</h3>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantMap;