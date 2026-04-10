import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'blue' | 'green' | 'amber' | 'red';
  prefix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, value, subtext, variant = 'blue', prefix = '' 
}) => {
  const borderColors = {
    blue: 'border-t-blue',
    green: 'border-t-green',
    amber: 'border-t-warning',
    red: 'border-t-error',
  };

  const textColors = {
    blue: 'text-blue',
    green: 'text-green',
    amber: 'text-warning',
    red: 'text-error',
  };

  return (
    <div className={`card p-6 border-t-[4px] ${borderColors[variant]}`}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-sora">
        {label}
      </p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-sm font-bold ${textColors[variant]} font-numbers`}>{prefix}</span>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-numbers tracking-tight">
          {value}
        </h4>
      </div>
      {subtext && (
        <p className="text-xs text-slate-500 font-medium">{subtext}</p>
      )}
    </div>
  );
};

export default MetricCard;
