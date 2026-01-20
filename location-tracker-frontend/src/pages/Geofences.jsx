import { useEffect, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Header } from '../components/dashboard/Header';
import { Button } from '../components/common/Button';
import { GeofenceList } from '../components/geofences/GeofenceList';
import { CreateGeofenceModal } from '../components/geofences/CreateGeofenceModal';
import { geofenceService } from '../services/geofenceService';
import { circleService } from '../services/circleService';

export const Geofences = () => {
    const [geofences, setGeofences] = useState([]);
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState('');
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        loadCircles();
    }, []);

    useEffect(() => {
        if (selectedCircle) {
            loadGeofences(selectedCircle);
        }
    }, [selectedCircle]);

    const loadCircles = async () => {
        try {
            const data = await circleService.getMyCircles();
            setCircles(data);
            if (data.length > 0) {
                setSelectedCircle(data[0]._id);
            }
        } catch (error) {
            console.error('Failed to load circles:', error);
        }
    };

    const loadGeofences = async (circleId) => {
        setLoading(true);
        try {
            const data = await geofenceService.getGeofences(circleId);
            setGeofences(data);
        } catch (error) {
            console.error('Failed to load geofences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGeofenceCreated = (newGeofence) => {
        setGeofences((prev) => [newGeofence, ...prev]);
    };

    const handleGeofenceDeleted = (id) => {
        setGeofences((prev) => prev.filter((g) => g._id !== id));
    };

    return (
        <div>
            <Header title="Geofences" />

            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <p className="text-gray-600">
                            Set up location-based alerts for your circles
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Circle Selector */}
                        <select
                            value={selectedCircle}
                            onChange={(e) => setSelectedCircle(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {circles.map((circle) => (
                                <option key={circle._id} value={circle._id}>
                                    {circle.name}
                                </option>
                            ))}
                        </select>

                        <Button
                            icon={Plus}
                            onClick={() => setCreateModalOpen(true)}
                            disabled={!selectedCircle}
                        >
                            Add Geofence
                        </Button>
                    </div>
                </div>

                {circles.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No circles yet</h3>
                        <p className="text-gray-500 mt-1">
                            Create a circle first to set up geofences
                        </p>
                    </div>
                ) : (
                    <GeofenceList
                        geofences={geofences}
                        loading={loading}
                        onDelete={handleGeofenceDeleted}
                    />
                )}
            </div>

            <CreateGeofenceModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                circleId={selectedCircle}
                onCreated={handleGeofenceCreated}
            />
        </div>
    );
};
