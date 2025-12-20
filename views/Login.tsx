import React, { useState, useEffect, useRef } from 'react';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api/auth';
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';

export const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (endpoint: string, data: any, remember = false) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Some responses (errors or empty responses) may not return valid JSON.
      // Read text first and try to parse JSON safely.
      const text = await res.text();
      let result: any = {};
      if (text) {
        try {
          result = JSON.parse(text);
        } catch (e) {
          // keep raw text for error reporting
          result = { _raw: text };
        }
      }

      if (!res.ok) {
        const msg = result?.error || result?.message || result?._raw || `Server Error: ${res.status}`;
        throw new Error(msg);
      }

      // If server returned a user object, persist it. Otherwise store whole result.
      const userToStore = result?.user || result || {};
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('campus_isAuthenticated', 'true');
      storage.setItem('medtriage_user', JSON.stringify(userToStore));

      // persist remembered email if requested
      try {
        if (remember) {
          localStorage.setItem('medtriage_remember', '1');
          localStorage.setItem('medtriage_remember_email', data?.email || userToStore?.email || '');
        } else {
          localStorage.removeItem('medtriage_remember');
          localStorage.removeItem('medtriage_remember_email');
        }
      } catch (e) {}

      // notify other components about auth change, then navigate to root
      try { window.dispatchEvent(new Event('authchange')); } catch (e) {}
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err: any) {
      const msg = err?.message || String(err) || 'Login failed';
      console.error('Auth error:', err);
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        setError(`Network error: could not reach authentication server. Ensure backend is running and CORS/proxy is configured. (${API_URL})`);
      } else {
        setError(msg);
      }
    }
  };

  const submitSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signinEmail || !signinPassword) return setError('Enter email and password');
    handleAuth('login', { email: signinEmail, password: signinPassword }, rememberMe);
  };

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signupEmail || !signupPassword || !signupName) return setError('Fill all signup fields');
    handleAuth('register', { name: signupName, email: signupEmail, password: signupPassword }, rememberMe);
  };

  const guestLogin = () => {
    localStorage.setItem('campus_isAuthenticated', 'true');
    localStorage.removeItem('medtriage_user');
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Google Sign-In handler
  const handleGoogleCredential = async (idToken: string) => {
    setError(null);
    if (!idToken) return setError('Google sign-in failed: no token');
    // send id_token to backend for verification and user creation
    await handleAuth('google', { id_token: idToken }, rememberMe);
  };

  // Load Google Identity Services and render button if client id available
  useEffect(() => {
    // load remembered email
    try {
      const r = localStorage.getItem('medtriage_remember');
      const em = localStorage.getItem('medtriage_remember_email');
      if (r === '1' && em) {
        setSigninEmail(em);
        setRememberMe(true);
      }
    } catch (e) {}

    if (!GOOGLE_CLIENT_ID) return;
    const existing = document.getElementById('google-client-script');
    if (!existing) {
      const s = document.createElement('script');
      s.id = 'google-client-script';
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => {
        try {
          const g = (window as any).google;
          if (!g) return;
          g.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              // response.credential contains the ID token
              handleGoogleCredential(response?.credential);
            }
          });
          if (googleButtonRef.current) {
            g.accounts.id.renderButton(googleButtonRef.current, { theme: 'filled_black', size: 'large', shape: 'pill' });
          }
        } catch (e) { console.warn('Google init failed', e); }
      };
      document.head.appendChild(s);
    } else {
      // if script already present, try to render
      const g = (window as any).google;
      if (g && googleButtonRef.current) {
        try {
          g.accounts.id.renderButton(googleButtonRef.current, { theme: 'filled_black', size: 'large', shape: 'pill' });
        } catch (e) {}
      }
    }
  }, []);
  return (
    <div className="max-w-3xl mx-auto py-12 animate-fade-in">
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/6 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            {!isSignUp ? (
              <form onSubmit={submitSignin} className="space-y-4">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <p className="text-sm text-slate-400">or use your account</p>
                <input value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" placeholder="Email" />
                <input value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} type="password" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" placeholder="Password" />
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <div className="flex items-center gap-2">
                  <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <label htmlFor="rememberMe" className="text-sm text-slate-400">Remember me</label>
                </div>
                <div className="my-2" ref={googleButtonRef} />

                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 rounded-full bg-cyan-600">Sign In</button>
                  <button type="button" onClick={guestLogin} className="px-4 py-2 rounded-full border">Continue as Guest</button>
                </div>
                <p className="text-sm text-slate-500">Don’t have an account? <button onClick={() => setIsSignUp(true)} className="text-cyan-400">Sign up</button></p>
              </form>
            ) : (
              <form onSubmit={submitSignup} className="space-y-4">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <input value={signupName} onChange={(e) => setSignupName(e.target.value)} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" placeholder="Name" />
                <input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" placeholder="Email" />
                <input value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} type="password" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" placeholder="Password" />
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 rounded-full bg-emerald-600">Sign Up</button>
                  <button type="button" onClick={() => setIsSignUp(false)} className="px-4 py-2 rounded-full border">Back</button>
                </div>
              </form>
            )}
          </div>
          <div className="p-8 bg-gradient-to-b from-cyan-900 to-blue-900 text-white flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold mb-2">Welcome</h3>
            <p className="text-sm text-slate-200 max-w-sm text-center">Sign in to access your profile, orders, and triage history.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
