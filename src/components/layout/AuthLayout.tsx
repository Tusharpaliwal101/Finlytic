import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex shadow-inner items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue p-3 rounded-16 mb-4 shadow-xl shadow-blue/20">
            <div className="w-8 h-8 flex items-center justify-center text-white text-2xl font-bold">
              F
            </div>
          </div>
          <h1 className="text-2xl font-bold font-sora text-slate-900 dark:text-white">Finlytic</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-semibold italic">Simplified Wealth</p>
        </div>
        <div className="card p-8 bg-white dark:bg-slate-900 border-none shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
