/**
 * ============================================================================
 * REPORT PREVIEW COMPONENT - OFFICIAL FORM-V NOTICE GENERATOR
 * ============================================================================
 * 
 * Generates an official, printable statutory inspection notice / Certificate
 * of Metrological Inspection under Section 36 of the Legal Metrology Act, 2009.
 */

import React from 'react';
import { Scale, Printer, Download, Share2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatINR, formatInspectionDate } from '../utils/helpers.js';

export const ReportPreview = ({ product, inspection, onPrint }) => {
  if (!product) return null;

  const violations = product.violations || [];
  const isCompliant = product.complianceScore >= 90 && violations.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-lg text-slate-900 print:border-none print:shadow-none print:p-0">
      {/* Header Emblem & Ministry Banner */}
      <div className="border-b-2 border-slate-900 pb-6 text-center">
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 rounded-full bg-[#0d4734] text-white flex items-center justify-center border-2 border-amber-400">
            <Scale className="w-7 h-7 text-amber-300" />
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-900">
          GOVERNMENT OF INDIA
        </h2>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">
          MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
        </h3>
        <p className="text-xs text-slate-600 font-medium">
          DIRECTORATE OF LEGAL METROLOGY (PACKAGED COMMODITIES DIVISION)
        </p>
        <div className="inline-block mt-3 px-4 py-1 rounded-md bg-slate-100 border border-slate-300 text-xs font-mono font-bold uppercase tracking-wider">
          {isCompliant ? 'CERTIFICATE OF METROLOGICAL VERIFICATION' : 'STATUTORY INSPECTION NOTICE (FORM-V)'}
        </div>
      </div>

      {/* Meta details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block font-mono">Notice Reference:</span>
          <span className="font-mono font-bold">{inspection?.id || 'INSP-2026-0881'}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-mono">Date of Inspection:</span>
          <span className="font-mono font-bold">{inspection?.inspectionDate || formatInspectionDate()}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-mono">Inspecting Officer:</span>
          <span className="font-bold">{inspection?.inspectorName || 'Inspector Rajesh Sharma'}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-mono">Jurisdiction Division:</span>
          <span className="font-bold">{inspection?.inspectorDivision || 'Central Zone - District 1'}</span>
        </div>
      </div>

      {/* Commodity particulars */}
      <div className="py-5 border-b border-slate-200">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d4734] mb-3">
          1. Particulars of Sample Commodity Tested
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 block">Commodity / Trade Name:</span>
            <span className="font-bold text-slate-900">{product.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Brand & Manufacturer:</span>
            <span className="font-bold text-slate-900">{product.brand} — {product.manufacturerName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Declared Net Quantity:</span>
            <span className="font-mono font-bold text-slate-900">{product.netQuantityValue || 'Declared'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Maximum Retail Price (MRP):</span>
            <span className="font-mono font-bold text-slate-900">{formatINR(product.mrpValue)} (Incl. Taxes)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Inspection Location:</span>
            <span className="text-slate-800">{inspection?.location || 'Central Inspection Terminal'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Batch / Barcode:</span>
            <span className="font-mono text-slate-800">{product.batchNumber || 'N/A'} | {product.barcode || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Statutory Findings & Violations */}
      <div className="py-5 border-b border-slate-200">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d4734] mb-3">
          2. Statutory Findings & Legal Evaluation (PCR 2011)
        </h4>

        {violations.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">VERIFIED FULLY COMPLIANT WITH LEGAL METROLOGY ACT, 2009</p>
              <p className="text-emerald-700 mt-0.5">All mandatory statements required under Rule 6 and typography heights under Rule 7 were found strictly within legal tolerances.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {violations.map((v, i) => (
              <div key={v.id || i} className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-rose-900">
                  <span>{v.rule || v.ruleNumber || 'Rule 6 Infraction'}</span>
                  <span className="text-rose-700">{v.fineAmount || 'Penal Liability under Sec 36'}</span>
                </div>
                <p className="font-bold text-slate-900 mt-1">{v.title || v.clauseTitle}</p>
                <p className="text-slate-700 mt-0.5">{v.finding || v.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legal Directives & Officer Signature */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
        <div>
          <h5 className="font-bold text-slate-900 uppercase text-[11px] font-mono">Directives to Packer / Trader:</h5>
          <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
            {isCompliant 
              ? 'This certificate serves as official metrological verification for record keeping.' 
              : 'Pursuant to Section 36 of the Legal Metrology Act, 2009, the manufacturer/trader is hereby directed to submit an explanation or show cause within 15 days of this notice.'}
          </p>
        </div>

        <div className="text-right sm:pr-4 flex flex-col justify-end">
          <div className="inline-block border-b border-slate-900 w-48 ml-auto pb-1 text-center font-mono font-bold">
            Rajesh Sharma
          </div>
          <p className="text-[11px] font-bold text-slate-900 mt-1">Inspector of Legal Metrology</p>
          <p className="text-[10px] text-slate-500 font-mono">Central Zone • Seal & Stamp Affixed</p>
        </div>
      </div>
    </div>
  );
};
