import React, { useEffect, useRef, useState } from 'react';
import {
  User,
  Lock,
  Stethoscope,
  Shield,
  ClipboardList,
  CheckCircle
} from '../components/Icons';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api/auth';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<string[]>([]);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const toast = (msg: string) => {
    setToasts(t => [...t, msg]);
    setTimeout(() => setToasts(t => t.slice(1)), 4000);
  };

  const readSafe = async (res: Response) => {
    const t = await res.text();
    try {
      return JSON.parse(t);
    } catch {
      return { message: t };
    }
  };

  // ✅ MANUAL LOGIN / SIGNUP (SESSION-BASED)
  const handleAuth = async (endpoint: string, payload?: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        credentials: 'include', // ⭐ REQUIRED
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined
      });

      const data = await readSafe(res);
      if (!res.ok) throw new Error(data?.error || data?.message || 'Authentication failed');

      toast('Login successful');
      window.dispatchEvent(new Event('authchange'));
      window.location.href = '/';
    } catch (e: any) {
      setError(e.message);
      toast(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && !name) return setError('Enter your name');
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    await handleAuth(isSignUp ? 'register' : 'login', {
      name,
      email,
      password
    });
  };

  const guestLogin = async () => {
    await handleAuth('guest');
  };

  // ✅ GOOGLE LOGIN — REDIRECT TO BACKEND (CORRECT WAY)
  const triggerGoogle = () => {
    window.location.href =
      'https://metriage-ai.vercel.app/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT – LOGIN */}
        <div className="bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-1">
            {isSignUp ? 'Create your account' : 'Sign in to MedTriage AI'}
          </h2>

          <form onSubmit={submit} className="space-y-4">

            {isSignUp && (
              <div className="relative">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full pl-12 py-3 rounded-xl bg-slate-800 border border-slate-700"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            )}

            <div className="relative">
              <input
                ref={emailRef}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-12 py-3 rounded-xl bg-slate-800 border border-slate-700"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-20 py-3 rounded-xl bg-slate-800 border border-slate-700"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && <div className="text-rose-400 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold"
              >
                {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={guestLogin}
                className="px-4 py-2 rounded-full border border-slate-700 text-slate-200"
              >
                Continue as Guest
              </button>
            </div>

            {/* GOOGLE SIGN-IN */}
            <button
              type="button"
              onClick={triggerGoogle}
              className="w-full mt-3 py-3 rounded-full bg-white text-slate-900 font-semibold"
            >
              Continue with Google
            </button>
          </form>
        </div>

        {/* RIGHT – INFO (UNCHANGED UI) */}
        <div className="rounded-2xl p-8 bg-gradient-to-b from-cyan-900 to-blue-900 text-white">
          <h3 className="text-3xl font-bold mb-3">Early awareness saves lives.</h3>
          <p className="text-sm text-slate-200">
            MedTriage AI helps you understand symptoms and get AI-powered insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
