/**
 * ============================================================================
 * STAT CARD COMPONENT - METRIC HIGHLIGHT TILE
 * ============================================================================
 * 
 * Used across the inspector dashboard for high-level statistics:
 * Total inspections, compliance rate %, active notices, recovered penalties.
 */

import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'green',
  className = '',
  onClick
}) => {
  const colorMap = {
    green: {
      bg: 'bg-emerald-50 text-[#0d4734] border-emerald-200',
      iconBg: 'bg-emerald-100 text-[#0d4734]',
    },
    red: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-700',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    blue: {
      bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-800',
    }
  };

  const scheme = colorMap[color] || colorMap.green;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-mono">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{subtitle}</span>
          {trend && (
            <span className={`font-semibold font-mono ${trendPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
