import { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../../utils/constants';

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapView = ({ locations = [], geofences = [], center, onLocationClick }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map && center) {
      map.setView(center, MAP_CONFIG.defaultZoom);
    }
  }, [map, center]);

  const mapCenter = center || MAP_CONFIG.defaultCenter;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full rounded-xl overflow-hidden shadow-lg"
    >
      <LeafletMap
        center={mapCenter}
        zoom={MAP_CONFIG.defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Markers */}
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => onLocationClick && onLocationClick(location),
            }}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">{location.userId?.name}</p>
                <p className="text-sm text-gray-600">
                  Battery: {location.battery || 'N/A'}%
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(location.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Geofence Circles */}
        {geofences.map((fence) => (
          <Circle
            key={fence._id}
            center={[fence.latitude, fence.longitude]}
            radius={fence.radius}
            pathOptions={{
              color: '#0ea5e9',
              fillColor: '#0ea5e9',
              fillOpacity: 0.1,
            }}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">{fence.name}</p>
                <p className="text-sm text-gray-600">Radius: {fence.radius}m</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </LeafletMap>
    </motion.div>
  );
};