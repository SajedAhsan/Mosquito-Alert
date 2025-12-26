import React, { useEffect, useRef, useState } from 'react';

const loadGoogleMaps = (key) => {
  return new Promise((resolve, reject) => {
    if (!key) return reject(new Error('Google Maps API key missing'));
    if (window.google && window.google.maps) return resolve(window.google.maps);

    const existing = document.getElementById('google-maps-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

const LocationPicker = ({ onLocationSelect, initialCenter }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    let mounted = true;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (!mounted) return;
        const center = initialCenter || { lat: 0, lng: 0 };
        mapInstanceRef.current = new maps.Map(mapRef.current, {
          center,
          zoom: initialCenter ? 14 : 2,
        });

        // If initialCenter provided, place a marker
        if (initialCenter) {
          markerRef.current = new maps.Marker({
            position: initialCenter,
            map: mapInstanceRef.current,
          });
          setCoords(initialCenter);
          onLocationSelect && onLocationSelect(initialCenter);
        }

        // Add click listener
        mapInstanceRef.current.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          const newCoords = { lat, lng };

          if (!markerRef.current) {
            markerRef.current = new maps.Marker({
              position: newCoords,
              map: mapInstanceRef.current,
            });
          } else {
            markerRef.current.setPosition(newCoords);
          }

          setCoords(newCoords);
          onLocationSelect && onLocationSelect(newCoords);
        });
      })
      .catch((err) => {
        console.error('Google Maps load error:', err.message || err);
      });

    return () => {
      mounted = false;
    };
  }, [apiKey, initialCenter, onLocationSelect]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '360px', borderRadius: 8, overflow: 'hidden' }} />
      <div className="mt-2 text-sm text-gray-700">
        {coords ? (
          <div>
            <strong>Selected:</strong> Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
          </div>
        ) : (
          <div>Click on the map to choose a location.</div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
