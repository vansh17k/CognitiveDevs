/**
 * ============================================================================
 * LANDING PORTAL - PUBLIC HOMEPAGE (src/app/page.jsx)
 * ============================================================================
 * 
 * Public gateway to Suraksha1:
 * - National statutory banner & ministry credentials
 * - High-impact hero section with direct Scan Package CTA
 * - Quick stats (1,248+ commodities analyzed, 79% compliance rate)
 * - 8 Mandatory PCR Rule 6 cards
 * - Preset sample package showcase
 */

import React from 'react';
import { 
  Scale, 
  Camera, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Lock,
  Layers,
  BookOpen
} from 'lucide-react';
import { Navbar } from '../components/Navbar.jsx';
import { useApp } from './layout.jsx';
import { INITIAL_PRODUCTS } from '../data/products.js';
import { LEGAL_RULES } from '../data/rules.js';

export default function LandingPage() {
  const { navigate, startNewScan } = useApp();

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/25 to-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#0d4734] text-xs font-mono font-bold shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-[#0d4734]" />
                <span>LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                AI-Powered Packaging Compliance for <span className="text-[#0d4734]">Legal Metrology</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Automated statutory inspection engine under Rule 6 of PCR, 2011. Instantaneously verify mandatory declarations, font heights, Unit Sale Price (USP), and generate Form-V statutory notices.
              </p>

              {/* Action Triggers */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('scan')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0d4734] hover:bg-[#083325] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan Commodity Package</span>
                </button>
                <button
                  onClick={() => navigate('rules')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm shadow-xs transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>Explore PCR 2011 Rules</span>
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block text-xl sm:text-2xl font-extrabold font-mono text-slate-900">1,248+</span>
                  <span className="text-[11px] text-slate-500 font-medium">Commodities Audited</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-extrabold font-mono text-emerald-700">79.0%</span>
                  <span className="text-[11px] text-slate-500 font-medium">State Compliance Rate</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-extrabold font-mono text-slate-900">&lt; 3.0s</span>
                  <span className="text-[11px] text-slate-500 font-medium">OCR Verification</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase">Live OCR Inspector</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Rule 6 Active
                  </span>
                </div>

                {/* Sample visual display */}
                <div className="mt-4 p-3 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center aspect-4/3">
                  <img
                    src="/images/products/amul.png"
                    alt="Sample verified package"
                    className="w-full h-full object-contain"
                  />
                  {/* Bounding box simulation */}
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/5 border-2 border-emerald-400 bg-emerald-400/20 rounded flex items-start p-1">
                    <span className="bg-slate-900 text-white text-[8px] font-mono px-1 rounded">
                      Net Qty: 500 g (PASS)
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">Max Retail Price (MRP)</span>
                    <span className="font-mono font-bold text-slate-900">₹275.00 (Incl. Taxes)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <span className="font-semibold">Compliance Status</span>
                    <span className="font-mono font-bold">100% COMPLIANT</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('dashboard')}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Open Officer Control Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8 Mandatory Rule 6 Declarations Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#0d4734] uppercase tracking-wider">
              Statutory Verification Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              8 Mandatory Rule 6 Packaging Declarations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every pre-packaged commodity sold in the Republic of India is rigorously evaluated against these statutory standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEGAL_RULES.slice(0, 8).map((rule, idx) => (
              <div key={rule.code} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0d4734] hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rule.code}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Clause #{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors line-clamp-2">
                  {rule.name}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {rule.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-rose-700 font-medium">
                  Fine: {rule.penalty.split(';')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Preset Commodities Showcase */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#0d4734] uppercase tracking-wider">
                Field Test Suite
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Sample Pre-Packaged Commodities
              </h2>
            </div>
            <button
              onClick={() => navigate('scan')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d4734] hover:underline"
            >
              <span>Test with Custom Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INITIAL_PRODUCTS.map((p) => {
              const isCompliant = p.complianceScore >= 90 && p.violations.length === 0;
              return (
                <div 
                  key={p.id}
                  onClick={() => startNewScan(p.image, p.name, p.id)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#0d4734] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-28 bg-slate-50 rounded-xl mb-3 p-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0d4734] line-clamp-2">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Brand: {p.brand}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 font-bold">₹{p.mrpValue}</span>
                    <span className={`font-mono font-bold ${isCompliant ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {p.complianceScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <Scale className="w-5 h-5 text-amber-300" />
              <span className="font-extrabold text-sm">LS Enforcement</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Suraksha1 under the Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase text-[11px] font-mono mb-3">Statutory Framework</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>Legal Metrology Act, 2009</li>
              <li>Packaged Commodities Rules, 2011</li>
              <li>PCR Amendment 2021 (USP Mandate)</li>
              <li>Section 36 & 48 Penal Code</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase text-[11px] font-mono mb-3">Inspector Tools</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li onClick={() => navigate('scan')} className="hover:text-white cursor-pointer">AI Packaging Scanner</li>
              <li onClick={() => navigate('dashboard')} className="hover:text-white cursor-pointer">Compliance Dashboard</li>
              <li onClick={() => navigate('rules')} className="hover:text-white cursor-pointer">Statutory Rules Library</li>
              <li onClick={() => navigate('login')} className="hover:text-white cursor-pointer">Login</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase text-[11px] font-mono mb-3">National Helpline</h5>
            <p className="text-[11px] text-slate-300">National Consumer Helpline (NCH):</p>
            <p className="font-mono text-emerald-400 font-bold mt-0.5">1800-11-4000 (Toll Free)</p>
            <p className="text-[10px] text-slate-500 mt-2">© 2026 Legal Metrology Division. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
