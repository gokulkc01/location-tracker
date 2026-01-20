import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    const loader = (
        <div className="flex items-center justify-center">
            <motion.div
                className={clsx('border-4 border-primary-200 border-t-primary-600 rounded-full', sizes[size])}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                {loader}
            </div>
        );
    }

    return loader;
};