import React, { useState, useEffect } from 'react';
import { useApp } from '../App.jsx';
import { 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Scale, 
  Zap,
  ExternalLink
} from 'lucide-react';
import { Emblem } from '../components.jsx';

export const Login = () => {
  const { 
    login, 
    navigate,
    loginInitialRole
  } = useApp();

  // Portal mode: 'enforcement' (Officer) vs 'fbo' (Food Business Operator)
  const [portalMode, setPortalMode] = useState(
    loginInitialRole === 'fbo' ? 'fbo' : 'enforcement'
  );

  // Active officer role selection: 'inspector' or 'dgm'
  const [selectedOfficer, setSelectedOfficer] = useState('inspector');

  // Input states
  const [email, setEmail] = useState('inspector@lmcc.demo');
  const [password, setPassword] = useState('demo123');
  const [rememberSession, setRememberSession] = useState(true);

  // Sync when initial role changes externally
  useEffect(() => {
    if (loginInitialRole === 'fbo') {
      setPortalMode('fbo');
      setEmail('fbo@lmcc.demo');
    } else if (loginInitialRole === 'dgm') {
      setPortalMode('enforcement');
      setSelectedOfficer('dgm');
      setEmail('dgm@lmcc.demo');
    } else if (loginInitialRole === 'inspector') {
      setPortalMode('enforcement');
      setSelectedOfficer('inspector');
      setEmail('inspector@lmcc.demo');
    }
  }, [loginInitialRole]);

  // Handle switching portal mode
  const handlePortalSwitch = (mode) => {
    setPortalMode(mode);
    if (mode === 'fbo') {
      setEmail('fbo@lmcc.demo');
    } else {
      setEmail(selectedOfficer === 'dgm' ? 'dgm@lmcc.demo' : 'inspector@lmcc.demo');
    }
  };

  // Handle quick 1-click demo login click
  const handleSelectOfficer = (officerType) => {
    setSelectedOfficer(officerType);
    setEmail(officerType === 'dgm' ? 'dgm@lmcc.demo' : 'inspector@lmcc.demo');
  };

  // Submit login form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (portalMode === 'fbo') {
      login(email || 'fbo@lmcc.demo', 'fbo');
    } else {
      const role = selectedOfficer === 'dgm' ? 'dgm' : 'inspector';
      login(email || (role === 'dgm' ? 'dgm@lmcc.demo' : 'inspector@lmcc.demo'), role);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      {/* Statutory Header */}
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="SURAKSHA1 Logo" 
              className="w-11 h-11 object-contain shrink-0" 
              referrerPolicy="no-referrer" 
            />
            <div className="border-l border-slate-300 pl-3 leading-tight">
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-wide">
                विधिक मापविज्ञान प्रभाग • LEGAL METROLOGY DIVISION
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                उपभोक्ता मामले विभाग • Ministry of Consumer Affairs, Food & Public Distribution
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('landing')}
            className="text-xs font-semibold text-[#0d4734] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>← Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4 sm:my-8">
        <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* ================= LEFT BRANDING COLUMN ================= */}
          <div className="md:col-span-5 bg-[#0a1628] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Top decorative aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="space-y-6 relative z-10">
              {/* Brand Header with Emblem */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-500/30 flex items-center justify-center p-1 shadow-sm shrink-0">
                  <img 
                    src="/images/logo.png" 
                    alt="SURAKSHA1 Logo" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white leading-tight">
                    {portalMode === 'fbo' ? 'Suraksha1 FBO Portal' : 'Suraksha1 Enforcement'}
                  </h2>
                  <p className="text-xs font-semibold text-emerald-400">
                    Legal Metrology PCR-2011
                  </p>
                </div>
              </div>

              {/* Statutory Badge */}
              <div>
                <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider bg-[#0e2a22] border border-emerald-500/30 text-emerald-300">
                  {portalMode === 'fbo' ? 'OFFICIAL STATUTORY SELF-COMPLIANCE' : 'OFFICIAL STATUTORY ENFORCEMENT'}
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {portalMode === 'fbo' ? (
                    'Pre-Market Commodity Compliance'
                  ) : (
                    'AI-Assisted Commodity Screening'
                  )}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {portalMode === 'fbo' ? (
                    'Empowering packaged commodity manufacturers, packers, and brand owners with automated PCR label validation and notice resolution.'
                  ) : (
                    'Empowering state enforcement officers with automated OCR extraction, legal rule validation, and digital evidence reporting.'
                  )}
                </p>
              </div>

              {/* Checklist points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Packaged Commodities Rules, 2011 (Rule 6)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {portalMode === 'fbo' 
                      ? 'Pre-print Label Artwork Validation' 
                      : 'Multi-layer Tokenization & OCR Extraction'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {portalMode === 'fbo'
                      ? 'Statutory Notice & Compounding Desk'
                      : 'Legally Admissible Violation & Audit Memos'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footnote */}
            <div className="pt-8 mt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>National Informatics Center</span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded">
                PCR-2011 SECURE
              </span>
            </div>
          </div>

          {/* ================= RIGHT FORM COLUMN ================= */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Top Row: Portal Access Label & Active Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase">
                  SELECT PORTAL ACCESS:
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {portalMode === 'fbo' ? 'Active: FBO Portal' : 'Active: Enforcement'}
                </span>
              </div>

              {/* Portal Access Switcher Tabs */}
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 mb-6">
                <button
                  type="button"
                  id="tab-enforcement"
                  onClick={() => handlePortalSwitch('enforcement')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    portalMode === 'enforcement'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Enforcement Officer</span>
                </button>

                <button
                  type="button"
                  id="tab-fbo"
                  onClick={() => handlePortalSwitch('fbo')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    portalMode === 'fbo'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>FBO Portal</span>
                </button>
              </div>

              {/* Heading & Subtitle */}
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {portalMode === 'fbo' ? 'FBO Sign In' : 'Officer Sign In'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {portalMode === 'fbo' 
                    ? 'Sign in to access pre-market label validation and regulatory notices.'
                    : 'Sign in to access the state Legal Metrology inspection dashboard.'}
                </p>
              </div>

              {/* QUICK 1-CLICK DEMO LOGINS Box */}
              <div className="border border-slate-200 bg-slate-50/60 rounded-2xl p-3.5 sm:p-4 mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
                    QUICK 1-CLICK DEMO LOGINS:
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    INSTANT FILL
                  </span>
                </div>

                {portalMode === 'enforcement' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Inspector A Card */}
                    <div
                      id="demo-login-inspector"
                      onClick={() => handleSelectOfficer('inspector')}
                      className={`p-3 rounded-xl transition-all cursor-pointer text-left ${
                        selectedOfficer === 'inspector'
                          ? 'border-2 border-emerald-600 bg-emerald-50/40 shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Inspector A
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Field
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-600 truncate">
                        inspector@lmcc.demo
                      </div>
                    </div>

                    {/* DLMO Officer Card */}
                    <div
                      id="demo-login-dgm"
                      onClick={() => handleSelectOfficer('dgm')}
                      className={`p-3 rounded-xl transition-all cursor-pointer text-left ${
                        selectedOfficer === 'dgm'
                          ? 'border-2 border-emerald-600 bg-emerald-50/40 shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          DLMO(District Legal Metrology Officer)
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Authority
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-600 truncate">
                        dgm@lmcc.demo
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FBO Quick Demo Card */
                  <div
                    id="demo-login-fbo"
                    onClick={() => setEmail('fbo@lmcc.demo')}
                    className="p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/40 shadow-xs transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        Apex Nutrition & Agro Foods
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Packer / MFR
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-600 truncate">
                      fbo@lmcc.demo
                    </div>
                  </div>
                )}
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {portalMode === 'fbo' ? 'Registered FBO Email Address' : 'Official Officer Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@lmcc.demo"
                      className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden font-mono text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Demo credentials: password is demo123')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Remember Session Checkbox */}
                <div className="flex items-center justify-between text-xs py-1">
                  <label className="flex items-center gap-2.5 text-slate-700 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Remember session for 30 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-5 bg-[#0d4734] hover:bg-[#083325] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {portalMode === 'fbo' 
                        ? 'Sign In to FBO Portal' 
                        : 'Sign In to Enforcement Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Consumer Access Link */}
            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Looking for public commodity check?</span>
              <button
                type="button"
                id="btn-citizen-login"
                onClick={() => login('consumer@citizen.in', 'consumer')}
                className="px-3 py-1.5 text-xs font-bold text-[#0d4734] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Citizen Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0d4734]" />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Statutory Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-[11px] text-slate-500 shrink-0">
        Legal Metrology Compliance & Verification System (Suraksha1) • Government of India
      </footer>
    </div>
  );
};
