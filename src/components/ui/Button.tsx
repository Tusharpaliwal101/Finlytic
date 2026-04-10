import React from 'react';
import { Loader2, FileSpreadsheet, FileDown } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal' | 'danger' | 'excel' | 'pdf';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-10 font-semibold transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-blue text-white hover:bg-blue-dark shadow-sm',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    teal: 'bg-green text-white hover:bg-green-dark shadow-sm',
    danger: 'bg-error text-white hover:opacity-90 shadow-sm',
    excel: 'bg-[#1D6F42] text-white hover:opacity-90 shadow-sm', // Standard Excel Green
    pdf: 'bg-[#E02424] text-white hover:opacity-90 shadow-sm',   // Standard PDF Red
  };

  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
        <>
          {variant === 'excel' && <FileSpreadsheet className="w-4 h-4" />}
          {variant === 'pdf' && <FileDown className="w-4 h-4" />}
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
