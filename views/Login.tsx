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
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';

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
  const [googleReady, setGoogleReady] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Load Google Identity script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.log('Google Client ID not configured');
      return;
    }

    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi')) {
        initGoogle();
        return;
      }

      const s = document.createElement('script');
      s.id = 'google-gsi';
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = initGoogle;
      document.head.appendChild(s);
    };

    const initGoogle = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) {
        setTimeout(initGoogle, 100);
        return;
      }
      setGoogleReady(true);
    };

    loadGoogleScript();
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

  const handleAuth = async (endpoint: string, payload?: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined
      });

      const data = await readSafe(res);
      if (!res.ok) throw new Error(data?.error || data?.message || 'Authentication failed');

      localStorage.setItem('user', JSON.stringify(data.user));

      // await fetch(`${API_URL}/me`, { credentials: 'include' }); // Removed as /me not implemented

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

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const { name: gName, email: gEmail, picture, sub: googleId } = payload;
      await handleAuth('google', { name: gName, email: gEmail, picture, sub: googleId });
    } catch (e) {
      console.error('Google login decode error:', e);
      setError('Google sign-in failed');
    }
  };

  const triggerGoogle = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to .env');
      return;
    }
    const g = (window as any).google;
    if (!g?.accounts?.oauth2) {
      setError('Google sign-in is loading. Please try again.');
      return;
    }
    
    // Use OAuth2 popup flow (more reliable than One Tap)
    const client = g.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse?.access_token) {
          try {
            // Fetch user info using the access token
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const userInfo = await res.json();
            await handleAuth('google', {
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
              sub: userInfo.sub
            });
          } catch (e) {
            console.error('Google userinfo error:', e);
            setError('Failed to get Google user info');
          }
        }
      },
    });
    
    client.requestAccessToken();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT – LOGIN */}
        <div className="bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-1">
            {isSignUp ? 'Create your account' : 'Sign in to MedTriage AI'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Secure sign-in. No data is stored on your device.
          </p>

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
              disabled={loading}
              className="w-full mt-3 py-3 rounded-full bg-white text-slate-900 font-semibold flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="text-center text-xs text-slate-500 mt-2">
              Phone (OTP) login — Coming soon
            </div>

            <div className="flex justify-between text-xs mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(s => !s)}
                className="text-cyan-300"
              >
                {isSignUp ? 'Have an account? Sign in' : 'Don’t have an account? Sign up'}
              </button>
              <span className="text-slate-400">Forgot password (soon)</span>
            </div>
          </form>

          <div className="mt-6 text-xs text-slate-400">
            <Shield className="inline w-4 h-4 mr-1 text-cyan-400" />
            Healthcare-grade security • Data stored in India
            <div className="text-rose-300 mt-2">
              For early health awareness only. Not a medical diagnosis.
            </div>
          </div>
        </div>

        {/* RIGHT – INFO */}
        <div className="rounded-2xl p-8 bg-gradient-to-b from-cyan-900 to-blue-900 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-3">Early awareness saves lives.</h3>
            <p className="text-sm text-slate-200 mb-6">
              MedTriage AI is an intelligent healthcare platform that helps you understand your symptoms, 
              get AI-powered health insights, and take proactive steps for your well-being.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 items-start">
                <Stethoscope className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">AI Symptom Triage</span>
                  <p className="text-xs text-slate-300 mt-1">Chat with our AI to analyze symptoms and get preliminary health guidance</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <ClipboardList className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Secure Health Reports</span>
                  <p className="text-xs text-slate-300 mt-1">Download detailed PDF reports with risk assessment and specialist recommendations</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Medicine & Order Tracking</span>
                  <p className="text-xs text-slate-300 mt-1">Browse pharmacy, add medicines to cart, and track your orders</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <Shield className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Privacy First</span>
                  <p className="text-xs text-slate-300 mt-1">Your health data is encrypted and stored securely</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border-t border-cyan-700/50 pt-4">
            <p className="text-xs text-slate-300 mb-2">
              Powered by Groq AI • Built with React & Node.js
            </p>
            <p className="text-xs text-slate-400">© 2025 MedTriage AI. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* TOASTS */}
      <div className="fixed top-6 right-6 space-y-2">
        {toasts.map((t, i) => (
          <div key={i} className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
