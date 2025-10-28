// @ts-nocheck
import React, { useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useApp, Event } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface MapComponentProps {
  events: Event[];
}

export const MapComponent: React.FC<MapComponentProps> = ({ events }) => {
  const { userLocation, setUserLocation, locationGranted, setLocationGranted } = useApp();
  const hasRequestedLocation = React.useRef(false);

  useEffect(() => {
    if (locationGranted && !userLocation && !hasRequestedLocation.current) {
      hasRequestedLocation.current = true;

      if (!('geolocation' in navigator)) {
        toast.error('Geolocation is not supported by your browser');
        setUserLocation({ lat: 28.6139, lng: 77.2090 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Location detected successfully');
        },
        (error) => {
          // Handle geolocation errors with specific messages
          let errorMessage = 'Could not detect location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied by browser';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          toast.error(errorMessage);
          // Set a default location (New Delhi, India) if location access fails
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 60000
        }
      );
    }
  }, [locationGranted, userLocation, setUserLocation, setLocationGranted]);

  // Generate event locations around user location or default location
  const getEventLocations = () => {
    const baseLocation = userLocation || { lat: 28.6139, lng: 77.2090 };
    return events.slice(0, 10).map((event, index) => ({
      ...event,
      lat: event.latitude || baseLocation.lat + (Math.random() - 0.5) * 0.1,
      lng: event.longitude || baseLocation.lng + (Math.random() - 0.5) * 0.1,
    }));
  };

  const eventLocations = getEventLocations();

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg relative overflow-hidden border-2 border-green-200 dark:border-gray-700">
      {/* Map Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* User Location Marker */}
      {userLocation && (
        <div
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          <div className="relative">
            <Navigation className="w-8 h-8 text-blue-600 drop-shadow-lg" fill="currentColor" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              You are here
            </div>
          </div>
        </div>
      )}

      {/* Event Location Markers */}
      {eventLocations.map((event, index) => {
        const centerLat = userLocation?.lat || 28.6139;
        const centerLng = userLocation?.lng || 77.2090;
        
        // Calculate position relative to center (simplified projection)
        const latDiff = event.lat - centerLat;
        const lngDiff = event.lng - centerLng;
        
        // Convert to percentage position (with some scaling)
        const xPos = 50 + (lngDiff * 500);
        const yPos = 50 + (latDiff * -500);
        
        // Only show markers within reasonable bounds
        if (xPos < 0 || xPos > 100 || yPos < 0 || yPos > 100) return null;

        return (
          <div
            key={event.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-full cursor-pointer group"
            style={{
              left: `${xPos}%`,
              top: `${yPos}%`,
            }}
          >
            <MapPin className="w-8 h-8 text-red-600 drop-shadow-lg animate-bounce" fill="currentColor" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <p className="text-xs">{event.name}</p>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          </div>
        );
      })}

      {/* Map Controls/Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="w-4 h-4 text-blue-600" fill="currentColor" />
          <span className="text-xs">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-600" fill="currentColor" />
          <span className="text-xs">Event Locations ({eventLocations.length})</span>
        </div>
      </div>

      {/* Info Overlay if location not granted */}
      {!locationGranted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300">
              Grant location access to see nearby events and your position on the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
