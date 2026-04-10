import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ isVisible, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`
            fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-16 shadow-2xl
            ${type === 'success' ? 'bg-green text-white' : 'bg-error text-white'}
          `}
        >
          {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-semibold">{message}</span>
          <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
