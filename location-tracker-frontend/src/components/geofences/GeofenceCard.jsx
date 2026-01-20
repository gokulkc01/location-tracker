import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, Edit2, Bell, BellOff, Target } from 'lucide-react';
import { geofenceService } from '../../services/geofenceService';

export const GeofenceCard = ({ geofence, onDelete, onUpdate }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this geofence?')) return;

        setDeleting(true);
        try {
            await geofenceService.deleteGeofence(geofence._id);
            onDelete?.(geofence._id);
        } catch (error) {
            console.error('Failed to delete geofence:', error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{geofence.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {geofence.circleId?.name || 'Unknown Circle'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{geofence.radius}m radius</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                        {geofence.latitude?.toFixed(4)}, {geofence.longitude?.toFixed(4)}
                    </span>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-1 ${geofence.notifyOnEnter ? 'text-green-600' : 'text-gray-400'}`}>
                    {geofence.notifyOnEnter ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    <span>Enter</span>
                </div>
                <div className={`flex items-center gap-1 ${geofence.notifyOnExit ? 'text-green-600' : 'text-gray-400'}`}>
                    {geofence.notifyOnExit ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    <span>Exit</span>
                </div>
            </div>
        </motion.div>
    );
};