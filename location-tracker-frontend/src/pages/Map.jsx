import { useEffect, useState } from 'react';
import { Header } from '../components/dashboard/Header';
import { MapView } from '../components/map/MapContainer';
import { SOSButton } from '../components/alerts/SOSButton';
import { Card } from '../components/common/Card';
import { Toggle } from '../components/common/Toggle';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { circleService } from '../services/circleService';
import { locationService } from '../services/locationService';
import { useLocation } from '../hooks/UseLocation';

export const Map = () => {
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tracking, startTracking, stopTracking, currentLocation } = useLocation();

  useEffect(() => {
    loadCircles();
  }, []);

  useEffect(() => {
    if (selectedCircle) {
      loadLocations(selectedCircle._id);
      const interval = setInterval(() => loadLocations(selectedCircle._id), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedCircle]);

  const loadCircles = async () => {
    try {
      const data = await circleService.getMyCircles();
      setCircles(data);
      if (data.length > 0) {
        setSelectedCircle(data[0]);
      }
    } catch (error) {
      console.error('Failed to load circles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async (circleId) => {
    try {
      const data = await locationService.getCircleLocations(circleId);
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const handleTrackingToggle = (enabled) => {
    if (enabled && selectedCircle) {
      startTracking(selectedCircle._id);
    } else {
      stopTracking();
    }
  };

  const mapCenter = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : locations.length > 0
    ? [locations[0].latitude, locations[0].longitude]
    : undefined;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header title="Live Map" />
      
      <div className="flex-1 p-6 flex gap-6">
        {/* Sidebar */}
        <div className="w-80 space-y-4 overflow-y-auto">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Select Circle</h3>
            <div className="space-y-2">
              {circles.map((circle) => (
                <button
                  key={circle._id}
                  onClick={() => setSelectedCircle(circle)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCircle?._id === circle._id
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{circle.name}</p>
                  <p className="text-sm text-gray-500">
                    {circle.members.filter(m => m.status === 'active').length} members
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Location Sharing</h3>
            <Toggle
              enabled={tracking}
              onChange={handleTrackingToggle}
              label="Share my location"
            />
            {tracking && (
              <p className="text-xs text-gray-500 mt-2">
                Your location is being shared with this circle
              </p>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Circle Members</h3>
            <div className="space-y-3">
              {locations.map((location) => (
                <div key={location._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    {location.userId?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {location.userId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Battery: {location.battery || 'N/A'}%
                    </p>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapView
            locations={locations}
            center={mapCenter}
            onLocationClick={(location) => console.log('Clicked:', location)}
          />
        </div>
      </div>

      {selectedCircle && <SOSButton circleId={selectedCircle._id} />}
    </div>
  );
};