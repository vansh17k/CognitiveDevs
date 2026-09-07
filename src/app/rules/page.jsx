/**
 * ============================================================================
 * STATUTORY RULES & STANDARDS LIBRARY (src/app/rules/page.jsx)
 * ============================================================================
 * 
 * Interactive compendium of the Legal Metrology (Packaged Commodities) Rules, 2011:
 * - Rule 6 Mandatory Declarations Matrix
 * - Rule 7 Table-1 Font Height & Area specifications
 * - Penal code & compounding fine provisions
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Scale, 
  Search, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { SearchBar } from '../../components/SearchBar.jsx';
import { LEGAL_RULES, FONT_HEIGHT_TABLE } from '../../data/rules.js';

export default function RulesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('rules'); // 'rules' | 'fonts'

  const filteredRules = LEGAL_RULES.filter((r) => {
    return (
      (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
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
                PCR 2011 Statutory Standards & Rulebook
              </h2>
              <p className="text-xs text-slate-500">
                Official statutory provisions of the Legal Metrology (Packaged Commodities) Rules, 2011 (As amended)
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setSelectedTab('rules')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTab === 'rules' ? 'bg-[#0d4734] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rule 6 Declarations
              </button>
              <button
                onClick={() => setSelectedTab('fonts')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTab === 'fonts' ? 'bg-[#0d4734] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rule 7 Font Dimensions
              </button>
            </div>
          </div>

          {selectedTab === 'rules' ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search rule by code (e.g. Rule 6(1)(e)), clause, or keyword..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRules.map((r) => (
                  <div
                    key={r.code}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-[#0d4734] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {r.code}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                          PCR 2011
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-3">
                        {r.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {r.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-mono">
                      <span className="text-slate-400 block text-[10px]">Statutory Penalty:</span>
                      <span className="font-bold text-rose-700">{r.penalty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Font Height Table 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Rule 7 Table-1: Minimum Height of Numerals & Letters
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prescribed minimum typography heights based on Principal Display Panel (PDP) surface area
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Area of PDP (A in cm²)</th>
                        <th className="py-3.5 px-4 text-center">Normal Minimum (mm)</th>
                        <th className="py-3.5 px-4 text-center">Blown / Molded / Perforated (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {FONT_HEIGHT_TABLE.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            {row.range}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                            {row.minHeightMm} mm
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-700">
                            {row.blownMoldedMm} mm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Explanatory notes */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed">
                <h4 className="font-bold text-slate-900 text-sm">Legal Metrology Typography Directives:</h4>
                <p>1. The height of letters and numerals shall be measured from the baseline to the cap height. In the case of lower case letters, the height of the letter 'x' shall be not less than the minimum height specified in Table-1.</p>
                <p>2. The width of the letter or numeral shall not be less than one third of its height, except in the case of the numeral '1' and letter 'I'.</p>
                <p>3. Where the package contains declarations in both English and Hindi, the font size requirements apply equally to both linguistic scripts.</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
