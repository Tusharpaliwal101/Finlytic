import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  variant?: 'blue' | 'green';
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, variant = 'blue', label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sora">{label}</span>}
      <div 
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? (variant === 'green' ? 'bg-green' : 'bg-blue') : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 22 : 2 }}
          initial={false}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </label>
  );
};

export default Toggle;
