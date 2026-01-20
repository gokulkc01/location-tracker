import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Toggle = ({ enabled, onChange, label, disabled = false }) => {
  return (
    <div className="flex items-center justify-between">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <button
        type="button"
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          enabled ? 'bg-primary-600' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
      >
        <motion.span
          layout
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
          animate={{ x: enabled ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
};