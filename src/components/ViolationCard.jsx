/**
 * ============================================================================
 * VIOLATION CARD COMPONENT
 * ============================================================================
 * 
 * Detailed presentation of a Legal Metrology statutory infraction:
 * - Rule reference (e.g. Rule 6(1)(n), Rule 7 Table-1)
 * - Severity pill (High / Critical / Medium)
 * - Legal finding summary
 * - Section penalties & compounding fine
 * - AI explainability inspection trigger
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Scale, BookOpen } from 'lucide-react';

export const ViolationCard = ({ violation, onExplain }) => {
  const isHighSeverity = (violation.severity || '').toLowerCase() === 'high' || 
                         (violation.severity || '').toLowerCase() === 'critical';

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${
      isHighSeverity 
        ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
        : 'bg-amber-50/70 border-amber-200 text-amber-950'
    }`}>
      {/* Top badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
            {violation.rule || violation.ruleNumber || violation.ruleReference || 'PCR Rule 6'}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isHighSeverity ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
          }`}>
            {(violation.severity || 'Medium')} Severity
          </span>
        </div>

        {onExplain && (
          <button
            onClick={() => onExplain(violation)}
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Legal Explainability</span>
          </button>
        )}
      </div>

      {/* Violation Title */}
      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2">
        {violation.title || violation.clauseTitle || 'Statutory Non-Compliance'}
      </h4>

      {/* Finding Narrative */}
      <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
        {violation.finding || violation.explanation || 'Automated inspection detected omission of mandatory statutory declarations.'}
      </p>

      {/* Legal reference & penalty footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Scale className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{violation.lawExcerpt ? 'Section 36 Prosecution Standard' : 'PCR 2011 Enforcement'}</span>
        </div>
        {violation.fineAmount && (
          <span className="font-bold text-rose-700">
            Penal Liability: {violation.fineAmount}
          </span>
        )}
      </div>
    </div>
  );
};
