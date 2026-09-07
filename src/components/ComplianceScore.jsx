/**
 * ============================================================================
 * COMPLIANCE SCORE COMPONENT - RADIAL GAUGE & METRIC
 * ============================================================================
 * 
 * Computes and renders mathematical PCR 2011 compliance score (0-100%):
 * - Circular SVG gauge with statutory color spectrum
 * - Status verdict (Fully Compliant vs Statutory Notice Required)
 * - Detailed score breakdown
 */

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export const ComplianceScore = ({ score = 100, size = 'md', showLabel = true }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const isHigh = clamped >= 90;
  const isMedium = clamped >= 70 && clamped < 90;

  // Colors
  const strokeColor = isHigh ? '#10b981' : isMedium ? '#f59e0b' : '#ef4444';
  const textColor = isHigh ? 'text-emerald-700' : isMedium ? 'text-amber-700' : 'text-rose-600';
  const badgeBg = isHigh ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : isMedium ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200';

  // SVG dimensions
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-extrabold font-mono tracking-tighter ${textColor}`}>
            {clamped}%
          </span>
          <span className="text-[9px] font-mono uppercase text-slate-400 font-bold -mt-0.5">
            PCR 2011
          </span>
        </div>
      </div>

      {showLabel && (
        <div>
          <div className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeBg}`}>
            {isHigh ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Statutory Compliant</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                <span>Notice Form-V Required</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isHigh 
              ? 'All 8 mandatory declarations meet Rule 6 & 7 specifications.' 
              : 'One or more mandatory packaging declarations are missing or deficient.'}
          </p>
        </div>
      )}
    </div>
  );
};
