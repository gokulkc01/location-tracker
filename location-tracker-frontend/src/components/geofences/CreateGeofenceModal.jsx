import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MapPin, Target, Bell } from 'lucide-react';
import { geofenceService } from '../../services/geofenceService';
import { useLocation } from '../../hooks/UseLocation';

export const CreateGeofenceModal = ({ isOpen, onClose, circleId, onCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        radius: 100,
        notifyOnEnter: true,
        notifyOnExit: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { getCurrentPosition } = useLocation();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleUseCurrentLocation = async () => {
        try {
            const position = await getCurrentPosition();
            setFormData((prev) => ({
                ...prev,
                latitude: position.coords.latitude.toFixed(6),
                longitude: position.coords.longitude.toFixed(6),
            }));
        } catch (err) {
            setError('Failed to get current location');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const geofence = await geofenceService.createGeofence({
                circleId,
                name: formData.name,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                radius: parseInt(formData.radius),
                notifyOnEnter: formData.notifyOnEnter,
                notifyOnExit: formData.notifyOnExit,
            });

            onCreated?.(geofence);
            onClose();
            setFormData({
                name: '',
                latitude: '',
                longitude: '',
                radius: 100,
                notifyOnEnter: true,
                notifyOnExit: true,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create geofence');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Geofence">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <Input
                    label="Geofence Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Home, School, Work"
                    icon={MapPin}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="e.g., 37.7749"
                        required
                    />
                    <Input
                        label="Longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="e.g., -122.4194"
                        required
                    />
                </div>

                <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="w-full px-4 py-2 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Target className="w-4 h-4" />
                    Use Current Location
                </button>

                <Input
                    label="Radius (meters)"
                    name="radius"
                    type="number"
                    min="10"
                    max="10000"
                    value={formData.radius}
                    onChange={handleChange}
                    icon={Target}
                />

                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="notifyOnEnter"
                            checked={formData.notifyOnEnter}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-600">Notify when someone enters</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="notifyOnExit"
                            checked={formData.notifyOnExit}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-600">Notify when someone exits</span>
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1">
                        Create Geofence
                    </Button>
                </div>
            </form>
        </Modal>
    );
};