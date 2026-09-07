/**
 * ============================================================================
 * VIOLATIONS REGISTER PAGE (src/app/violations/page.jsx)
 * ============================================================================
 * 
 * Comprehensive taxonomy of statutory infractions under PCR 2011:
 * - Search by Rule (Rule 6(1)(a), Rule 6(1)(c), Rule 6(1)(e), Rule 6(1)(n)...)
 * - Severity filters (Critical, High, Medium)
 * - AI legal explainability triggers
 * - Compounding penalties & legal citations
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Scale, 
  Search, 
  Sparkles, 
  Filter, 
  BookOpen, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { SearchBar } from '../../components/SearchBar.jsx';
import { COMMON_VIOLATIONS } from '../../data/violations.js';

export default function ViolationsPage() {
  const { explainViolation, navigate } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  const filteredViolations = COMMON_VIOLATIONS.filter((v) => {
    const matchesSearch = 
      (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.rule || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'All' || (v.severity || '').toLowerCase() === selectedSeverity.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Statutory Infractions & Non-Compliance Register
              </h2>
              <p className="text-xs text-slate-500">
                Official classification of Legal Metrology (Packaged Commodities) infractions with penal liabilities
              </p>
            </div>

            <button
              onClick={() => navigate('rules')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Statutory Rulebook</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-96">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search infractions by rule, title, or penalty..."
              />
            </div>
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="text-slate-400 font-mono text-[11px] uppercase">Severity:</span>
              {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    selectedSeverity === sev
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Violations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredViolations.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0d4734] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {v.rule}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        v.severity === 'Critical' 
                          ? 'bg-rose-600 text-white' 
                          : v.severity === 'High' 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-slate-700 text-white'
                      }`}>
                        {v.severity} Severity
                      </span>
                    </div>

                    <button
                      onClick={() => explainViolation({
                        title: v.title,
                        finding: v.description,
                        lawExcerpt: v.lawExcerpt,
                        fineAmount: v.fineAmount
                      })}
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>AI Explain</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-3">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {v.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{v.statuteSection}</span>
                  <span className="font-bold text-rose-700">{v.fineAmount}</span>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
