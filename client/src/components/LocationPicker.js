import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const LocationPicker = ({ onLocationSelect, initialCenter }) => {
  const [locationInput, setLocationInput] = useState('');
  const [coords, setCoords] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (initialCenter) {
      setLocationInput(`${initialCenter.lat}, ${initialCenter.lng}`);
      setCoords(initialCenter);
    }
  }, [initialCenter]);

  const geocodeLocation = async (address) => {
    setGeocoding(true);
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results[0]) {
        const location = data.results[0].geometry.location;
        const newCoords = { lat: location.lat, lng: location.lng };
        setCoords(newCoords);
        onLocationSelect && onLocationSelect(newCoords, address);
        setGeocoding(false);
        return true;
      } else {
        setGeocoding(false);
        return false;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocoding(false);
      return false;
    }
  };

  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setLocationInput(value);
    
    // Always notify parent about the input value
    if (!value.trim()) {
      setCoords(null);
      onLocationSelect && onLocationSelect(null, '');
      return;
    }

    // Notify parent immediately with the input value
    onLocationSelect && onLocationSelect(null, value);

    // Try to parse lat/lng if format is "lat, lng"
    const coordsParts = value.split(',').map(s => parseFloat(s.trim()));
    if (coordsParts.length === 2 && !isNaN(coordsParts[0]) && !isNaN(coordsParts[1])) {
      const newCoords = { lat: coordsParts[0], lng: coordsParts[1] };
      setCoords(newCoords);
      onLocationSelect && onLocationSelect(newCoords, value);
    } else {
      // It's a place name - try to geocode after a short delay
      setCoords(null);
      // Debounce geocoding
      if (value.length > 3) {
        setTimeout(() => {
          if (locationInput === value) {
            geocodeLocation(value);
          }
        }, 1000);
      }
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const coordsString = `${newCoords.lat.toFixed(6)}, ${newCoords.lng.toFixed(6)}`;
        setCoords(newCoords);
        setLocationInput(coordsString);
        onLocationSelect && onLocationSelect(newCoords, coordsString);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter location name manually.');
        setGettingLocation(false);
      }
    );
  };

  return (
    <div>
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter location name or address (e.g., Dhaka, Bangladesh)"
            value={locationInput}
            onChange={handleLocationChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <FaMapMarkerAlt />
            {gettingLocation ? 'Getting...' : 'My Location'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Type any location name, address, or city - coordinates will be detected automatically
        </p>
        {geocoding && (
          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
            <FaSpinner className="animate-spin" /> Finding location on map...
          </p>
        )}
        {coords && !geocoding && (
          <p className="text-xs text-green-600 mt-1 font-semibold">
            ✓ Location found: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </p>
        )}
        {locationInput && !coords && !geocoding && locationInput.length > 3 && (
          <p className="text-xs text-orange-600 mt-1">
            ⏳ Searching for location...
          </p>
        )}
      </div>

      {/* Embedded Google Map Preview */}
      {locationInput && locationInput.trim() !== '' && (
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(locationInput)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
            key={locationInput}
          ></iframe>
        </div>
      )}

      {(!locationInput || locationInput.trim() === '') && (
        <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <FaMapMarkedAlt className="text-5xl text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            📍 Click "My Location" or type any location name
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Examples: "Dhaka", "Gulshan Circle 1", "Dhanmondi Lake"
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
