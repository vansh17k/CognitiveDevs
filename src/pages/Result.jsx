import React, { useState, useMemo } from 'react';
import { useApp } from '../App.jsx';
import { 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  Download, 
  ScanLine, 
  FileText, 
  Info,
  Layers,
  ArrowLeft,
  Share2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_INSPECTIONS } from '../data.js';
import { ScanAuditSplitView } from '../components/ScanAuditSplitView.jsx';
import { normalizeToAuditRecord, exportUniversalAuditPDF, exportUniversalAuditCSV } from '../utils/scanAuditAdapter.js';

export const Result = () => {
  const { currentScan, setCurrentScan, navigate, openExplainModal, currentUser, addToast } = useApp();

  const isConsumer = currentUser?.role === 'consumer';
  const product = currentScan?.product || INITIAL_PRODUCTS[0];
  const inspection = currentScan?.inspection || INITIAL_INSPECTIONS[0];

  // Convert current scan or product to unified audit record with visual bounding boxes
  const auditResult = useMemo(() => {
    return normalizeToAuditRecord(currentScan || product, currentUser?.role);
  }, [currentScan, product, currentUser]);

  const handleDownloadPDF = () => {
    const ok = exportUniversalAuditPDF(auditResult, isConsumer ? 'consumer' : currentUser?.role || 'inspector');
    if (ok && addToast) {
      addToast({
        type: 'success',
        title: isConsumer ? 'Citizen Verification Certificate Downloaded' : 'Statutory Audit PDF Downloaded',
        description: isConsumer 
          ? `Official Citizen Verification Certificate saved for ${auditResult.productName}.`
          : `Official statutory report saved for ${auditResult.productName}.`
      });
    }
  };

  const handleExportCSV = () => {
    const ok = exportUniversalAuditCSV(auditResult);
    if (ok && addToast) {
      addToast({
        type: 'success',
        title: 'Audit CSV Exported',
        description: `CSV dataset generated for ${auditResult.productName}.`
      });
    }
  };

  const handleScanAnother = () => {
    setCurrentScan(null);
    navigate('scan');
  };

  const handleFileNotice = () => {
    navigate('requests', { newRequest: true });
    if (addToast) {
      addToast({
        type: 'info',
        title: 'File Notice Initiated',
        description: `Drafting Legal Metrology Section 36 action request for ${auditResult.productName}.`
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(isConsumer ? 'scan' : 'dashboard')}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {isConsumer ? 'Scan Portal' : 'Command Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 font-semibold hidden sm:inline">
            Audit ID: {auditResult.id}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            PaddleOCR v2.8
          </span>
        </div>
      </div>

      {/* E-Commerce Rule 6(10) Audit Context Banner */}
      {product?.isEcommerceScan && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-slate-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#0d4734] text-white rounded-xl shadow-xs shrink-0">
              <Globe className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wide bg-[#0d4734] text-white px-2 py-0.5 rounded">
                  {product.ecommerceMeta?.platform || 'E-Commerce'} Audit
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  Legal Metrology PCR 2011 — Rule 6(10) Digital Marketplace Verification
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-2xl">
                Extracted listing from {product.ecommerceMeta?.platform || 'e-commerce marketplace'}. Verification checks physical package declaration alignment against digital product display pages (PDPs).
              </p>
            </div>
          </div>

          {product.ecommerceMeta?.url && (
            <a 
              href={product.ecommerceMeta.url} 
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <span>View Source PDP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Consumer Zero-Retention Alert & Instant Download Banner */}
      {isConsumer && (
        <div className="bg-gradient-to-r from-sky-50 via-cyan-50/70 to-emerald-50 border-2 border-sky-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wide bg-sky-600 text-white px-2 py-0.5 rounded">
                  Citizen Instant Check
                </span>
                <span className="text-xs font-bold text-sky-900">
                  Privacy Policy: Zero Data Retention
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-2xl">
                Aapka check kiya hua product data server me <strong>save nahi hoga</strong>. Instant verification ke baad aap abhi isi waqt official verification PDF download kar sakte hain. Page band hone ke baad ye data delete ho jayega.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Download Citizen PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* REPLICATED FBO-GRADE SPLIT SCREEN AUDIT VIEW */}
      <ScanAuditSplitView
        auditResult={auditResult}
        uploadedImage={product.imageUrl}
        onScanAnother={handleScanAnother}
        role={currentUser?.role || 'inspector'}
        isConsumer={isConsumer}
        onFileNotice={handleFileNotice}
        onExplain={openExplainModal}
      />
    </div>
  );
};
