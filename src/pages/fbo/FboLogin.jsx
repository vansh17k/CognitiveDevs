import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Info,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Emblem } from '../../components.jsx';

export const FboLogin = () => {
  const { navigate, addToast } = useApp();

  const [email, setEmail] = useState('fbo@lmcc.demo');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // New Registration form state
  const [regData, setRegData] = useState({
    businessName: '',
    fssaiLicense: '',
    email: '',
    phone: '',
    category: 'Manufacturer / Processor'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'FBO Session Initialized',
      description: `Welcome back, Apex Nutrition & Agro Foods Pvt. Ltd.`
    });
    navigate('fbo-dashboard');
  };

  const handleDemoLogin = () => {
    setEmail('fbo@lmcc.demo');
    setPassword('demo123');
    addToast({
      type: 'info',
      title: 'Demo FBO Credentials Loaded',
      description: 'Signing in to Apex Nutrition & Agro Foods self-service portal.'
    });
    setTimeout(() => {
      navigate('fbo-dashboard');
    }, 400);
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('landing')}
          >
            <img 
              src="/images/logo.png" 
              alt="SURAKSHA1 Logo" 
              className="w-9 h-9 object-contain shrink-0" 
              referrerPolicy="no-referrer" 
            />
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight">FBO Compliance Portal</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FOOD BUSINESS OPERATOR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('login')}
              className="text-xs font-semibold text-slate-600 hover:text-[#0d4734] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Official Inspector Login</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <div className="my-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-0 bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          
          {/* Left Hero / Brand Card */}
          <div className="md:col-span-5 bg-[#0d4734] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 text-white shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">FSSAI & Metrology</h2>
                  <p className="text-[11px] text-emerald-300 font-medium">Business Self-Service Hub</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-[#083325] px-2.5 py-1 rounded-md border border-[#145741] font-mono">
                  FOOD BUSINESS OPERATOR
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  AI Pre-Compliance & Label Readiness
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Identify potential packaging & nutritional non-conformances before official inspector audits and submit digital corrective action plans (CAPA).
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant AI Pre-Compliance Checks on labels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Digital response to official inspection notices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Track CAPA workflows & lab certificates</span>
                </div>
              </div>
            </div>

            {/* FBO Disclaimer */}
            <div className="pt-6 mt-6 border-t border-[#145741] text-[11px] text-emerald-200/80 leading-relaxed relative z-10">
              <p className="flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pre-compliance screening is advisory and does not replace statutory FSSAI or Legal Metrology officer determinations.</span>
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            
            <div className="space-y-1 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0d4734] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  FOOD BUSINESS OPERATOR
                </span>
                <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Self-Service Portal
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-500">
                Manage your food compliance, products and corrective actions.
              </p>
            </div>

            {/* 1-Click Demo Login Card */}
            <div className="mb-5 bg-gradient-to-r from-emerald-50/80 via-slate-50 to-emerald-50/40 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0d4734] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  FBO
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Demo FBO</span>
                    <span className="text-[10px] text-[#0d4734] font-semibold bg-emerald-100/70 px-1.5 py-0.2 rounded">Apex Agro Foods</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600">fbo@lmcc.demo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="px-3.5 py-1.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Quick Log In</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. fbo@lmcc.demo"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:border-transparent focus:outline-hidden transition-all text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:border-transparent focus:outline-hidden transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0d4734] focus:ring-[#0d4734] w-3.5 h-3.5 accent-[#0d4734]"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-semibold text-[#0d4734] hover:text-[#083325] cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0d4734] hover:bg-[#083325] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to FBO Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-center text-xs text-slate-600 gap-1.5">
                <span>New food manufacturer or importer?</span>
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="font-bold text-[#0d4734] hover:text-[#083325] hover:underline cursor-pointer"
                >
                  Create FBO Account
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-[11px] text-slate-500">
        FBO Self-Service Compliance System &copy; 2026. Designed for Food Business Operators under FSSAI & Legal Metrology regulations.
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
                className="text-slate-400 hover:text-slate-600 p-1"
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
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl hover:bg-[#083325] font-semibold shadow-xs"
                >
                  Register FBO Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Reset Password</h3>
            <p className="text-slate-600 mb-4">
              Demo environment password is <strong>demo123</strong> for <code>fbo@lmcc.demo</code>.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#0d4734] text-white font-semibold rounded-lg hover:bg-[#083325]"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
