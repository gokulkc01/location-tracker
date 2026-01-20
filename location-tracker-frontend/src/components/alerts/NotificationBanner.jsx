import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, Battery } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export const NotificationBanner = () => {
  const { notifications, clearNotification } = useSocket();

  const getIcon = (type) => {
    switch (type) {
      case 'sos':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Battery className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackground = (type) => {
    switch (type) {
      case 'sos':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${getBackground(
              notification.type
            )}`}
          >
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
            </div>
            <button
              onClick={() => clearNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};