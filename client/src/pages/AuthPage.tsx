import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') ?? 'citizen';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const isCitizen = roleParam === 'citizen';

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate(roleParam === 'authority' ? '/authority/dashboard' : '/home');
      }
    });
  }, [navigate, roleParam]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate(roleParam === 'authority' ? '/authority/dashboard' : '/home');
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/home` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMagicSent(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password: password || 'citizen123',
      options: { data: { name, phone } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Registration initiated! Check your email to verify and access your account.');
      setMode('login');
    }
  };

  return (
    <div className="bg-[#111319] text-[#e2e2eb] min-h-screen flex flex-col relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Texture Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(250, 92, 27, 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Header */}
      <header className="w-full z-10 px-6 h-16 flex justify-between items-center border-b border-[#282a30] bg-[#1e1f26]/80 backdrop-blur-md">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#e3bfb3] hover:text-[#ffb59c] transition-colors group text-sm font-mono"
        >
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span>Change Role</span>
        </button>
        <div className="text-right">
          <span className="font-mono text-xs text-[#8B8FA8] block uppercase tracking-widest">Nagpur Pulse</span>
          <span className="font-mono text-xs text-[#fa5c1b] font-semibold">
            Continuing as {roleParam.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 z-10 relative">
        <div className="bg-[#1e1f26] border border-[#33343b] rounded-xl w-full max-w-md shadow-2xl overflow-hidden relative">
          {/* Tab Toggle */}
          <div className="flex border-b border-[#33343b] bg-[#191b22]">
            <button 
              className={`flex-1 py-3.5 font-mono text-xs tracking-wider transition-all font-semibold ${
                mode === 'login'
                  ? 'text-[#fa5c1b] border-b-2 border-[#fa5c1b] bg-[#1e1f26]'
                  : 'text-[#8B8FA8] hover:text-[#e2e2eb]'
              }`}
              onClick={() => setMode('login')}
            >
              LOGIN
            </button>
            {isCitizen && (
              <button 
                className={`flex-1 py-3.5 font-mono text-xs tracking-wider transition-all font-semibold ${
                  mode === 'register'
                    ? 'text-[#fa5c1b] border-b-2 border-[#fa5c1b] bg-[#1e1f26]'
                    : 'text-[#8B8FA8] hover:text-[#e2e2eb]'
                }`}
                onClick={() => setMode('register')}
              >
                REGISTER
              </button>
            )}
          </div>

          <div className="p-6">
            {/* Feedback Alerts */}
            {error && (
              <div className="bg-red-950/60 border border-red-800/80 text-red-300 text-xs rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="bg-green-950/60 border border-green-800/80 text-green-300 text-xs rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{message}</span>
              </div>
            )}

            {/* CITIZEN LOGIN */}
            {isCitizen && mode === 'login' && !magicSent && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h1 className="text-xl font-bold text-[#e2e2eb] mb-1">Welcome Citizen</h1>
                  <p className="text-xs text-[#8B8FA8]">Enter your email for passwordless magic link login.</p>
                </div>
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#8B8FA8]">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8FA8] text-base">mail</span>
                      <input
                        type="email"
                        className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:border-[#fa5c1b] transition-colors"
                        placeholder="citizen@nagpurpulse.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#fa5c1b] text-white font-mono text-xs font-bold py-3 rounded-lg hover:bg-[#d94a10] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40"
                  >
                    {loading ? 'Sending Magic Link...' : 'Send Magic Link →'}
                  </button>
                </form>
                <div className="pt-3 border-t border-[#33343b] text-center">
                  <span className="text-xs text-[#8B8FA8]">Or login with password:</span>
                  <form onSubmit={handlePasswordLogin} className="mt-3 space-y-3">
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-[#282a30] hover:bg-[#33343b] text-xs font-mono py-2 rounded text-[#e2e2eb]">
                      Password Login
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* MAGIC LINK SENT */}
            {isCitizen && mode === 'login' && magicSent && (
              <div className="text-center py-6 space-y-4">
                <span className="material-symbols-outlined text-5xl text-[#fa5c1b] animate-bounce">mark_email_read</span>
                <h3 className="text-lg font-bold text-[#e2e2eb]">Check your email!</h3>
                <p className="text-xs text-[#8B8FA8] leading-relaxed">
                  We sent a magic link to <strong className="text-white">{email}</strong>.<br />
                  Click it to sign in automatically.
                </p>
                <button onClick={() => setMagicSent(false)} className="text-xs font-mono text-[#fa5c1b] hover:underline">
                  ← Try another email
                </button>
              </div>
            )}

            {/* CITIZEN REGISTER */}
            {isCitizen && mode === 'register' && (
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h1 className="text-xl font-bold text-[#e2e2eb] mb-1">Citizen Registration</h1>
                    <p className="text-xs text-[#8B8FA8]">Personal & Residency Details</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#fa5c1b]">01</span>
                </div>
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-[#8B8FA8] mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      placeholder="Amit Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#8B8FA8] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#8B8FA8] mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      placeholder="amit@nagpurpulse.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#8B8FA8] mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#fa5c1b] text-white font-mono text-xs font-bold py-3 rounded-lg hover:bg-[#d94a10] transition-colors mt-2"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration →'}
                  </button>
                </form>
              </div>
            )}

            {/* AUTHORITY / ADMIN LOGIN */}
            {!isCitizen && (
              <div className="space-y-4">
                <div className="mb-2">
                  <h1 className="text-xl font-bold text-[#e2e2eb] mb-1">
                    {roleParam === 'authority' ? '🛡️ Authority Sign In' : '⌨️ Admin Sign In'}
                  </h1>
                  <p className="text-xs text-[#8B8FA8]">Enter official credentials for municipal access.</p>
                </div>
                <form onSubmit={handlePasswordLogin} className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-[#8B8FA8] mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      placeholder={roleParam === 'authority' ? 'authority@nagpurpulse.com' : 'admin@nagpurpulse.com'}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#8B8FA8] mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full bg-[#111319] border border-[#33343b] text-[#e2e2eb] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b]"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#fa5c1b] text-white font-mono text-xs font-bold py-3 rounded-lg hover:bg-[#d94a10] transition-colors mt-2"
                  >
                    {loading ? 'Authenticating...' : 'Access Dashboard →'}
                  </button>
                </form>
                <div className="p-3 bg-[#191b22] border border-[#33343b] rounded text-[11px] font-mono text-[#8B8FA8] space-y-1">
                  <div><strong className="text-white">Authority Demo:</strong> authority@nagpurpulse.com / authority123</div>
                  <div><strong className="text-white">Admin Demo:</strong> admin@nagpurpulse.com / admin123</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
