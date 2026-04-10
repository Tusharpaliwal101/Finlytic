import React from 'react';

interface Preset {
  label: string;
  value: number;
}

interface PresetButtonsProps {
  presets: Preset[];
  currentValue: number;
  onSelect: (value: number) => void;
  label?: string;
}

const PresetButtons: React.FC<PresetButtonsProps> = ({ presets, currentValue, onSelect, label }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.value)}
            className={`
              px-3 py-1.5 rounded-10 text-xs font-semibold transition-all border-1.5
              ${currentValue === p.value 
                ? 'bg-blue/10 border-blue text-blue' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue/50'}
            `}
          >
            {p.label} ({p.value}%)
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetButtons;
