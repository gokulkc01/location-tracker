import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { useLocation } from '../../hooks/UseLocation';

export const SOSButton = ({ circleId }) => {
  const [pressed, setPressed] = useState(false);
  const { sendSOS } = useSocket();
  const { currentLocation, getCurrentPosition } = useLocation();

  const handleSOS = async () => {
    setPressed(true);

    try {
      let location = currentLocation;
      
      if (!location) {
        const position = await getCurrentPosition();
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      sendSOS({
        circleId,
        latitude: location.latitude,
        longitude: location.longitude,
        message: 'Emergency! I need help!',
      });

      setTimeout(() => setPressed(false), 3000);
    } catch (error) {
      console.error('Failed to send SOS:', error);
      setPressed(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleSOS}
      disabled={pressed}
      className="fixed bottom-8 right-8 z-40"
    >
      <motion.div
        animate={pressed ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: pressed ? Infinity : 0, duration: 0.5 }}
        className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center"
      >
        <AlertTriangle className="h-8 w-8 text-white" />
      </motion.div>
      {!pressed && (
        <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full shadow">
          SOS
        </span>
      )}
    </motion.button>
  );
};
