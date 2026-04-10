import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, LogIn, Chrome, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { signIn, signInWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Failed to log in. Check your Firebase credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Google sign in failed.');
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Log in to manage your financial analytics"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-error/10 border border-error text-error text-sm rounded-10">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="name@company.com"
              className={`w-full pl-10 ${errors.email ? 'border-error ring-1 ring-error' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 ${errors.password ? 'border-error ring-1 ring-error' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue focus:ring-blue"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>
          <Link 
            to="/auth/forgot-password"
            className="text-sm font-medium text-blue hover:text-blue-dark transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue hover:bg-blue-dark text-white h-11 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white dark:bg-slate-800 border-1.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white h-11 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <Chrome className="w-5 h-5" />
          Google
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-blue font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

