// utils/locationUtils.js
export const searchLocationRestaurants = async (locationName, radius = 1000, setResponse, setLocation, setSearchedLocations, setNearbyRestaurants) => {
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
                `I found ${formattedAddress}, but there don't seem to be any restaurants nearby within ${radius / 1000
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