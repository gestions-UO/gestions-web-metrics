'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Welcome back.', {
          description: 'Authenticating...',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        toast.error('Invalid credentials', {
          description: data.error || 'Check your email and password.',
        });
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Connection error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      
      <header className="px-8 py-8 w-full flex justify-center md:justify-start">
        <Link href="/" className="text-xl font-medium tracking-tight text-neutral-900">
          gestions-web-metrics.
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-3">Sign in</h1>
            <p className="text-neutral-500 text-sm font-light">to continue to gestions-web-metrics</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-600" htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 placeholder:text-neutral-400 text-sm font-light"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-neutral-600" htmlFor="password">Password</label>
              </div>
              <input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 placeholder:text-neutral-400 text-sm font-light tracking-widest"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 flex items-center justify-center w-full py-3.5 px-6 bg-neutral-900 text-white font-medium rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /></span>
              ) : (
                <span className="flex items-center gap-2 text-sm">
                  Continue <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-500 font-light">
            Self-hosted instance. Configured via .env
          </p>
        </motion.div>
      </main>
    </div>
  );
}
