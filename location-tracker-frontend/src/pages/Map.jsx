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
import { useSocket } from '../hooks/useSocket';

export const Map = () => {
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapExpanded, setMapExpanded] = useState(false);
  const { tracking, startTracking, stopTracking, currentLocation, error: locationError } = useLocation();
  const { connected, joinCircles } = useSocket();

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

  // Join circle rooms when circles are loaded and socket is connected
  useEffect(() => {
    if (circles.length > 0 && connected) {
      joinCircles(circles.map(c => c._id));
    }
  }, [circles, connected, joinCircles]);

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

  const handleSyncPermissions = async () => {
    if (!selectedCircle) return;
    try {
      await circleService.syncPermissions(selectedCircle._id);
      alert('Permissions synced! Please refresh the page.');
      loadLocations(selectedCircle._id);
    } catch (error) {
      console.error('Failed to sync permissions:', error);
      alert('Failed to sync permissions');
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Live Map" />

      {/* MOBILE LAYOUT */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        {/* Controls Section - Scrollable when map is minimized */}
        <div className={`${mapExpanded ? 'hidden' : 'flex-1 overflow-y-auto'} p-4 space-y-4`}>
          {/* Circle Selection */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Select Circle</h3>
            <div className="flex flex-wrap gap-2">
              {circles.map((circle) => (
                <button
                  key={circle._id}
                  onClick={() => setSelectedCircle(circle)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCircle?._id === circle._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {circle.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Location Sharing */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Location Sharing</h3>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {connected ? 'Connected' : 'Reconnecting...'}
                </span>
              </div>
            </div>

            <Toggle
              enabled={tracking}
              onChange={handleTrackingToggle}
              label="Share my location"
              disabled={!connected}
            />

            {tracking && connected && (
              <p className="text-xs text-green-600 mt-2">✓ Location is being shared</p>
            )}
            {locationError && (
              <p className="text-xs text-red-500 mt-2">{locationError}</p>
            )}
          </Card>

          {/* Circle Members */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Circle Members</h3>
            <div className="space-y-3">
              {selectedCircle?.members
                ?.filter(m => m.status === 'active')
                .map((member) => {
                  const memberId = typeof member.userId === 'object' ? member.userId?._id : member.userId;
                  const memberLocation = locations.find(loc => {
                    const locUserId = typeof loc.userId === 'object' ? loc.userId?._id : loc.userId;
                    return String(locUserId) === String(memberId);
                  });
                  const memberName = typeof member.userId === 'object' ? member.userId?.name : 'Unknown';
                  const isLocationRecent = memberLocation && (Date.now() - new Date(memberLocation.timestamp).getTime()) < 5 * 60 * 1000;

                  return (
                    <div key={memberId} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {memberName?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{memberName}</p>
                        <p className="text-xs text-gray-500">
                          {isLocationRecent ? 'Active now' : memberLocation ? 'Last seen recently' : 'Location not shared'}
                        </p>
                      </div>
                      <div className={`h-3 w-3 rounded-full ${isLocationRecent ? 'bg-green-500' : memberLocation ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    </div>
                  );
                })}
            </div>
            <button onClick={handleSyncPermissions} className="mt-3 text-xs text-blue-600 underline">
              Fix location sharing issues
            </button>
          </Card>
        </div>

        {/* Map Section - Mobile */}
        <div className={`${mapExpanded ? 'flex-1' : 'h-64'} relative transition-all duration-300`}>
          {/* Expand/Minimize Button */}
          <button
            onClick={() => setMapExpanded(!mapExpanded)}
            className="absolute top-2 right-2 z-20 bg-white p-2 rounded-lg shadow-lg border"
          >
            {mapExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>

          {/* Map Label */}
          <div className="absolute top-2 left-2 z-20 bg-white px-3 py-1 rounded-lg shadow text-sm font-medium">
            {mapExpanded ? 'Tap ▼ to minimize' : 'Tap ▲ to expand map'}
          </div>

          <MapView
            locations={locations}
            center={mapCenter}
            onLocationClick={(location) => console.log('Clicked:', location)}
          />
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex flex-1">
        {/* Sidebar */}
        <div className="w-80 p-6 space-y-4 overflow-y-auto bg-white border-r">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Select Circle</h3>
            <div className="space-y-2">
              {circles.map((circle) => (
                <button
                  key={circle._id}
                  onClick={() => setSelectedCircle(circle)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedCircle?._id === circle._id
                      ? 'bg-blue-50 text-blue-600'
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
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">
                {connected ? 'Connected to server' : 'Disconnected - reconnecting...'}
              </span>
            </div>
            <Toggle
              enabled={tracking}
              onChange={handleTrackingToggle}
              label="Share my location"
              disabled={!connected}
            />
            {tracking && connected && (
              <p className="text-xs text-green-600 mt-2">✓ Your location is being shared</p>
            )}
            {locationError && (
              <p className="text-xs text-red-500 mt-2">Error: {locationError}</p>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Circle Members</h3>
            <div className="space-y-3">
              {selectedCircle?.members
                ?.filter(m => m.status === 'active')
                .map((member) => {
                  const memberId = typeof member.userId === 'object' ? member.userId?._id : member.userId;
                  const memberLocation = locations.find(loc => {
                    const locUserId = typeof loc.userId === 'object' ? loc.userId?._id : loc.userId;
                    return String(locUserId) === String(memberId);
                  });
                  const memberName = typeof member.userId === 'object' ? member.userId?.name : 'Unknown';
                  const isLocationRecent = memberLocation && (Date.now() - new Date(memberLocation.timestamp).getTime()) < 5 * 60 * 1000;

                  const getLastSeen = () => {
                    if (!memberLocation) return 'Location not shared';
                    const diff = Date.now() - new Date(memberLocation.timestamp).getTime();
                    const minutes = Math.floor(diff / 60000);
                    if (minutes < 1) return 'Active now';
                    if (minutes < 60) return `Last seen ${minutes}m ago`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `Last seen ${hours}h ago`;
                    return `Last seen ${Math.floor(hours / 24)}d ago`;
                  };

                  return (
                    <div key={memberId} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {memberName?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{memberName || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">
                          {memberLocation && isLocationRecent
                            ? `Battery: ${memberLocation.battery || 'N/A'}%`
                            : getLastSeen()}
                        </p>
                      </div>
                      <div className={`h-2 w-2 rounded-full ${isLocationRecent ? 'bg-green-500' : memberLocation ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    </div>
                  );
                })}
            </div>
            <button onClick={handleSyncPermissions} className="mt-4 w-full text-xs text-blue-600 hover:text-blue-700 underline">
              Fix location sharing issues
            </button>
          </Card>
        </div>

        {/* Map - Desktop */}
        <div className="flex-1 p-6">
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