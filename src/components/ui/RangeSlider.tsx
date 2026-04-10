import React from 'react';

interface RangeSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  hideLabels?: boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label, min, max, step = 1, value, onChange, prefix = '', suffix = '', hideLabels = false
}) => {
  return (
    <div className="w-full space-y-4 py-2">
      {!hideLabels && label && (
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sora">{label}</label>
          <div className="text-sm font-bold text-blue font-numbers bg-blue/5 px-2 py-0.5 rounded">
            {prefix}{value}{suffix}
          </div>
        </div>
      )}
      
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green active:accent-green-dark"
        />
      </div>

      {!hideLabels && (
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest font-numbers">
          <span>{prefix}{min}{suffix}</span>
          <span>{prefix}{max}{suffix}</span>
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
