import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'bg-white rounded-xl shadow-soft p-6',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};