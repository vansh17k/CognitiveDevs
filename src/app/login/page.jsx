/**
 * ============================================================================
 * OFFICER LOGIN PAGE (src/app/login/page.jsx)
 * ============================================================================
 * 
 * Secure portal entry for authorized Legal Metrology Field Inspectors
 * and State Directorate Administrators.
 */

import React, { useState } from 'react';
import { Scale, Lock, Mail, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Navbar } from '../../components/Navbar.jsx';

export default function LoginPage() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('inspector@lmcc.demo');
  const [role, setRole] = useState('inspector');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, role);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          {/* Header Emblem */}
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-[#0d4734] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Scale className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Officer Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              State Legal Metrology Enforcement Portal (PCR 2011)
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@legalmetrology.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#0d4734] outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Access Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setRole('inspector'); setEmail('inspector@lmcc.demo'); }}
                  className={`p-3 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                    role === 'inspector' 
                      ? 'border-[#0d4734] bg-emerald-50 text-[#0d4734]' 
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-extrabold">Field Inspector</span>
                  <span className="text-[10px] text-slate-500 font-normal">Zone 1 Jurisdiction</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('admin'); setEmail('admin@lmcc.demo'); }}
                  className={`p-3 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                    role === 'admin' 
                      ? 'border-[#0d4734] bg-emerald-50 text-[#0d4734]' 
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-extrabold">Director / Admin</span>
                  <span className="text-[10px] text-slate-500 font-normal">State Headquarters</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 rounded-xl bg-[#0d4734] hover:bg-[#083325] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter Terminal</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl">
            <span className="font-mono font-bold text-slate-700 block">Test Access Profiles:</span>
            <p>• Inspector: <code className="text-slate-800 font-bold">inspector@lmcc.demo</code></p>
            <p>• Director: <code className="text-slate-800 font-bold">admin@lmcc.demo</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
