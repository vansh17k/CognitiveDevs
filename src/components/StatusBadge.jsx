/**
 * ============================================================================
 * STATUS BADGE COMPONENT - COMPLIANCE INDICATOR
 * ============================================================================
 * 
 * Displays verified status chips:
 * - Compliant (Green)
 * - Non-Compliant (Red)
 * - Notice Issued (Amber)
 * - Pending Review (Slate)
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

export const StatusBadge = ({ status = 'Compliant', size = 'sm', className = '' }) => {
  const norm = (status || '').toLowerCase();
  
  let styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let Icon = CheckCircle2;
  let label = status;

  if (norm.includes('non') || norm.includes('fail') || norm.includes('violat')) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = AlertCircle;
    label = 'Non-Compliant';
  } else if (norm.includes('notice') || norm.includes('advisory') || norm.includes('warn')) {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = ShieldAlert;
  } else if (norm.includes('pend') || norm.includes('review')) {
    styles = 'bg-slate-100 text-slate-700 border-slate-200';
    Icon = Clock;
  }

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span className={`inline-flex items-center font-bold font-mono border rounded-md uppercase tracking-wider ${styles} ${sizes[size] || sizes.sm} ${className}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
};
