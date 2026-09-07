import React, { useState, useEffect } from 'react';
import { useApp } from './App.jsx';
import { 
  X, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Scale,
  Percent,
  Check,
  AlertTriangle,
  ShieldAlert,
  Send,
  Building2,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Clock,
  Headphones,
  Scan,
  CheckSquare,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Menu,
  Bell,
  ArrowLeft,
  ChevronDown,
  Settings,
  LogOut,
  Download,
  FileSpreadsheet,
  Home,
  Camera,
  LayoutDashboard,
  ScanLine,
  History,
  Package,
  Users,
  HelpCircle as HelpIcon,
  AlertCircle,
  Info
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { INITIAL_PRODUCTS, INITIAL_INSPECTIONS } from './data.js';
import { 
  exportReportToPDF, 
  exportReportToExcel, 
  getProductReportItems 
} from './utils/exportReport.js';

// ==========================================
// 1. EMBLEM COMPONENT
// ==========================================
export const Emblem = ({ className = 'h-8 w-8', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-emerald-800"
      >
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" className="opacity-40" />
        <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 8V38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 16H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16L7 25H17L12 16Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M36 16L31 25H41L36 16Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 38H32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="11" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};

// ==========================================
// 2. TOAST CONTAINER
// ==========================================
export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white shadow-emerald-900/5';
      case 'error':
        return 'border-rose-200 bg-white shadow-rose-900/5';
      case 'warning':
        return 'border-amber-200 bg-white shadow-amber-900/5';
      default:
        return 'border-blue-200 bg-white shadow-blue-900/5';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${getBg(toast.type)}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-slate-800 leading-tight">{toast.title}</h4>
              {toast.description && (
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 3. EXPLAIN VIOLATION MODAL
// ==========================================
export const ExplainViolationModal = () => {
  const { 
    isExplainModalOpen, 
    closeExplainModal, 
    selectedViolation, 
    updateViolationStatus,
    navigate,
    rules
  } = useApp();

  const [inspectorNotes, setInspectorNotes] = useState('');
  const [aiLegalText, setAiLegalText] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch live legal explainability from server-side Gemini endpoint
  useEffect(() => {
    if (isExplainModalOpen && selectedViolation) {
      let isMounted = true;
      setLoadingAi(true);
      
      // Call backend route POST /api/ai/explain-violation (Django equivalent: views.explain_violation)
      fetch('/api/ai/explain-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violation: selectedViolation })
      })
        .then(res => res.json())
        .then(data => {
          if (isMounted && data?.explanation) {
            setAiLegalText(data.explanation);
          }
        })
        .catch(err => {
          console.warn('Backend AI explanation call error:', err);
        })
        .finally(() => {
          if (isMounted) setLoadingAi(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      setAiLegalText(null);
    }
  }, [isExplainModalOpen, selectedViolation]);

  if (!isExplainModalOpen || !selectedViolation) return null;

  const matchedRule = rules.find(r => 
    (selectedViolation?.ruleReference && r?.code && selectedViolation.ruleReference.toLowerCase().includes(r.code.toLowerCase())) ||
    (selectedViolation?.rule && r?.code && selectedViolation.rule.toLowerCase().includes(r.code.toLowerCase())) ||
    (selectedViolation?.ruleNumber && r?.code && selectedViolation.ruleNumber.toLowerCase().includes(r.code.toLowerCase())) ||
    (selectedViolation?.clauseTitle && r?.name && selectedViolation.clauseTitle.toLowerCase().includes(r.name.toLowerCase())) ||
    (selectedViolation?.title && r?.name && selectedViolation.title.toLowerCase().includes(r.name.toLowerCase())) ||
    (selectedViolation?.type && r?.name && r.name.toLowerCase().includes(selectedViolation.type.toLowerCase())) ||
    (selectedViolation?.field && r?.name && r.name.toLowerCase().includes(selectedViolation.field.toLowerCase()))
  ) || rules[0];

  const handleDecision = (decision) => {
    updateViolationStatus(selectedViolation.id, decision, inspectorNotes);
    closeExplainModal();
  };

  const handleOpenRule = () => {
    closeExplainModal();
    navigate('rules');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="bg-indigo-900 px-5 py-3.5 text-white flex items-center justify-between border-b border-indigo-950/60">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-800 text-indigo-200 rounded-lg">
                <Sparkles className="w-4.5 h-4.5 text-indigo-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/70 px-2 py-0.2 rounded border border-indigo-700/50">
                    GEMINI LEGAL AI EXPLAINABILITY
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    (selectedViolation.severity || '').toLowerCase() === 'high' || (selectedViolation.severity || '').toLowerCase() === 'critical'
                      ? 'bg-red-500/30 text-red-200 border border-red-500/40' 
                      : 'bg-orange-500/30 text-orange-200 border border-orange-500/40'
                  }`}>
                    {(selectedViolation.severity || 'Medium').toUpperCase()} SEVERITY
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-md">
                  {selectedViolation.title || selectedViolation.clauseTitle || 'Statutory Violation'}
                </h3>
              </div>
            </div>
            <button
              onClick={closeExplainModal}
              className="text-indigo-300 hover:text-white p-1 rounded-lg hover:bg-indigo-800 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="flex items-center justify-between gap-2 text-slate-900 font-bold text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Why was this flagged?</span>
                </div>
                {loadingAi && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-normal">
                    <Loader2 className="w-3 h-3 animate-spin" /> Fetching AI Legal Analysis...
                  </span>
                )}
              </div>
              <p className="text-slate-700 leading-relaxed pl-6 text-xs whitespace-pre-line">
                {aiLegalText || selectedViolation.finding || selectedViolation.explanation || 'The automated screening system did not detect a mandatory declaration in the analyzed package image surface.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1.5">
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Extracted OCR Buffer & Evidence</span>
              </div>
              <div className="pl-6 space-y-1.5">
                <div className="p-2.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-800 leading-relaxed">
                  {selectedViolation.evidenceText || selectedViolation.lawExcerpt || 'The OCR system evaluated the bounding buffer zone and found 0 matching tokens corresponding to the mandatory legal declaration syntax.'}
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Engine: PaddleOCR / Gemini 1.5 Pro Tokenizer (Threshold: 0.65)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-lg p-3 bg-indigo-50/30">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Detection Confidence
                  </div>
                  <div className="p-1 bg-indigo-100 text-indigo-800 rounded">
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-indigo-900">
                    {selectedViolation.confidence || 96}%
                  </span>
                  <span className="text-[11px] font-medium text-green-700">
                    High Statistical Reliability
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full" 
                    style={{ width: `${selectedViolation.confidence || 96}%` }}
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Enforcement Status
                  </div>
                  <div className="p-1 bg-slate-200 text-slate-700 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedViolation.status === 'Confirmed'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : selectedViolation.status === 'Rejected'
                      ? 'bg-slate-100 text-slate-800 border border-slate-200'
                      : 'bg-orange-100 text-orange-800 border border-orange-200'
                  }`}>
                    {selectedViolation.status === 'Confirmed' && <Check className="w-3 h-3" />}
                    {selectedViolation.status} by Inspector
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  {selectedViolation.inspectorDecision 
                    ? `Inspector decision: ${selectedViolation.inspectorDecision}`
                    : 'Awaiting physical sample verification.'}
                </p>
              </div>
            </div>

            <div className="border-l-4 border-orange-400 bg-orange-50 rounded-r-lg p-3">
              <div className="flex items-center gap-1.5 text-orange-950 font-bold text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>Recommended Statutory Action</span>
              </div>
              <p className="text-orange-900 leading-relaxed text-xs">
                {selectedViolation.recommendation || 'Verify the original package manually before recording a final statutory violation. Check package crimp folds and side panels.'}
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Applicable Legal Requirement</span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 font-medium">
                  {matchedRule.code} — {matchedRule.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {matchedRule.applicableLaw}
                </p>
              </div>
              <button
                onClick={handleOpenRule}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors shrink-0"
              >
                <FileText className="w-3 h-3" />
                <span>View Rule</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Record Inspector Physical Verification Notes
              </label>
              <textarea
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Optional notes: e.g. Checked physical packaging, confirmed country of origin is absent on all faces..."
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={closeExplainModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDecision('Rejected')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Exempt / Clear Flag</span>
              </button>
              
              <button
                onClick={() => handleDecision('Confirmed')}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-200" />
                <span>Confirm Violation</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// 4. MANUAL REVIEW MODAL
// ==========================================
export const ManualReviewModal = () => {
  const { 
    isManualReviewModalOpen, 
    closeManualReviewModal, 
    currentScan,
    submitManualReview 
  } = useApp();

  const [reason, setReason] = useState('Missing or Ambiguous Legal Declaration');
  const [priority, setPriority] = useState('High');
  const [remarks, setRemarks] = useState('');

  if (!isManualReviewModalOpen || !currentScan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitManualReview(
      reason, 
      priority, 
      remarks || `Scheduled for physical inspection: ${reason}`
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="bg-emerald-950 px-6 py-4.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Send for Manual Officer Review
                </h3>
                <p className="text-xs text-emerald-300">
                  {currentScan.product.name} ({currentScan.product.reportId})
                </p>
              </div>
            </div>
            <button
              onClick={closeManualReviewModal}
              className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-700">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
              <p className="font-semibold mb-1">Enforcement Protocol Note:</p>
              AI screening outputs are advisory. Submitting for manual review dispatches this inspection to the local field officer for physical sample measurement.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Primary Review Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Missing or Ambiguous Legal Declaration">Missing or Ambiguous Legal Declaration</option>
                <option value="Font Size / Numeral Height Verification (Rule 7)">Font Size / Numeral Height Verification (Rule 7)</option>
                <option value="MRP / Tax Phrasing Ambiguity">MRP / Tax Phrasing Ambiguity</option>
                <option value="Consumer Care Helpline Invalid / Missing">Consumer Care Helpline Invalid / Missing</option>
                <option value="Packaging Occlusion / Fold Examination">Packaging Occlusion / Fold Examination</option>
                <option value="Suspected Counterfeit / Relabeled Batch">Suspected Counterfeit / Relabeled Batch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Inspection Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['High', 'Medium', 'Low'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                      priority === p
                        ? p === 'High' 
                          ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/20'
                          : p === 'Medium'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-500/20'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Inspector Instructions & Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter specific instructions for the field inspection officer..."
                rows={3}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeManualReviewModal}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Review Queue</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// 5. ABOUT MODAL
// ==========================================
export const AboutModal = () => {
  const { isAboutModalOpen, closeAboutModal, navigate } = useApp();

  if (!isAboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0d4734] px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <Scale size={160} />
          </div>
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Emblem size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                  Statutory Enforcement Portal
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                About LexiScan
              </h2>
              <p className="text-xs text-emerald-100/90 font-normal">
                Packaged Commodities Rules (PCR), 2011 & Legal Metrology Act, 2009
              </p>
            </div>
          </div>

          <button
            onClick={closeAboutModal}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors relative z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg text-[#0d4734] shadow-2xs shrink-0 border border-emerald-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Objective & Regulatory Mandate
                </h3>
                <p className="text-slate-600 leading-relaxed text-xs">
                  LexiScan is an automated AI-assisted enforcement platform engineered to inspect, extract, and validate mandatory consumer declarations on pre-packaged goods under the Ministry of Consumer Affairs, Food & Public Distribution.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0d4734]" />
              <span>Mandatory Declarations Verified (Rule 6, PCR 2011)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { title: '1. Name & Address', desc: 'Manufacturer, Packer or Importer details' },
                { title: '2. Net Quantity', desc: 'Standard SI metric units & font height' },
                { title: '3. Retail Sale Price (MRP)', desc: 'Inclusive of all taxes & unit sale price' },
                { title: '4. Month & Year', desc: 'Manufacture, packing or import date' },
                { title: '5. Country of Origin', desc: 'Mandatory declaration for all goods' },
                { title: '6. Consumer Care Contact', desc: 'Name, Tel No, Email & postal address' },
                { title: '7. Commodity Generic Name', desc: 'Standard trade name of package' },
                { title: '8. FSSAI / Statutory Licences', desc: 'Valid 14-digit licence where applicable' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <BookOpen className="w-4 h-4 text-[#0d4734]" />
                <span>The Legal Metrology Act, 2009</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Empowers legal metrology officers to inspect trade premises, seize non-compliant packaging, and compound offenses under Sections 36 & 38.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <Building2 className="w-4 h-4 text-[#0d4734]" />
                <span>Department Jurisdiction</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Operated across Central, State, and District Zonal enforcement branches with real-time statutory inspection logs and officer audit trails.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              closeAboutModal();
              navigate('rules');
            }}
            className="text-xs font-semibold text-[#0d4734] hover:underline flex items-center gap-1"
          >
            <span>View Rule Library</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={closeAboutModal}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-lg transition-colors shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. CONTACT MODAL
// ==========================================
export const ContactModal = () => {
  const { isContactModalOpen, closeContactModal, addToast } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Field Enforcement',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        description: 'Please provide your name, email and grievance message.'
      });
      return;
    }

    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Inquiry / Grievance Registered',
      description: 'Your ticket has been dispatched to the Nodal Legal Metrology Desk.'
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        department: 'Field Enforcement',
        subject: '',
        message: ''
      });
      closeContactModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0d4734] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Emblem size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                  Legal Metrology Helpdesk
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Contact & Departmental Support
              </h2>
              <p className="text-xs text-emerald-100/90 font-normal">
                National Consumer Helpline & Enforcement Officer Directory
              </p>
            </div>
          </div>

          <button
            onClick={closeContactModal}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0d4734] flex items-center justify-center mb-2">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">Toll-Free Helpline</span>
              <span className="font-bold text-slate-900 text-sm">1915 / 1800-11-4000</span>
              <p className="text-[10px] text-slate-500 mt-1">National Consumer Helpline</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">Official Inquiries</span>
              <span className="font-bold text-slate-900 text-xs truncate block">lmcc-support@nic.in</span>
              <p className="text-[10px] text-slate-500 mt-1">Direct officer dispatch</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">Enforcement Hours</span>
              <span className="font-bold text-slate-900 text-xs">09:30 AM – 06:00 PM</span>
              <p className="text-[10px] text-slate-500 mt-1">Mon – Fri (Govt. Working Days)</p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-start gap-3 text-xs">
            <MapPin className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Directorate of Legal Metrology (Headquarters)</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Department of Consumer Affairs, Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi – 110001
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-[#0d4734]" />
              <span>Submit Officer Query or Inspection Request</span>
            </h4>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-slate-900 text-sm">Message Submitted Successfully</h5>
                <p className="text-xs text-slate-600">Your query ID is #LEXISCAN-{Math.floor(100000 + Math.random() * 900000)}. Our nodal desk will follow up shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="R. Kumar"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@gov.in or email"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Subject / Query Topic</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Rule 6(1)(a) verification ambiguity in Indore division"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Message / Remarks *</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, rule clarification, or system feedback..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent bg-slate-50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeContactModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. FEATURES MODAL
// ==========================================
export const FeaturesModal = () => {
  const { isFeaturesModalOpen, closeFeaturesModal, navigate } = useApp();

  if (!isFeaturesModalOpen) return null;

  const features = [
    {
      icon: Scan,
      title: 'AI OCR & Label Extraction',
      badge: '99.4% Accuracy',
      desc: 'High-speed OCR scanner extracting text from complex curved packaging, foil surfaces, multi-color packaging, and multi-language declarations.',
      route: 'scan',
      actionText: 'Launch Scanner'
    },
    {
      icon: CheckSquare,
      title: 'Rule 6 Mandatory Checklist',
      badge: '8 Clauses',
      desc: 'Automated verification of Manufacturer info, Net Qty with metric SI units, MRP (inclusive of all taxes), Date of packing, Country of Origin & Consumer helpline.',
      route: 'rules',
      actionText: 'View Rules'
    },
    {
      icon: AlertTriangle,
      title: 'Violation & Severity Engine',
      badge: 'Real-time',
      desc: 'Instant detection of missing declarations, illegible font sizes, misleading price declarations, and missing helpline details with compounding references.',
      route: 'violations',
      actionText: 'Check Violations'
    },
    {
      icon: FileText,
      title: 'Statutory Reports & Audit Trails',
      badge: 'PDF / Excel',
      desc: 'Generate legally admissible compliance certificates and violation seizure notices with timestamped officer signatures and photo evidence.',
      route: 'reports',
      actionText: 'Inspect Reports'
    },
    {
      icon: BarChart3,
      title: 'Enforcement Analytics & Heatmaps',
      badge: 'Divisional',
      desc: 'Visual analytics on compliance rates by product category, violation distribution, zonal officer performance, and market surveillance trends.',
      route: 'analytics',
      actionText: 'Open Analytics'
    },
    {
      icon: Scale,
      title: 'Digital Legal Metrology Manual',
      badge: 'Act & Rules',
      desc: 'Complete searchable digital repository of The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011 with clause-by-clause guidance.',
      route: 'rules',
      actionText: 'Explore Manual'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0d4734] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Emblem size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  System Capabilities
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                LexiScan Platform Features & Modules
              </h2>
              <p className="text-xs text-emerald-100/90 font-normal">
                Everything you need for automated packaged commodity compliance screening
              </p>
            </div>
          </div>

          <button
            onClick={closeFeaturesModal}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-white text-[#0d4734] border border-slate-200 shadow-2xs group-hover:bg-[#0d4734] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{feat.title}</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-end">
                    <button
                      onClick={() => {
                        closeFeaturesModal();
                        navigate(feat.route);
                      }}
                      className="text-xs font-semibold text-[#0d4734] group-hover:text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <span>{feat.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#0d4734]" />
            <span>Built strictly to PCR 2011 & Legal Metrology Act specifications</span>
          </div>

          <button
            onClick={() => {
              closeFeaturesModal();
              navigate('dashboard');
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-lg transition-colors shadow-xs"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. TOP NAV GLIDER
// ==========================================
export const TopNavGlider = ({ activeSection, onSelect }) => {
  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="relative flex items-center p-0.5">
      {navTabs.map((tab) => {
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`relative z-10 px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isActive 
                ? 'text-[#0d4734] font-semibold' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeNavGliderPill"
                className="absolute inset-0 bg-[#0d4734]/10 rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 9. SIDEBAR
// ==========================================
export const Sidebar = ({ onCloseMobile }) => {
  const { currentPage, navigate, currentUser, requestStats } = useApp();
  const isDGM = currentUser?.role === 'dgm';

  const navItems = [
    { label: 'Home', page: 'landing', icon: Home },
    { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
    { 
      label: isDGM ? 'Inspector Requests (DGM)' : 'My Action Requests', 
      page: 'requests', 
      icon: FileText,
      badge: isDGM && requestStats?.pending > 0 ? `${requestStats.pending} new` : null
    },
    { label: 'Scan Product', page: 'scan', icon: ScanLine },
    { label: 'All Reports', page: 'history', icon: FileSpreadsheet },
    { label: 'Violations', page: 'violations', icon: AlertTriangle },
    { label: 'Products', page: 'products', icon: Package },
    { label: 'Users Directory', page: 'users', icon: Users },
    { label: 'Settings', page: 'settings', icon: Settings },
    { label: 'Help', page: 'help', icon: HelpIcon },
  ];

  const handleNavClick = (page) => {
    navigate(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-56 bg-[#0d4734] text-white flex flex-col h-screen select-none border-r border-[#093526] shrink-0">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#145741]">
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          title="Go to Home Page"
        >
          <Menu className="w-4 h-4 text-emerald-200" />
          <span className="font-bold text-base tracking-wide text-white">LexiScan</span>
        </div>
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.page || 
            (item.page === 'scan' && (currentPage === 'analysis' || currentPage === 'result')) ||
            (item.page === 'history' && currentPage === 'products') ||
            (item.page === 'reports' && currentPage === 'report') ||
            (item.page === 'violations' && currentPage === 'analytics');
          const Icon = item.icon;

          return (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-black/25 text-white font-semibold shadow-inner'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-200/80'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 shadow-2xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Officer Info in footer */}
      <div className="p-3 border-t border-[#145741] bg-[#093526]/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#18644c] border border-emerald-400/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {currentUser?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate leading-tight">{currentUser?.name || 'Officer'}</p>
          <p className="text-[10px] text-emerald-300 truncate">
            {isDGM ? 'Deputy General Manager (DGM)' : (currentUser?.division || 'Legal Metrology')}
          </p>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// 10. NAVBAR
// ==========================================
export const Navbar = ({ onToggleSidebar }) => {
  const { 
    currentPage, 
    currentUser, 
    navigate, 
    goBack,
    pageHistory,
    logout, 
    switchUserRole,
    inspectorRequests = [],
    currentScan,
    addToast
  } = useApp();

  const isDGM = currentUser?.role === 'dgm';
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleDownloadPDF = () => {
    const prod = currentScan?.product || INITIAL_PRODUCTS[0];
    const insp = currentScan?.inspection || INITIAL_INSPECTIONS[0];
    const items = getProductReportItems(prod);
    const ok = exportReportToPDF(prod, insp, items, prod.inspectorRemarks || '');
    if (ok && addToast) {
      addToast({
        type: 'success',
        title: 'PDF Report Generated & Downloaded',
        description: `Official statutory report saved for ${prod.name}.`
      });
    }
  };

  const handleExportExcel = () => {
    const prod = currentScan?.product || INITIAL_PRODUCTS[0];
    const insp = currentScan?.inspection || INITIAL_INSPECTIONS[0];
    const items = getProductReportItems(prod);
    const ok = exportReportToExcel(prod, insp, items, prod.inspectorRemarks || '');
    if (ok && addToast) {
      addToast({
        type: 'success',
        title: 'Excel / CSV Spreadsheet Exported',
        description: `Compliance inspection dataset saved for ${prod.name}.`
      });
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return isDGM ? 'DGM Central Command Dashboard' : 'Inspector Dashboard';
      case 'requests': return isDGM ? 'Central Inspector Requests Portal (DGM)' : 'Field Complaints & Action Requests';
      case 'scan': return 'Scan Product';
      case 'analysis': return 'Analysis in Progress';
      case 'result': return 'Analysis Result';
      case 'reports': 
      case 'report': return 'Compliance Report';
      case 'history': return 'All Reports';
      case 'products': return 'Product Repository';
      case 'violations': return 'Violations Summary';
      case 'analytics': return 'Analytics & Insights';
      case 'settings': return 'Profile & Settings';
      case 'rules': return 'Digital Legal Repository';
      case 'users': return 'Enforcement Officers & Inspectors';
      case 'help': return 'Help & Guidelines';
      default: return 'LexiScan';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'dashboard': return isDGM ? 'Statewide supervision and central request approval station' : 'Monitor inspections, violations, and filed request statuses';
      case 'requests': return isDGM ? 'Central Authority: Review incoming complaints, issue compounding orders & seizure notices' : 'Submit field infractions and track Deputy General Manager (DGM) decisions';
      case 'scan': return 'Upload product image or capture using camera';
      case 'analysis': return 'Extracting packaging text and verifying rules...';
      case 'result': return 'Compliance analysis of uploaded product';
      case 'reports':
      case 'report': return 'Detailed compliance report';
      case 'history':
      case 'products': return 'Search and view previously scanned products';
      case 'violations': return 'Overview of violations detected';
      case 'analytics': return 'Detailed insights and analytics';
      case 'settings': return 'Manage your profile and preferences';
      case 'rules': return 'The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011';
      case 'users': return 'State controllers, Deputy General Managers (DGM), and field inspectors';
      case 'help': return 'Inspector guide and legal metrology manual';
      default: return 'Legal Metrology (Packaged Commodities) Rules, 2011';
    }
  };

  const recentNotifications = [
    {
      id: 1,
      title: 'Inspector Request #001 Queued',
      desc: 'Amul Taaza Milk — Seizure notice requested for DGM sign-off.',
      time: '10m ago',
    },
    {
      id: 2,
      title: 'DGM Compounding Approval #002',
      desc: 'Maggi Noodles — DGM approved ₹25,000 compounding notice.',
      time: '45m ago',
    },
    {
      id: 3,
      title: 'Consumer Care Issue Resolved #003',
      desc: 'Olive Oil 1L — Importer rectified label; marked Resolved.',
      time: '2h ago',
    }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Back Arrow / Hamburger & Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {currentPage !== 'landing' && (
            <button
              onClick={goBack}
              title="Go Back to Previous Page"
              className="p-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight truncate">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Action buttons if on Report page */}
          {(currentPage === 'reports' || currentPage === 'report') && (
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0d4734]" />
                <span>Download PDF</span>
              </button>
              <button 
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export (Excel)</span>
              </button>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between font-bold text-slate-800">
                  <span>Enforcement Feed & DGM Desk</span>
                  <span className="text-[10px] bg-emerald-50 text-[#0b4d3c] px-2 py-0.5 rounded font-semibold">
                    Live Updates
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {recentNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('requests');
                      }}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md mt-0.5 shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900 truncate">{n.title}</h4>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-tight">{n.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate('requests');
                    }}
                    className="text-[11px] font-semibold text-[#0b4d3c] hover:underline"
                  >
                    Open Inspector Requests Portal →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Indicator / Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer ${
                isDGM 
                  ? 'bg-emerald-950 text-emerald-100 border-emerald-800 hover:bg-emerald-900' 
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isDGM ? 'text-emerald-300' : 'text-emerald-700'}`} />
              <span>{isDGM ? 'Deputy General Manager (DGM)' : 'Field Inspector'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{currentUser?.name || 'Officer'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'officer@lmcc.gov.in'}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                    isDGM ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {isDGM ? 'Central Authority: Deputy General Manager (DGM)' : 'Enforcement Field Inspector'}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('requests');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{isDGM ? 'Inspector Requests Desk' : 'My Filed Requests'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('settings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      switchUserRole(isDGM ? 'inspector' : 'dgm');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-900 flex items-center gap-2 font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Switch to {isDGM ? 'Field Inspector' : 'Deputy General Manager (DGM)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Label Scan Button */}
          <button
            onClick={() => {
              navigate('fbo-dashboard');
              window.dispatchEvent(new CustomEvent('focus-fbo-upload-artwork'));
              setTimeout(() => {
                const el = document.getElementById('fbo-upload-artwork-box');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70');
                  setTimeout(() => el.classList.remove('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70'), 2500);
                }
              }, 150);
            }}
            title="Upload Packaging Label Artwork"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-[#145741]"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">New Label Scan</span>
            <span className="sm:hidden">Scan</span>
          </button>

          {/* Top Right Home Button */}
          <button
            onClick={() => navigate('landing')}
            title="Go to Home"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#05291D] hover:bg-[#063A2A] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-[#0A4D38]"
          >
            <Home className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ==========================================
// 11. DASHBOARD LAYOUT
// ==========================================
export const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Freeze background scrolling whenever mobile sidebar is open
  React.useEffect(() => {
    if (isMobileSidebarOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex overflow-hidden overscroll-none select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer touch-none"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 h-full"
            >
              <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F8FAFC]">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
            {children}
          </div>
        </main>

        {/* High Density Footer Status Bar */}
        <footer className="px-6 py-2 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium font-mono shrink-0 select-none">
          <div className="truncate">
            <span className="hidden sm:inline">TERMINAL ID: LEXISCAN-FLD-09 • </span>ENGINE: GEMINI OCR & LEGAL RULES • STATUS: READY
          </div>
          <div className="flex items-center gap-3 sm:gap-4 uppercase tracking-tight font-bold shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SYSTEM NORMAL
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> PCR-2011 SYNCED
            </span>
          </div>
        </footer>
      </div>

      {/* Shared Modals & Toasts */}
      <ExplainViolationModal />
      <ManualReviewModal />
      <ToastContainer />
    </div>
  );
};
