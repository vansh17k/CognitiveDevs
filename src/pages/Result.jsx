import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  Check, 
  X, 
  AlertTriangle, 
  FileText, 
  Eye, 
  ScanLine, 
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Download,
  ShieldCheck,
  RotateCcw,
  Info,
  Globe,
  ExternalLink
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_INSPECTIONS } from '../data.js';
import { exportReportToPDF, getProductReportItems } from '../utils/exportReport.js';

export const Result = () => {
  const { currentScan, setCurrentScan, navigate, openExplainModal, currentUser, addToast } = useApp();
  const [showOriginalModal, setShowOriginalModal] = useState(false);

  const isConsumer = currentUser?.role === 'consumer';
  const product = currentScan?.product || INITIAL_PRODUCTS[0];
  const inspection = currentScan?.inspection || INITIAL_INSPECTIONS[0];

  const handleDownloadPDF = () => {
    const items = getProductReportItems(product);
    const ok = exportReportToPDF(
      { ...product, isConsumerScan: isConsumer }, 
      { ...inspection, isConsumerScan: isConsumer }, 
      items, 
      product.inspectorRemarks || ''
    );
    if (ok && addToast) {
      addToast({
        type: 'success',
        title: isConsumer ? 'Verification Certificate Downloaded' : 'PDF Report Downloaded',
        description: isConsumer 
          ? `Official Citizen Verification Certificate saved for ${product.name}.`
          : `Official statutory report saved for ${product.name}.`
      });
    }
  };

  const handleConsumerExit = () => {
    setCurrentScan(null);
    navigate('scan');
    if (addToast) {
      addToast({
        type: 'info',
        title: 'Session Ended',
        description: 'Instant verification completed. No scan data was stored in the database.'
      });
    }
  };

  const extractedItems = [
    { 
      label: 'Name of Manufacturer', 
      value: product.manufacturerName || (product.declarations?.find(d => d.name?.includes('Manufacturer'))?.extractedValue) || '',
      detected: !!(product.manufacturerName || product.manufacturerDeclared || product.declarations?.find(d => d.name?.includes('Manufacturer'))?.detected)
    },
    { 
      label: 'Address of Manufacturer', 
      value: product.manufacturerAddress || '',
      detected: !!(product.manufacturerAddress || product.manufacturerDeclared)
    },
    { 
      label: 'Net Quantity', 
      value: product.netQuantity || product.netQuantityValue || (product.declarations?.find(d => d.name?.includes('Net Quantity'))?.extractedValue) || '',
      detected: !!(product.netQuantity || product.netQuantityDeclared || product.netQuantityValue || product.declarations?.find(d => d.name?.includes('Net Quantity'))?.detected)
    },
    { 
      label: 'MRP (Incl. of all taxes)', 
      value: product.mrp || (product.mrpValue ? `₹${product.mrpValue}` : '') || (product.declarations?.find(d => d.name?.includes('MRP'))?.extractedValue) || '',
      detected: !!(product.mrp || product.mrpDeclared || product.mrpValue || product.declarations?.find(d => d.name?.includes('MRP'))?.detected)
    },
    { 
      label: 'Month & Year of Packing', 
      value: product.packingDate || product.mfgDate || (product.declarations?.find(d => d.name?.includes('Packing') || d.name?.includes('Manufacture'))?.extractedValue) || '',
      detected: !!(product.packingDate || product.mfgDate || product.mfgDateDeclared || product.declarations?.find(d => d.name?.includes('Packing') || d.name?.includes('Manufacture'))?.detected)
    },
    { 
      label: 'Consumer Care Details', 
      value: product.consumerCare || product.consumerCareContact || (product.declarations?.find(d => d.name?.includes('Consumer Care'))?.extractedValue) || '',
      detected: !!(product.consumerCare || product.consumerCareContact || product.consumerCareDetails || product.declarations?.find(d => d.name?.includes('Consumer Care'))?.detected)
    },
    { 
      label: 'Country of Origin', 
      value: product.countryOfOrigin && product.countryOfOrigin !== 'Not Detected' && product.countryOfOrigin !== '—' ? product.countryOfOrigin : '',
      detected: !!((product.countryOfOrigin && product.countryOfOrigin !== 'Not Detected' && product.countryOfOrigin !== '—') || product.countryOfOriginDeclared)
    },
    { 
      label: 'FSSAI License No.', 
      value: product.fssaiLicense || product.fssaiNumber || (product.declarations?.find(d => d.name?.includes('FSSAI'))?.extractedValue) || '',
      detected: !!(product.fssaiLicense || product.fssaiNumber || product.fssaiLicenseDeclared || product.declarations?.find(d => d.name?.includes('FSSAI'))?.detected)
    },
  ];

  const score = product.complianceScore ?? product.score ?? 85;
  const isCompliant = score >= 90 && (!product.violations || product.violations.length === 0);

  return (
    <div className="space-y-6">
      {/* E-Commerce Rule 6(10) Audit Context Banner */}
      {product.isEcommerceScan && (
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

          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Download PDF Report Now</span>
          </button>
        </div>
      )}

      {/* 3-Column Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Col 1: Product Image Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center">
          <div className="w-full aspect-4/5 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-contain p-2" 
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] rounded-md font-mono">
              OCR LIVE
            </div>
          </div>

          <button
            onClick={() => setShowOriginalModal(true)}
            className="mt-4 w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Original Image</span>
          </button>
        </div>

        {/* Col 2: Extracted Information Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Extracted Information</span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Rule 6 Statutory</span>
          </h3>

          <div className="divide-y divide-slate-100 mt-2">
            {extractedItems.map((item, idx) => (
              <div key={idx} className="py-2.5 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{item.label}</span>
                  {item.detected ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 shrink-0 text-[11px]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Detected</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-red-600 shrink-0 text-[11px]">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Missing</span>
                    </span>
                  )}
                </div>
                {item.value && (
                  <p className="text-[11px] text-slate-500 font-mono line-clamp-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Compliance Status & Issues (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Status Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Compliance Status
            </h3>

            {/* Compliant / Non-Compliant Banner */}
            {isCompliant ? (
              <div className="p-3 bg-[#e6f7ef] rounded-xl text-center border border-emerald-200">
                <span className="text-base font-extrabold text-[#0b8a4f] tracking-wider uppercase flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  COMPLIANT ({score}%)
                </span>
              </div>
            ) : (
              <div className="p-3 bg-[#fdeeed] rounded-xl text-center border border-[#f9cfcc]">
                <span className="text-base font-extrabold text-[#d93025] tracking-wider uppercase flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  NON-COMPLIANT ({score}%)
                </span>
              </div>
            )}

            {/* Alert Pill */}
            {!isCompliant && (
              <div className="p-3 bg-[#fdeeed] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#d93025] border border-[#f9cfcc]">
                <AlertTriangle className="w-4 h-4 text-[#d93025] shrink-0" />
                <span>{product.violations?.length || 1} Violation(s) Flagged</span>
              </div>
            )}

            {/* Issues Detected List */}
            <div className="pt-1">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                {product.violations && product.violations.length > 0 ? 'Issues Detected:' : 'Verification Summary:'}
              </h4>
              {product.violations && product.violations.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-700">
                  {product.violations.map((violation, idx) => (
                    <li key={violation.id || idx} className="flex items-start justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="font-semibold text-slate-900 block">{idx + 1}. {violation.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{violation.ruleReference || violation.rule}</span>
                      </div>
                      <button
                        onClick={() => openExplainModal(violation)}
                        className="text-[10px] text-[#0d4734] font-bold hover:underline shrink-0 flex items-center gap-0.5 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#0d4734]" />
                        Explain
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  ✓ All mandatory statutory declarations detected and verified under PCR 2011.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {isConsumer ? (
                <>
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full py-2.5 px-4 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>Download PDF Report Now</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleConsumerExit}
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ScanLine className="w-4 h-4 text-slate-500" />
                      <span>Scan Package</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentScan(null);
                        navigate('ecommerce-scan');
                      }}
                      className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0d4734] text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-emerald-700" />
                      <span>E-Com Link Scan</span>
                    </button>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 font-medium">
                    <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Closing this page discards transient scan data</span>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('reports', { productId: product.id })}
                    className="w-full py-2.5 px-4 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Full Report</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0d4734] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Download PDF Report</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('scan')}
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ScanLine className="w-4 h-4 text-slate-500" />
                      <span>Scan Package</span>
                    </button>

                    <button
                      onClick={() => navigate('ecommerce-scan')}
                      className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0d4734] text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-emerald-700" />
                      <span>E-Com Link Scan</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Modal for full original image */}
      {showOriginalModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowOriginalModal(false)}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-sm font-bold text-slate-900">Original Packaging Scan</h4>
              <button 
                onClick={() => setShowOriginalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex justify-center">
              <img src={product.imageUrl} alt="Original Packaging" className="rounded-lg object-contain max-h-[65vh]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
