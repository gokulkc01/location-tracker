import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Location Tracker</h1>
          <p className="text-gray-600">Keep your loved ones safe</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>
      </motion.div>
    </div>
  );
};