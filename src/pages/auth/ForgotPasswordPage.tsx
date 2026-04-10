import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    console.log('Resetting password for...', data.email);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent a password reset link to your email address"
      >
        <div className="text-center py-4">
          <div className="flex justify-center mb-6">
            <div className="bg-green/10 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Click the link in the email to reset your account password. If you don't see it, check your spam folder.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white h-11 rounded-10 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Resend email
          </button>
          <Link 
            to="/auth/login" 
            className="flex items-center justify-center gap-2 mt-6 text-sm text-blue font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot password?" 
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue hover:bg-blue-dark text-white h-11 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Reset Link
            </>
          )}
        </button>

        <Link 
          to="/auth/login" 
          className="flex items-center justify-center gap-2 text-sm text-blue font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

