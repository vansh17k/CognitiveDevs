import React, { useState } from 'react';
import { LEGAL_RULES, FONT_SIZE_LOOKUP_MATRIX, MPE_SCHEDULE_TABLE } from '../data.js';
import { 
  Scale, 
  Search, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Calculator,
  Layers,
  ShieldAlert,
  Info,
  ChevronRight,
  Gavel
} from 'lucide-react';

export const Rules = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('rules'); // 'rules', 'font-matrix', 'mpe-schedule'
  
  // Interactive Font Size Calculator State
  const [calcArea, setCalcArea] = useState('150');
  const [calcType, setCalcType] = useState('normal'); // 'normal' | 'blown'

  const categories = [
    'All',
    'Rule 6 (Declarations)',
    'Rule 9 (Legibility)',
    'Rule 18 (Retail & MRP)',
    'Schedules (MPE & Sizes)',
    'Section 36 (Penalties)',
    'Section 38 (Registration)'
  ];

  const filteredRules = LEGAL_RULES.filter(r => {
    const s = (searchTerm || '').toLowerCase();
    const matchesSearch = 
      (r.code || '').toLowerCase().includes(s) ||
      (r.name || '').toLowerCase().includes(s) ||
      (r.description || '').toLowerCase().includes(s) ||
      (r.category || '').toLowerCase().includes(s) ||
      (r.sectionReference || '').toLowerCase().includes(s) ||
      (r.whatToCheck || '').toLowerCase().includes(s);
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate required font size from user input
  const getCalculatedFont = (areaNum, isBlown) => {
    const num = parseFloat(areaNum) || 0;
    const match = FONT_SIZE_LOOKUP_MATRIX.find(m => num <= m.areaMax && num > m.areaMin) || FONT_SIZE_LOOKUP_MATRIX[0];
    return {
      minHeight: isBlown ? match.minHeightBlown : match.minHeightNormal,
      weightRange: match.weightRange,
      areaRange: match.areaRange,
      notes: match.notes
    };
  };

  const calculatedResult = getCalculatedFont(calcArea, calcType === 'blown');

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Digital Legal Repository</h2>
            <span className="text-[10px] bg-emerald-50 text-[#0d4734] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
              ACT 2009 & PCR 2011
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Searchable in-app repository of The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011 with clause-by-clause commentary for quick field reference.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://consumeraffairs.nic.in/acts-and-rules/legal-metrology"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0d4734] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
          >
            <span>Ministry Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* VIEW TABS */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-[#0d4734] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Statutory Rules & Penal Sections</span>
          <span className="ml-1 px-1.5 py-0.2 bg-white/20 text-[10px] rounded font-mono">
            {LEGAL_RULES.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('font-matrix')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'font-matrix'
              ? 'bg-[#0d4734] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Standard Font-Size Lookup Matrix</span>
          <span className="ml-1 px-1.5 py-0.2 bg-amber-500/20 text-[10px] rounded font-mono">
            Table 1
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mpe-schedule')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'mpe-schedule'
              ? 'bg-[#0d4734] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Second Schedule (MPE Errors)</span>
        </button>
      </div>

      {/* TAB 1: STATUTORY RULES & PENAL SECTIONS */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {/* SEARCH & CATEGORY FILTER */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#0d4734]" />
                <span>Search Rulebook</span>
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Rulebook (e.g. 'Rule 6', 'Rule 9', 'Rule 18', 'Section 36', 'Section 38', 'Schedules', 'MPE')..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0d4734] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Penal Provisions Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/80 flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                <Gavel className="w-4 h-4" />
              </div>
              <div className="text-xs text-rose-950">
                <p className="font-bold text-rose-900">Section 36 Penalties (Non-Standard Packages)</p>
                <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                  First offence: Fine up to <strong>₹25,000</strong>. Second: up to <strong>₹50,000</strong>. Subsequent: Fine up to <strong>₹1,00,000</strong> or imprisonment up to 1 year, or both.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-xs text-amber-950">
                <p className="font-bold text-amber-900">Section 38 Penalties (Non-Registration)</p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Unregistered manufacturer / packer / importer under Rule 27 is punishable with statutory fine up to <strong>₹25,000</strong> with compounding proceedings.
                </p>
              </div>
            </div>
          </div>

          {/* RULES LIST */}
          <div className="space-y-3">
            {filteredRules.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No matching rules found for "{searchTerm}". Try searching for Rule 9, Rule 18, Section 36, Section 38, or Schedules.
              </div>
            ) : (
              filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rule.code}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">{rule.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono shrink-0">
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {rule.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rule.severityLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rule.severityLevel} Severity
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {rule.description}
                  </p>

                  {/* What to Check */}
                  <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-100 text-xs text-slate-800">
                    <span className="text-[10px] uppercase font-bold text-[#0d4734] font-mono block mb-1">
                      Automated Verification Criterion:
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">{rule.whatToCheck}</p>
                  </div>

                  {/* Official Statutory Text Box */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                      Prescribed Statutory Requirement:
                    </span>
                    <p className="italic font-serif leading-relaxed text-xs">
                      "{rule.prescribedRequirement}"
                    </p>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400 font-mono">
                    <span>{rule.sectionReference} • {rule.applicableLaw}</span>
                    <span className="text-emerald-700 font-semibold">Active in Automated Rule Engine ✓</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STANDARD FONT-SIZE LOOKUP MATRIX */}
      {activeTab === 'font-matrix' && (
        <div className="space-y-4">
          {/* Interactive Calculator Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-[#0d4734] text-white p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-300" />
                  <span>Standard Font-Size Lookup Matrix & Field Gauge</span>
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Rule 7 & Table 1 minimum height of letters and numerals on Principal Display Panel (PDP).
                </p>
              </div>
              <span className="text-[10px] font-mono bg-white/15 px-2.5 py-1 rounded-md text-emerald-200 border border-white/10">
                Table 1 Statutory Specification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/20 p-4 rounded-xl border border-white/10">
              <div>
                <label className="text-[11px] font-medium text-emerald-200 block mb-1">
                  Principal Display Area (cm²):
                </label>
                <input
                  type="number"
                  value={calcArea}
                  onChange={(e) => setCalcArea(e.target.value)}
                  min="1"
                  max="50000"
                  className="w-full text-xs px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono focus:bg-white focus:text-slate-900 focus:outline-hidden"
                  placeholder="e.g. 150"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-200 block mb-1">
                  Lettering Technology:
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-medium focus:bg-white focus:text-slate-900 focus:outline-hidden"
                >
                  <option value="normal" className="text-slate-900">Normal Print / Label (Standard)</option>
                  <option value="blown" className="text-slate-900">Blown / Formed / Moulded / Embossed</option>
                </select>
              </div>

              <div className="bg-white/15 p-3 rounded-lg flex flex-col justify-center border border-white/20">
                <span className="text-[10px] uppercase font-bold text-emerald-200 font-mono">
                  Prescribed Minimum Height:
                </span>
                <span className="text-xl font-bold font-mono text-white mt-0.5">
                  {calculatedResult.minHeight}
                </span>
                <span className="text-[10px] text-emerald-200 truncate mt-0.5">
                  Net Weight Range: {calculatedResult.weightRange}
                </span>
              </div>
            </div>
          </div>

          {/* Complete Table 1 Reference Matrix */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0d4734]" />
                <span>Statutory Table 1: Minimum Height of Numbers and Letters</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-500">Rule 7(1) PCR 2011</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                    <th className="py-2.5 px-3">Area of Display Panel (A)</th>
                    <th className="py-2.5 px-3">Net Quantity Range</th>
                    <th className="py-2.5 px-3 text-emerald-800">Normal Print (Min Height)</th>
                    <th className="py-2.5 px-3 text-amber-800">Blown / Moulded / Embossed</th>
                    <th className="py-2.5 px-3 text-slate-500">Typical Packaging Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {FONT_SIZE_LOOKUP_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.areaRange}</td>
                      <td className="py-3 px-3 font-medium text-slate-600">{row.weightRange}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/40">{row.minHeightNormal}</td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-700 bg-amber-50/40">{row.minHeightBlown}</td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                <strong>Legal Rule Note:</strong> The height of letters in the name and address of the manufacturer and date of packaging can be smaller provided they are not less than 1.0 mm. However, numeral height for Net Quantity and MRP must strictly comply with the table above.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECOND SCHEDULE (MPE ERRORS) */}
      {activeTab === 'mpe-schedule' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">Second Schedule: Maximum Permissible Error (MPE)</h3>
                <span className="text-[10px] bg-emerald-50 text-[#0d4734] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                  RULE 11 PCR 2011
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Maximum allowable statistical shortfall tolerance between declared net quantity and physical verified contents.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                  <th className="py-2.5 px-3">Declared Net Quantity (Q)</th>
                  <th className="py-2.5 px-3">MPE as Percentage of Declared Qty</th>
                  <th className="py-2.5 px-3">MPE as Absolute Unit (g or ml)</th>
                  <th className="py-2.5 px-3 text-slate-500">Statutory Tolerance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MPE_SCHEDULE_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.range}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">{row.mpePercent}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{row.mpeAbsolute}</td>
                    <td className="py-3 px-3 text-[11px] text-emerald-700 font-medium">Permissible statistical limit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-rose-900">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Sanction for Exceeding Maximum Permissible Error (MPE)</span>
            </p>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Under Section 36(2) of the Legal Metrology Act, 2009, short measurement exceeding Second Schedule MPE is a criminal offence punishable with fine not less than ₹10,000 up to ₹50,000 for first offence, and imprisonment up to 1 year for subsequent offences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
