import { motion } from 'framer-motion';

function Toast({ message, type, onClose }) {
    return (
        <motion.div
            className={`toast ${type}`}
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={onClose}
        >
            <span className="toast-icon">
                {type === 'success' ? '✅' : '❌'}
            </span>
            <span>{message}</span>
        </motion.div>
    );
}

export default Toast;
