/**
 * ============================================================================
 * ENFORCEMENT OFFICERS DIRECTORY (src/app/users/page.jsx)
 * ============================================================================
 * 
 * Roster of State Legal Metrology Officers, Field Inspectors, and Administrators.
 */

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Award, 
  Search, 
  UserCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { SearchBar } from '../../components/SearchBar.jsx';
import { INITIAL_USERS } from '../../data/products.js';

export default function UsersPage() {
  const { users, currentUser, switchUserRole, showToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) => {
    return (
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.badgeNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.division || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Legal Metrology Enforcement Officers
              </h2>
              <p className="text-xs text-slate-500">
                Authorized field inspectors and jurisdictional division heads
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search officer by name, badge number, or jurisdictional division..."
            />
          </div>

          {/* Officers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map((u) => {
              const isActive = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isActive ? 'border-[#0d4734] ring-2 ring-[#0d4734]/15' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Badge header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 font-mono">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                          <span className="text-[10px] font-mono text-slate-500 block">Badge: {u.badgeNumber}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-[#0d4734] border border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.division}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px] truncate">{u.email}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Audits Performed:</span>
                      <span className="font-bold text-[#0d4734]">{u.inspectionsCount || 84}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Active Session Profile</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => switchUserRole(u.role)}
                        className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-[#0d4734] hover:text-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Switch to this Officer Profile
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
