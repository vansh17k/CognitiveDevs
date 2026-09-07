import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Shield,
  BadgeCheck,
  Info,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Emblem, ToastContainer } from '../components.jsx';

export const Login = () => {
  const { 
    login, 
    navigate,
    addToast
  } = useApp();

  // Active Login Portal: 'enforcement' (Inspector/DGM) or 'fbo' (Food Business Operator)
  const [activePortal, setActivePortal] = useState('enforcement');
  
  // Enforcement credentials
  const [email, setEmail] = useState('inspector@lmcc.demo');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState('inspector');
  const [rememberMe, setRememberMe] = useState(true);

  // FBO Registration modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regData, setRegData] = useState({
    businessName: '',
    fssaiLicense: '',
    email: '',
    phone: '',
    category: 'Manufacturer / Processor'
  });

  const handleEnforcementSubmit = (e) => {
    e.preventDefault();
    login(email, role);
  };

  const handleFboSubmit = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'FBO Session Initialized',
      description: 'Welcome back, Apex Nutrition & Agro Foods Pvt. Ltd.'
    });
    navigate('fbo-dashboard');
  };

  const setDemoInspector = () => {
    setEmail('inspector@lmcc.demo');
    setPassword('demo123');
    setRole('inspector');
  };

  const setDemoDGM = () => {
    setEmail('dgm@lmcc.demo');
    setPassword('demo123');
    setRole('dgm');
  };

  const setDemoFbo = () => {
    setEmail('fbo@lmcc.demo');
    setPassword('demo123');
    setRole('fbo');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsRegisterOpen(false);
    addToast({
      type: 'success',
      title: 'FBO Account Registered',
      description: `FBO ID #FBO-IND-2026-${Math.floor(1000 + Math.random() * 9000)} generated. You can now log in.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('landing')}
          >
            <Emblem size={28} className="text-slate-800" />
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-800 tracking-tight leading-none">LexiScan</span>
              <span className="text-[10px] text-slate-500 font-medium">Govt. of India</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('landing')}
              className="text-xs font-semibold text-[#0d4734] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>← Back to Public Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="my-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-0 bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
        
        {/* Left Branding Column */}
        <div className={`md:col-span-5 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
          activePortal === 'fbo' ? 'bg-[#0d4734]' : 'bg-slate-900'
        }`}>
          {/* Subtle Background Rings */}
          <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            activePortal === 'fbo' ? 'bg-emerald-400/20' : 'bg-emerald-700/20'
          }`} />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border text-white shadow-sm ${
                activePortal === 'fbo' ? 'bg-white/10 border-white/20' : 'bg-[#0d4734] border-emerald-600'
              }`}>
                {activePortal === 'fbo' ? <Building2 className="w-5 h-5" /> : <Emblem size={24} className="text-white" />}
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white">
                  {activePortal === 'fbo' ? 'FBO Compliance Hub' : 'LexiScan Enforcement'}
                </h2>
                <p className="text-[11px] text-emerald-300 font-medium">
                  {activePortal === 'fbo' ? 'FSSAI & Metrology Business Portal' : 'Legal Metrology PCR-2011'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-white/10 px-2.5 py-1 rounded-md border border-white/15 font-mono inline-block">
                {activePortal === 'fbo' ? 'Food Business Operator Portal' : 'Official Statutory Enforcement'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {activePortal === 'fbo' 
                  ? 'Self-Service Packaging Pre-Compliance' 
                  : 'AI-Assisted Commodity Screening'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activePortal === 'fbo'
                  ? 'Verify product labels against PCR 2011, resolve inspector non-conformances, and submit digital Corrective Action Plans (CAPA).'
                  : 'Empowering state enforcement officers with automated OCR extraction, legal rule validation, and digital evidence reporting.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {activePortal === 'fbo' ? (
                <>
                  <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant AI Pre-Compliance Checks on labels</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Digital responses to official inspection notices</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Track CAPA workflows & legal certificates</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Packaged Commodities Rules, 2011 (Rule 6)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-layer Tokenization & OCR Extraction</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Legally Admissible Violation & Audit Memos</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-emerald-200/80 relative z-10">
            {activePortal === 'fbo'
              ? 'FSSAI & Legal Metrology FBO Self-Service System'
              : 'Authorized personnel and state enforcement officers only.'}
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Main Portal Selection Tabs */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Select Portal Access:
              </span>
              <span className="text-[10px] font-mono font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active: {activePortal === 'fbo' ? 'FBO Portal' : 'Enforcement'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActivePortal('enforcement');
                  setEmail('inspector@lmcc.demo');
                  setPassword('demo123');
                  setRole('inspector');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePortal === 'enforcement'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#0d4734]" />
                <span>Enforcement Officer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal('fbo');
                  setEmail('fbo@lmcc.demo');
                  setPassword('demo123');
                  setRole('fbo');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePortal === 'fbo'
                    ? 'bg-[#0d4734] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0d4734] hover:bg-white/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>FBO Portal</span>
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1 mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activePortal === 'fbo' ? 'FBO Portal Sign In' : 'Officer Sign In'}
            </h2>
            <p className="text-xs text-slate-500">
              {activePortal === 'fbo'
                ? 'Sign in to access your FBO packaging compliance workspace.'
                : 'Sign in to access the state Legal Metrology inspection dashboard.'}
            </p>
          </div>

          {/* 1-Click Demo Accounts Selector */}
          <div className="mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Quick 1-Click Demo Logins:</span>
              <span className="text-[9px] text-[#0d4734] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                Instant Fill
              </span>
            </div>

            {activePortal === 'enforcement' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={setDemoInspector}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    role === 'inspector'
                      ? 'bg-emerald-50/70 border-emerald-300 text-[#0d4734] font-bold ring-1 ring-[#0d4734]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>Inspector A</span>
                    <span className="text-[9px] bg-emerald-100 text-[#0d4734] px-1 py-0.2 rounded font-mono">Field</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">inspector@lmcc.demo</div>
                </button>

                <button
                  type="button"
                  onClick={setDemoDGM}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    role === 'dgm'
                      ? 'bg-emerald-50/70 border-emerald-300 text-[#0d4734] font-bold ring-1 ring-[#0d4734]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>DGM Officer</span>
                    <span className="text-[9px] bg-emerald-100 text-[#0d4734] px-1 py-0.2 rounded font-mono">Authority</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">dgm@lmcc.demo</div>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={setDemoFbo}
                className="w-full p-2.5 rounded-xl text-left border bg-emerald-50/80 border-emerald-300 text-[#0d4734] font-bold ring-1 ring-[#0d4734] transition-all text-xs cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Apex Nutrition & Agro Foods</span>
                    <span className="text-[9px] bg-[#0d4734] text-white px-1.5 py-0.2 rounded font-mono">FBO</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-mono">fbo@lmcc.demo (License #10020022001948)</div>
                </div>
                <span className="text-[10px] font-bold bg-white text-[#0d4734] px-2 py-1 rounded-md border border-emerald-200 shrink-0">
                  Select
                </span>
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={activePortal === 'fbo' ? handleFboSubmit : handleEnforcementSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {activePortal === 'fbo' ? 'Registered FBO Enterprise Email' : 'Official Officer Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activePortal === 'fbo' ? 'fbo@lmcc.demo' : 'inspector@lmcc.demo'}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5338E8] focus:border-[#5338E8] focus:outline-hidden font-mono text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo password is: demo123')}
                  className="text-xs font-semibold text-[#5338E8] hover:underline cursor-pointer"
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
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5338E8] focus:border-[#5338E8] focus:outline-hidden text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#5338E8] focus:ring-[#5338E8] w-4 h-4 accent-[#5338E8]"
                />
                <span>Remember session for 30 days</span>
              </label>
            </div>

            {/* Action Buttons Section */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full h-12 py-3 px-5 bg-[#5338E8] hover:bg-[#4338CA] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {activePortal === 'enforcement' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Inspection Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span>Sign In to FBO Compliance Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-[11px] text-slate-500">
        Legal Metrology & Food Business Compliance System &copy; 2026. Ministry of Consumer Affairs & FSSAI Aligned.
      </footer>

      {/* Create FBO Account Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0d4734] text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Create FBO Account</h3>
              </div>
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Nutrition & Agro Foods Pvt. Ltd."
                  value={regData.businessName}
                  onChange={e => setRegData({ ...regData, businessName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">14-Digit FSSAI License / Registration No. *</label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  placeholder="e.g. 10020022001948"
                  value={regData.fssaiLicense}
                  onChange={e => setRegData({ ...regData, fssaiLicense: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.in"
                    value={regData.email}
                    onChange={e => setRegData({ ...regData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={regData.phone}
                    onChange={e => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Business Category</label>
                <select
                  value={regData.category}
                  onChange={e => setRegData({ ...regData, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                >
                  <option>Manufacturer / Processor</option>
                  <option>Packer / Relabeller</option>
                  <option>Importer of Packaged Foods</option>
                  <option>Distributor / Wholesaler</option>
                  <option>E-Commerce Food Business Operator</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl hover:bg-[#083325] font-semibold shadow-xs cursor-pointer"
                >
                  Register FBO Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

