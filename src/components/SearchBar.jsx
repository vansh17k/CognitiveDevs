/**
 * ============================================================================
 * SEARCH BAR & FILTER BAR COMPONENTS
 * ============================================================================
 * 
 * Reusable filter and search interfaces for commodities, rules, and audit logs.
 */

import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by commodity name, brand, barcode, or rule...',
  className = ''
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-white border border-slate-200 focus:border-[#0d4734] focus:ring-2 focus:ring-[#0d4734]/15 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-hidden font-medium"
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const FilterBar = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  statuses = ['All', 'Compliant', 'Non-Compliant'],
  selectedStatus = 'All',
  onSelectStatus,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {/* Category dropdown or pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0d4734] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Status pills */}
      {statuses.length > 0 && (
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => onSelectStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
