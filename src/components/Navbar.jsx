/**
 * ============================================================================
 * NAVBAR COMPONENT - STATUTORY LANDING HEADER
 * ============================================================================
 * 
 * Header navigation bar for the public landing portal, featuring:
 * - National Legal Metrology Emblem & title
 * - Portal anchor links (Home, Features, PCR Rules, FAQ, Contact)
 * - Inspector Login CTA and quick access
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  LogIn, 
  Menu, 
  X, 
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';
import { useApp } from '../app/layout.jsx';

export const Navbar = () => {
  const { navigate, openAboutModal, openContactModal, openFeaturesModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Ministry Banner */}
      <div className="bg-[#0d4734] text-white px-4 py-1 text-[11px] font-mono flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Government of India • Ministry of Consumer Affairs, Food & Public Distribution</span>
          <span className="hidden md:inline text-emerald-200">| Legal Metrology Division (PCR 2011)</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand Identity */}
        <div 
          onClick={() => navigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src="/images/logo.png" 
            alt="SURAKSHA1 Logo" 
            className="w-10 h-10 object-contain shrink-0" 
            referrerPolicy="no-referrer" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">Suraksha1</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-[#0d4734] border border-emerald-200">
                PCR-2011
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Legal Metrology Compliance</p>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button 
            onClick={() => navigate('landing')} 
            className="hover:text-[#0d4734] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={openFeaturesModal} 
            className="hover:text-[#0d4734] transition-colors cursor-pointer"
          >
            Key Capabilities
          </button>
          <button 
            onClick={() => navigate('rules')} 
            className="hover:text-[#0d4734] transition-colors cursor-pointer"
          >
            Statutory Rules
          </button>
          <button 
            onClick={openAboutModal} 
            className="hover:text-[#0d4734] transition-colors cursor-pointer"
          >
            About PCR 2011
          </button>
          <button 
            onClick={openContactModal} 
            className="hover:text-[#0d4734] transition-colors cursor-pointer"
          >
            Help & Contacts
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => navigate('login')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Inspector Portal</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-xs font-semibold text-slate-700">
          <button 
            onClick={() => { navigate('landing'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#0d4734]"
          >
            Home
          </button>
          <button 
            onClick={() => { openFeaturesModal(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#0d4734]"
          >
            Key Capabilities
          </button>
          <button 
            onClick={() => { navigate('rules'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#0d4734]"
          >
            Statutory Rules
          </button>
          <button 
            onClick={() => { openAboutModal(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#0d4734]"
          >
            About PCR 2011
          </button>
          <button 
            onClick={() => { openContactModal(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#0d4734]"
          >
            Contact
          </button>
          <div className="pt-2">
            <button
              onClick={() => { navigate('login'); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0d4734] text-white text-xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Inspector Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
