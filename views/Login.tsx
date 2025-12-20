import React, { useState } from 'react';

const API_URL = (window as any).API_URL || 'http://localhost:5000/api/auth';

export const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (endpoint: string, data: any) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Server Error: ${res.status}`);

      localStorage.setItem('campus_isAuthenticated', 'true');
      localStorage.setItem('medtriage_user', JSON.stringify(result.user));

      // navigate to root using history (App listens to popstate)
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const submitSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signinEmail || !signinPassword) return setError('Enter email and password');
    handleAuth('login', { email: signinEmail, password: signinPassword });
  };

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signupEmail || !signupPassword || !signupName) return setError('Fill all signup fields');
    handleAuth('register', { name: signupName, email: signupEmail, password: signupPassword });
  };

  const guestLogin = () => {
    localStorage.setItem('campus_isAuthenticated', 'true');
    localStorage.removeItem('medtriage_user');
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
