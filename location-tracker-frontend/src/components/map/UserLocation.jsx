import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Battery,
    Clock,
    Navigation,
    Signal,
    User,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export const UserLocation = ({
    user,
    location,
    isCurrentUser = false,
    showDetails = true,
    onClick
}) => {
    const [expanded, setExpanded] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        if (location?.timestamp) {
            const updateTime = () => {
                const now = new Date();
                const then = new Date(location.timestamp);
                const diffMs = now - then;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                const diffDays = Math.floor(diffHours / 24);

                if (diffMins < 1) {
                    setLastUpdated('Just now');
                } else if (diffMins < 60) {
                    setLastUpdated(`${diffMins}m ago`);
                } else if (diffHours < 24) {
                    setLastUpdated(`${diffHours}h ago`);
                } else {
                    setLastUpdated(`${diffDays}d ago`);
                }
            };

            updateTime();
            const interval = setInterval(updateTime, 60000);
            return () => clearInterval(interval);
        }
    }, [location?.timestamp]);

    const getBatteryColor = (level) => {
        if (level > 50) return 'text-green-500';
        if (level > 20) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getAccuracyLabel = (accuracy) => {
        if (accuracy <= 10) return 'High';
        if (accuracy <= 50) return 'Medium';
        return 'Low';
    };

    if (!location) {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {user?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">Location unavailable</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer
        ${isCurrentUser ? 'border-2 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isCurrentUser ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className={`w-5 h-5 ${isCurrentUser ? 'text-white' : 'text-gray-500'}`} />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {user?.name || 'Unknown User'}
                                {isCurrentUser && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                        You
                                    </span>
                                )}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{lastUpdated || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Battery indicator */}
                    {location.battery !== undefined && (
                        <div className={`flex items-center space-x-1 ${getBatteryColor(location.battery)}`}>
                            <Battery className="w-4 h-4" />
                            <span className="text-sm font-medium">{location.battery}%</span>
                        </div>
                    )}
                </div>

                {/* Quick location info */}
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="truncate">
                        {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                    </span>
                </div>
            </div>

            {/* Expandable details */}
            {showDetails && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Hide details
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show details
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 space-y-3">
                                    {/* Coordinates */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Latitude</p>
                                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                                                {location.latitude?.toFixed(8)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Longitude</p>
                                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                                                {location.longitude?.toFixed(8)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Accuracy */}
                                    {location.accuracy && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Signal className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {getAccuracyLabel(location.accuracy)} (~{Math.round(location.accuracy)}m)
                                            </span>
                                        </div>
                                    )}

                                    {/* Speed if available */}
                                    {location.speed !== undefined && location.speed !== null && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Navigation className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {(location.speed * 3.6).toFixed(1)} km/h
                                            </span>
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Last updated: {new Date(location.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>
    );
};

export default UserLocation;
