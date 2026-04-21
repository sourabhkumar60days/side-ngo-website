import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin, useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { HeartHandshake, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required")
});

export default function AdminLogin() {
  const login = useLogin();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/admin');
    }
  }, [isAuthenticated, setLocation]);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await login.mutateAsync(data);
      if (res.success) {
        setLocation('/admin');
      } else {
        setError('root', { message: 'Invalid credentials' });
      }
    } catch {
      setError('root', { message: 'Failed to connect to server' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg mb-4">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">SIDE Admin Portal</h1>
          <p className="text-slate-500">Sign in to manage the NGO website</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {errors.root && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
              {errors.root.message}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              {...register('username')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={login.isPending}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
