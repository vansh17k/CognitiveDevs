/**
 * ============================================================================
 * FILTER BAR COMPONENT
 * ============================================================================
 * 
 * Filter selection chips for categories, status verifications, and dates.
 */

import React from 'react';

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
    <div className={`flex flex-wrap items-center justify-between gap-3 text-xs ${className}`}>
      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Status Filter */}
      {statuses.length > 0 && (
        <div className="flex items-center gap-1.5">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => onSelectStatus && onSelectStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
