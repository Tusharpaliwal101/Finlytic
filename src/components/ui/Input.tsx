import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  prefix, 
  suffix, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-sora">
          {label}
        </label>
      )}
      <div className="relative group">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-numbers text-sm pointer-events-none group-focus-within:text-blue transition-colors">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full h-[44px] rounded-10 border-1.5 border-slate-200 dark:border-slate-800 
            bg-white dark:bg-slate-900 px-4 transition-all outline-none
            focus:border-blue dark:focus:border-blue ring-offset-bg font-numbers 
            ${prefix ? 'pl-8' : ''} 
            ${suffix ? 'pr-12' : ''}
            ${error ? 'border-error focus:border-error' : ''}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold pointer-events-none group-focus-within:text-blue transition-colors">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-error font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
