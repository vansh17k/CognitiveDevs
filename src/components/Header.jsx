/**
 * ============================================================================
 * HEADER COMPONENT - INSPECTION DASHBOARD TOP BAR
 * ============================================================================
 * 
 * Top bar for authenticated pages featuring:
 * - Mobile sidebar toggle
 * - Home menu trigger (direct navigation to home on 3-line click)
 * - Quick role switcher (Inspector / Administrator)
 * - Active statutory regulation status
 * - Quick Scan CTA
 */

import React from 'react';
import { 
  Menu, 
  Camera, 
  ShieldCheck, 
  Bell, 
  Home,
  ArrowLeft,
  UserCheck,
  Search
} from 'lucide-react';
import { useApp } from '../app/layout.jsx';

export const Header = ({ onToggleSidebar }) => {
  const { navigate, goBack, currentUser, switchUserRole, startNewScan } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        {/* Top Left Back Button */}
        <button
          onClick={goBack}
          title="Go Back"
          className="px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0d4734] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            PCR-2011 Active Engine
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Top Right Home Button */}
        <button
          onClick={() => navigate('landing')}
          title="Go to Home"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#05291D] hover:bg-[#063A2A] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-[#0A4D38]"
        >
          <Home className="w-3.5 h-3.5 text-emerald-300" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>
    </header>
  );
};
