import { AnimatePresence } from 'framer-motion';
import { GeofenceCard } from './GeofenceCard';
import { MapPin } from 'lucide-react';

export const GeofenceList = ({ geofences, onDelete, onUpdate, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-40" />
                ))}
            </div>
        );
    }

    if (geofences.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No geofences yet</h3>
                <p className="text-gray-500 mt-1">
                    Create a geofence to get notified when someone enters or exits a location
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
                {geofences.map((geofence) => (
                    <GeofenceCard
                        key={geofence._id}
                        geofence={geofence}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};