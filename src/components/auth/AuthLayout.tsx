import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel: Branding & Features */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue to-green text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="bg-white/20 p-2 rounded-10 backdrop-blur-md">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold font-sora tracking-tight">Finlytic</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold font-sora leading-tight mb-6">
              Take Control of Your <br /> Financial Future.
            </h1>
            <p className="text-white/80 text-lg mb-12 max-w-md">
              Advanced analytics, retirement planning, and tax optimization tools all in one place.
            </p>

            <ul className="space-y-6">
              {[
                'Smart Investment Tracking',
                'Advanced Tax-Loss Harvesting',
                'Interactive Goal Simulation'
              ].map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-3 text-lg font-medium"
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <div className="card p-8 bg-white dark:bg-slate-900">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
