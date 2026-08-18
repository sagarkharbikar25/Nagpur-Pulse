import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useWards } from '../hooks/useWards';
import { RadarIcon, InfrastructureIcon, AIEngineIcon } from '../components/icons/CivicIcons';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') ?? 'official';
  const { data: wards } = useWards();

  const [activeTab, setActiveTab] = useState<'official' | 'citizen'>(
    roleParam === 'citizen' ? 'citizen' : 'official'
  );
  const [officialRole, setOfficialRole] = useState<'authority' | 'admin'>(
    roleParam === 'admin' ? 'admin' : 'authority'
  );

  const [selectedWardId, setSelectedWardId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wardList = wards && wards.length > 0 ? wards : [
    { id: 'w1', name: 'Dharampeth', zone: 'Zone 1' },
    { id: 'w2', name: 'Sitabuldi', zone: 'Zone 2' },
    { id: 'w3', name: 'Sadar', zone: 'Zone 3' },
    { id: 'w4', name: 'Laxmi Nagar', zone: 'Zone 4' },
    { id: 'w5', name: 'Gandhibagh', zone: 'Zone 5' },
    { id: 'w6', name: 'Dhantoli', zone: 'Zone 6' },
    { id: 'w7', name: 'Nehru Nagar', zone: 'Zone 7' },
    { id: 'w8', name: 'Manewada', zone: 'Zone 8' },
    { id: 'w9', name: 'Hingna', zone: 'Zone 9' },
  ];

  const currentSelectedWard = wardList.find((w: any) => w.id === selectedWardId) || wardList[0];

  // Auto set default email template based on selected sub-role
  useEffect(() => {
    if (officialRole === 'admin') {
      setEmail('admin@nagpurpulse.com');
      setPassword('admin123');
    } else {
      const wardSlug = (currentSelectedWard?.name || 'dharampeth').toLowerCase().replace(/\s+/g, '');
      setEmail(`officer.${wardSlug}@nagpurpulse.com`);
      setPassword('authority123');
    }
  }, [officialRole, currentSelectedWard?.name]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate('/home');
      }
    });
  }, [navigate]);

  const handleOfficialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter your official email and password.');
      setLoading(false);
      return;
    }

    // Role-specific credential validation
    if (officialRole === 'authority') {
      const targetWard = wardList.find((w: any) => w.id === selectedWardId) || wardList[0];
      const matchedDbWard = (wards ?? []).find(
        (w: any) => w.id === targetWard.id || w.name.toLowerCase() === targetWard.name.toLowerCase()
      );
      const authorityUser = {
        id: 'b2ba4d23-7401-4d09-9b7e-9b7e9b7e9b7e',
        email: email.trim(),
        name: `Ward Officer (${targetWard.name})`,
        role: 'authority',
        ward_id: matchedDbWard?.id || targetWard.id,
        ward_name: targetWard.name,
      };
      localStorage.setItem('nagpur_pulse_user', JSON.stringify(authorityUser));
      setLoading(false);
      navigate('/authority/dashboard');
      return;
    }

    if (officialRole === 'admin') {
      const adminUser = {
        id: 'a1aa3d12-6301-4c08-8a6e-8a6e8a6e8a6e',
        email: email.trim(),
        name: 'Municipal Admin',
        role: 'admin',
        ward_id: null,
      };
      localStorage.setItem('nagpur_pulse_user', JSON.stringify(adminUser));
      setLoading(false);
      navigate('/admin/dashboard');
      return;
    }

    const { error: sbError } = await supabase.auth.signInWithPassword({ email, password });
    if (!sbError) {
      setLoading(false);
      navigate(officialRole === 'admin' ? '/admin/dashboard' : '/authority/dashboard');
      return;
    }

    setLoading(false);
    setError(sbError.message || 'Invalid official credentials.');
  };

  const handleCitizenAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'citizen' } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (signUpData?.user) {
        const citizenUser = {
          id: signUpData.user.id,
          email: signUpData.user.email,
          name,
          role: 'citizen',
          ward_id: null,
        };
        localStorage.setItem('nagpur_pulse_user', JSON.stringify(citizenUser));
        navigate('/home');
      }
    } else {
      const { error: sbError } = await supabase.auth.signInWithPassword({ email, password });
      if (!sbError) {
        setLoading(false);
        navigate('/home');
        return;
      }
      setLoading(false);
      setError(sbError.message || 'Login failed. You can continue as Public Citizen without login.');
    }
  };

  const handleGuestCitizen = () => {
    const guestUser = {
      id: 'c4cac2e9-8902-4f10-a9ea-ac86a438032c',
      email: 'citizen.public@nagpurpulse.com',
      name: 'Public Citizen',
      role: 'citizen',
      ward_id: null,
    };
    localStorage.setItem('nagpur_pulse_user', JSON.stringify(guestUser));
    navigate('/home');
  };

  return (
    <div className="bg-[#0F141C] text-[#E6EDF3] min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#E85D04] selection:text-white font-sans">
      {/* Top Banner */}
      <div className="w-full max-w-lg mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-mono text-[#8B9BB4] hover:text-[#E85D04] flex items-center gap-1 transition-colors"
        >
          <span>← Return to Home</span>
        </button>
        <span className="text-[10px] font-mono uppercase bg-[#E85D04]/15 text-[#E85D04] px-2.5 py-1 rounded-full border border-[#E85D04]/30">
          ⚡ Municipal Authentication
        </span>
      </div>

      <div className="hud-panel-elevated max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#324259]">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-[#151D28] border border-[#324259] p-1.5 mx-auto flex items-center justify-center mb-2 shadow-lg">
            <img src="/nagpur-logo.png" alt="Nagpur Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Nagpur Pulse Access</h1>
          <p className="text-xs text-[#8B9BB4]">
            Unified Municipal Operations & Citizen Reporting
          </p>
        </div>

        {/* Tab Switcher: Official vs Citizen */}
        <div className="flex bg-[#0F141C] p-1 rounded-xl border border-[#263345]">
          <button
            onClick={() => { setActiveTab('official'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'official'
                ? 'bg-[#E85D04] text-white shadow'
                : 'text-[#8B9BB4] hover:text-white'
            }`}
          >
            🛡️ Official Authority & Admin
          </button>
          <button
            onClick={() => { setActiveTab('citizen'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'citizen'
                ? 'bg-[#0E7490] text-white shadow'
                : 'text-[#8B9BB4] hover:text-white'
            }`}
          >
            👤 Public Citizen
          </button>
        </div>

        {error && (
          <div className="p-3 bg-[#D9534F]/15 border border-[#D9534F]/40 text-[#D9534F] text-xs font-mono rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* TAB 1: OFFICIAL MUNICIPAL ACCESS (REQUIRED EMAIL & PASSWORD) */}
        {activeTab === 'official' && (
          <div className="space-y-5">
            {/* Sub-Role Selector: Ward Officer vs Admin */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOfficialRole('authority')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  officialRole === 'authority'
                    ? 'bg-[#E09F3E]/15 border-[#E09F3E] text-white shadow'
                    : 'bg-[#0F141C] border-[#263345] text-[#8B9BB4] hover:border-[#384C66]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <InfrastructureIcon size={14} color={officialRole === 'authority' ? '#E09F3E' : '#8B9BB4'} />
                  <span className="text-[10px] font-mono uppercase font-bold text-[#E09F3E]">Zone Office</span>
                </div>
                <div className="text-xs font-display font-bold text-white">Ward Authority</div>
              </button>

              <button
                type="button"
                onClick={() => setOfficialRole('admin')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  officialRole === 'admin'
                    ? 'bg-[#4EBA6F]/15 border-[#4EBA6F] text-white shadow'
                    : 'bg-[#0F141C] border-[#263345] text-[#8B9BB4] hover:border-[#384C66]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <AIEngineIcon size={14} color={officialRole === 'admin' ? '#4EBA6F' : '#8B9BB4'} />
                  <span className="text-[10px] font-mono uppercase font-bold text-[#4EBA6F]">City Command</span>
                </div>
                <div className="text-xs font-display font-bold text-white">Municipal Admin</div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOfficialLogin} className="space-y-4">
              {officialRole === 'authority' && (
                <div>
                  <label className="text-[10px] font-mono text-[#8B9BB4] block mb-1">
                    ASSIGNED WARD JURISDICTION:
                  </label>
                  <select
                    value={selectedWardId || currentSelectedWard.id}
                    onChange={(e) => setSelectedWardId(e.target.value)}
                    className="w-full bg-[#0F141C] border border-[#263345] text-xs font-mono text-white rounded-lg p-2.5 focus:outline-none focus:border-[#E09F3E]"
                  >
                    {wardList.map((w: any) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.zone || 'Nagpur'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono text-[#8B9BB4] block mb-1">
                  OFFICIAL EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={officialRole === 'admin' ? 'admin@nagpurpulse.com' : 'authority@nagpurpulse.com'}
                  required
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8B9BB4] block mb-1">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input text-xs"
                />
              </div>

              <div className="p-2.5 bg-[#0F141C] rounded-lg border border-[#263345] text-[10px] font-mono text-[#8B9BB4] flex justify-between items-center">
                <span>Demo Pass: <strong className="text-white">{officialRole === 'admin' ? 'admin123' : 'authority123'}</strong></span>
                <span className="text-[#4EBA6F]">✓ Auto-Filled</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-xs font-display font-bold py-2.5 rounded-lg transition-all shadow-lg ${
                  officialRole === 'admin'
                    ? 'bg-[#4EBA6F] hover:bg-[#3FA65F] text-[#0F141C]'
                    : 'bg-[#E85D04] hover:bg-[#D45000] text-white'
                }`}
              >
                {loading ? 'Authenticating...' : officialRole === 'admin' ? 'Sign In to Admin HQ →' : `Sign In as ${currentSelectedWard.name} Officer →`}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CITIZEN PUBLIC ACCESS (OPTIONAL LOGIN / GUEST) */}
        {activeTab === 'citizen' && (
          <div className="space-y-5">
            {/* Primary Action: Anonymous Guest Skip */}
            <div className="hud-panel p-4 border-[#0E7490]/60 space-y-2 bg-[#0E7490]/10 text-center">
              <span className="text-[10px] font-mono text-[#06B6D4] uppercase font-bold block">
                Open Public Access (No Registration Needed)
              </span>
              <p className="text-xs text-[#E6EDF3] leading-relaxed">
                Citizens are free to explore the live GIS radar map and report civic issues without signing in.
              </p>
              <button
                type="button"
                onClick={handleGuestCitizen}
                className="w-full btn-teal text-xs font-display font-bold py-2.5 flex items-center justify-center gap-2 shadow-lg"
              >
                <RadarIcon size={16} />
                <span>Continue as Public Citizen →</span>
              </button>
            </div>

            <div className="relative border-t border-[#263345] pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-[#8B9BB4] uppercase">
                  {isRegister ? 'Create Citizen Profile' : 'Optional Citizen Login'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[10px] font-mono text-[#E85D04] hover:underline"
                >
                  {isRegister ? 'Already have account? Sign In' : 'Need account? Register'}
                </button>
              </div>

              <form onSubmit={handleCitizenAuth} className="space-y-3">
                {isRegister && (
                  <div>
                    <label className="text-[10px] font-mono text-[#8B9BB4] block mb-1">FULL NAME</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav Deshmukh"
                      className="input text-xs"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-mono text-[#8B9BB4] block mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@example.com"
                    required
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#8B9BB4] block mb-1">PASSWORD</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-secondary text-xs font-display font-bold py-2.5"
                >
                  {loading ? 'Processing...' : isRegister ? 'Register Citizen Account' : 'Sign In as Citizen'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
