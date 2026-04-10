import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  useEffect(() => {
    let s = 0;
    if (password.length > 5) s++;
    if (password.length > 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[!@#$%^&*]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-error';
    if (strength <= 4) return 'bg-warning';
    return 'bg-green';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signUp(data.email, data.password);
      navigate('/dashboard');
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Failed to create account. Check your Firebase credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Start your financial planning journey today"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-error/10 border border-error text-error text-sm rounded-10">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className={`w-full pl-10 ${errors.name ? 'border-error ring-1 ring-error' : ''}`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
        </div>

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
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`w-full pl-10 ${errors.password ? 'border-error ring-1 ring-error' : ''}`}
            />
          </div>
          <div className="mt-2 text-xs flex items-center justify-between">
            <div className="flex-1 flex gap-1 h-1.5 mr-4">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`flex-1 rounded-full ${i < strength ? getStrengthColor() : 'bg-slate-200 dark:bg-slate-800'}`}
                ></div>
              ))}
            </div>
            <span className="font-medium text-slate-500">{getStrengthText()}</span>
          </div>
          {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className={`w-full pl-10 ${errors.confirmPassword ? 'border-error ring-1 ring-error' : ''}`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue hover:bg-blue-dark text-white h-11 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;

