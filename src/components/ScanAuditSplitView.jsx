import React, { useState } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { exportUniversalAuditPDF, exportUniversalAuditCSV } from '../utils/scanAuditAdapter.js';

export const ScanAuditSplitView = ({ 
  auditResult, 
  uploadedImage, 
  onScanAnother, 
  role = 'inspector',
  onFileNotice,
  onExplain,
  isConsumer = false
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [activeBoxHover, setActiveBoxHover] = useState(null);

  if (!auditResult) {
    return null;
  }

  const score = auditResult.complianceScore ?? 85;
  const isClean = score >= 90;
  const infractionsCount = auditResult.violationsCount ?? (auditResult.violationsList || []).filter(v => v.severity !== 'Compliant').length;
  const imageSource = uploadedImage || auditResult.labelImageUrl || auditResult.imageUrl;

  const handleDownloadPDF = () => {
    exportUniversalAuditPDF(auditResult, isConsumer ? 'consumer' : role);
  };

  const handleExportCSV = () => {
    exportUniversalAuditCSV(auditResult);
  };

  return (
    <div className="space-y-4 w-full">
      {/* 1. TOP METRIC SUMMARY BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Score Circle / Badge */}
          <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
            isClean 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
              : score >= 70 
                ? 'bg-amber-50 text-amber-700 border-amber-300' 
                : 'bg-rose-50 text-rose-700 border-rose-300'
          }`}>
            <span className="text-xl sm:text-2xl font-black font-mono leading-none">
              {score}%
            </span>
            <span className="text-[9px] uppercase font-bold tracking-tight mt-0.5">
              SCORE
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isClean 
                  ? 'bg-emerald-100 text-[#065F46] border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {auditResult.status || (isClean ? 'Ready for Market' : 'Requires Revision')}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {infractionsCount > 0 ? `${infractionsCount} Infraction${infractionsCount > 1 ? 's' : ''}` : 'Statutory Compliant'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isConsumer
                ? 'Review cited rule infractions below and protect your consumer rights before purchasing or consuming.'
                : role === 'inspector' || role === 'dgm'
                  ? 'Statutory Legal Metrology non-compliances flagged. Citations and penal provisions generated under Section 36.'
                  : 'Review cited rule infractions below and adjust typeface/clauses before releasing packaging.'
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onScanAnother && (
            <button
              onClick={onScanAnother}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2.5 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {role === 'inspector' && onFileNotice && (
            <button
              onClick={onFileNotice}
              className="px-3.5 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>File Enforcement Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SPLIT-SCREEN CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        
        {/* Left Side: Visual Label Canvas (6 cols) */}
        <div className="xl:col-span-6 bg-[#06241a] rounded-2xl border border-[#0b4d38] p-3 sm:p-4 text-white flex flex-col justify-between overflow-hidden relative min-h-[360px] sm:min-h-[460px] shadow-sm">
          
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between border-b border-[#0d5941] pb-2.5 mb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] sm:text-xs font-bold text-emerald-200 font-mono tracking-wide">
                IMAGE PREVIEW CANVAS
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#083829] p-1 rounded-xl border border-[#0d5941]">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                className="p-1 hover:bg-[#0b4d38] rounded text-emerald-300 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              
              <span className="text-[10px] font-mono text-emerald-300 font-bold px-1.5 select-none min-w-[34px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-1 hover:bg-[#0b4d38] rounded text-emerald-300 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-[#0b4d38] rounded text-emerald-300 transition-colors cursor-pointer ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="h-3.5 w-px bg-[#0d5941] mx-0.5" />

              <button
                type="button"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  showBoundingBoxes ? 'bg-[#059669] text-white shadow-xs' : 'hover:bg-[#0b4d38] text-emerald-400'
                }`}
                title={showBoundingBoxes ? 'Hide OCR Bounding Boxes' : 'Show OCR Bounding Boxes'}
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Display Stage */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative my-2 min-h-[240px] sm:min-h-[320px]">
            <div 
              className="relative transition-transform duration-150 ease-out select-none flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={imageSource}
                alt={auditResult.productName || 'Scanned Commodity Label'}
                className="max-h-[260px] sm:max-h-[340px] max-w-full rounded-xl object-contain shadow-2xl border border-[#0d5941] select-none"
              />

              {/* Dynamic OCR Bounding Box Overlays */}
              {showBoundingBoxes && (auditResult.extractedFields || []).map((f, idx) => {
                if (!f.bbox || f.bbox.length < 4) return null;
                const [left, top, width, height] = f.bbox;
                const isHovered = activeBoxHover === f.key;
                const isViolating = !f.compliant;

                return (
                  <div
                    key={`bbox-${idx}-${f.key}`}
                    onMouseEnter={() => setActiveBoxHover(f.key)}
                    onMouseLeave={() => setActiveBoxHover(null)}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${width}%`,
                      height: `${height}%`
                    }}
                    className={`absolute rounded transition-all duration-150 cursor-pointer ${
                      isViolating
                        ? 'border-2 border-rose-500 bg-rose-500/20'
                        : 'border-2 border-emerald-400 bg-emerald-400/15'
                    } ${isHovered ? 'ring-4 ring-emerald-300 scale-[1.03] z-20 shadow-lg' : 'z-10'}`}
                  >
                    <span className={`absolute -top-4 left-0 px-1 py-0.2 rounded text-[8px] font-mono font-bold whitespace-nowrap shadow-xs pointer-events-none ${
                      isViolating ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {f.key}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-300/80 font-mono border-t border-[#0d5941] pt-2 mt-auto">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-xs" />
                <span>Compliant Field</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-xs" />
                <span>Non-Conformance Box</span>
              </span>
            </div>
            <span className="text-emerald-400/70 hidden sm:inline">
              Tap box to inspect
            </span>
          </div>
        </div>

        {/* Right Side: Violations & OCR Declarations (6 cols) */}
        <div className="xl:col-span-6 space-y-4">
          
          {/* Card 1: Detected Violations & Statutory Citations */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Detected Violations & Statutory Citations
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                {(auditResult.violationsList || []).length} Rules
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {(auditResult.violationsList || []).map((v, idx) => {
                const isCritical = v.severity === 'Critical Violation';
                const isCompliant = v.severity === 'Compliant';

                return (
                  <div
                    key={v.id || idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCompliant
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : isCritical
                          ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                          : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded ${
                        isCompliant
                          ? 'bg-emerald-600 text-white'
                          : isCritical
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-600 text-white'
                      }`}>
                        {v.severity || 'Critical Violation'}
                      </span>

                      {onExplain && !isCompliant && (
                        <button
                          type="button"
                          onClick={() => onExplain(v)}
                          className="text-[10px] text-[#0d4734] font-bold hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-300 cursor-pointer shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-[#0d4734]" />
                          <span>AI Explain</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-900 mt-1 font-mono">
                      {v.ruleCited}
                    </p>

                    <p className="text-xs text-slate-700 mb-2 leading-relaxed mt-1">
                      <span className="font-semibold text-slate-900">Observed: </span>
                      {v.observed}
                    </p>

                    {v.penalty && (
                      <div className="bg-white/80 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 mb-2 font-mono leading-relaxed">
                        <span className="font-bold text-rose-700">Statutory Penal Provision: </span>
                        {v.penalty}
                      </div>
                    )}

                    {v.guidance && (
                      <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                        <span className="font-bold text-[#065F46]">Correction Guidance: </span>
                        {v.guidance}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: OCR PARSED STATUTORY DECLARATIONS */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  OCR PARSED STATUTORY DECLARATIONS
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md font-bold">
                PaddleOCR v2.8
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {(auditResult.extractedFields || []).map((f, idx) => {
                const isActive = activeBoxHover === f.key;
                const isCompliant = f.compliant;

                return (
                  <div
                    key={`field-${idx}-${f.key}`}
                    onMouseEnter={() => setActiveBoxHover(f.key)}
                    onMouseLeave={() => setActiveBoxHover(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-emerald-500 bg-emerald-50/50 border-emerald-400 shadow-xs'
                        : isCompliant
                          ? 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                          : 'bg-rose-50/60 border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="truncate pr-1">{f.key}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 font-semibold">
                        {f.confidence}% conf
                      </span>
                    </div>

                    <p className="text-xs text-slate-900 font-mono mt-1 break-words font-medium line-clamp-2">
                      {f.value || '—'}
                    </p>

                    {f.issue && (
                      <div className="text-[10px] text-rose-600 font-medium mt-1 leading-tight">
                        ⚠️ {f.issue}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
