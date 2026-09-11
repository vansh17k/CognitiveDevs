/**
 * ============================================================================
 * SIDEBAR COMPONENT - INSPECTION DASHBOARD NAVIGATION
 * ============================================================================
 * 
 * Provides quick access to all 12 inspector tools:
 * - Dashboard Overview
 * - AI Packaging Scanner
 * - Inspection Results
 * - Report & Notice Generator
 * - Audit History
 * - Non-Compliance Register
 * - Products Catalog
 * - Analytics & Trends
 * - Statutory Rules Library
 * - Enforcement Personnel
 * - Officer Profile & Settings
 * - Help & SOP
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  FileCheck, 
  FileText, 
  History as HistoryIcon, 
  AlertTriangle, 
  BarChart3, 
  Boxes, 
  BookOpen, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  HelpCircle,
  Scale,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../app/layout.jsx';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentPage, navigate, logout, currentUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Package', icon: Camera, badge: 'AI OCR' },
    { id: 'result', label: 'OCR Extraction', icon: FileCheck },
    { id: 'reports', label: 'Statutory Reports', icon: FileText },
    { id: 'history', label: 'Audit History', icon: HistoryIcon },
    { id: 'violations', label: 'Violations Register', icon: AlertTriangle },
    { id: 'products', label: 'Commodities Catalog', icon: Boxes },
    { id: 'analytics', label: 'Compliance Analytics', icon: BarChart3 },
    { id: 'rules', label: 'PCR 2011 Rules', icon: BookOpen },
    { id: 'users', label: 'Enforcement Officers', icon: UsersIcon },
    { id: 'settings', label: 'Station Settings', icon: SettingsIcon },
    { id: 'help', label: 'Help & Guidelines', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#05291D] text-white flex flex-col transition-transform duration-200 ease-in-out border-r border-[#0A4D38]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#0A4D38] flex items-center justify-between">
          <div 
            onClick={() => { navigate('landing'); if (onClose) onClose(); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-emerald-400/40 flex items-center justify-center p-0.5 shadow-xs shrink-0">
              <img src="/images/logo.png" alt="SURAKSHA1 Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">Suraksha1</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#04251a] text-emerald-300 border border-emerald-500/30">
                  OFFICER
                </span>
              </div>
              <p className="text-[10px] font-mono text-emerald-300/80">Legal Metrology Gov</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400/70 font-bold">
            Inspection Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  if (onClose) onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group
                  ${isActive 
                    ? 'bg-[#047857] text-white shadow-sm ring-1 ring-emerald-400/40 font-bold' 
                    : 'text-[#A3D9C2] hover:bg-[#084734] hover:text-white'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-[#8BBEA8] group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-[#04251a] text-emerald-200 border border-emerald-400/30' : 'bg-[#04251a] text-[#34D399] border border-emerald-500/20'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[#0A4D38] bg-[#042017]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#063324] border border-[#0B4533]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#047857] text-emerald-100 border border-emerald-400/40 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.charAt(0) || 'I'}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Inspector Rajesh'}</p>
                <p className="text-[10px] font-mono text-emerald-300 truncate">{currentUser?.division || 'Central Zone'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
