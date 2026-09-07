import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Upload, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Eye, 
  Sparkles,
  Info,
  Shield,
  Layers
} from 'lucide-react';

export const FboCorrectiveAction = () => {
  const { 
    fboCorrectiveActions = [], 
    setFboCorrectiveActions,
    navigate, 
    addToast 
  } = useApp();

  const [activeCapa, setActiveCapa] = useState(fboCorrectiveActions[0] || null);
  const [correctiveText, setCorrectiveText] = useState(
    activeCapa?.correctiveActionDescription || ''
  );
  const [preventiveText, setPreventiveText] = useState(
    activeCapa?.preventiveActionDescription || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trackerSteps = [
    { num: 1, title: 'Official Issue Received', actor: 'Officer' },
    { num: 2, title: 'FBO Reviews Requirement', actor: 'FBO' },
    { num: 3, title: 'FBO Uploads Correction', actor: 'FBO' },
    { num: 4, title: 'FBO Submits Response', actor: 'FBO' },
    { num: 5, title: 'Inspector Reviews', actor: 'Officer' },
    { num: 6, title: 'DGM Approval (if required)', actor: 'DGM' },
    { num: 7, title: 'Case Status Updated', actor: 'System' }
  ];

  const handleSubmitCapa = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      
      setFboCorrectiveActions(prev => prev.map(c => {
        if (c.id === activeCapa.id) {
          return {
            ...c,
            currentStep: 4,
            status: 'Awaiting Officer Review',
            correctiveActionDescription: correctiveText,
            preventiveActionDescription: preventiveText,
            officerFeedback: 'Transmission received. Queued for Inspector evaluation.'
          };
        }
        return c;
      }));

      addToast({
        type: 'success',
        title: 'CAPA Transmitted to Officer',
        description: 'Corrective Action Plan submitted. Status changed to: Awaiting Officer Review.'
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Corrective and Preventive Action (CAPA) Workflow
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit root cause analyses, revised artwork proofs, and preventive packaging controls in response to audit findings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Active Action Plans:</span>
          <span className="px-2.5 py-1 bg-emerald-50 text-[#0d4734] font-bold text-xs rounded-lg border border-emerald-200">
            {fboCorrectiveActions.length} Total
          </span>
        </div>
      </div>

      {/* Select CAPA Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {fboCorrectiveActions.map((capa) => (
          <button
            key={capa.id}
            onClick={() => {
              setActiveCapa(capa);
              setCorrectiveText(capa.correctiveActionDescription || '');
              setPreventiveText(capa.preventiveActionDescription || '');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeCapa?.id === capa.id
                ? 'bg-[#0d4734] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{capa.id} - {capa.productName.split(' ')[0]} {capa.productName.split(' ')[1]}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              activeCapa?.id === capa.id 
                ? 'bg-[#083325] text-emerald-200' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {capa.status}
            </span>
          </button>
        ))}
      </div>

      {activeCapa && (
        <div className="space-y-6">
          
          {/* 7-Step Interactive Visual Workflow Tracker */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0d4734]" />
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                  7-Step Regulatory Corrective Action Lifecycle
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">Status:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  activeCapa.status === 'Awaiting Officer Review'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-emerald-50 text-[#0d4734] border-emerald-200'
                }`}>
                  {activeCapa.status}
                </span>
              </div>
            </div>

            {/* 7 Horizontal Step Bubbles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {trackerSteps.map((step) => {
                const isCompleted = activeCapa.currentStep > step.num;
                const isCurrent = activeCapa.currentStep === step.num;

                return (
                  <div 
                    key={step.num}
                    className={`p-3 rounded-xl border text-center relative transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : isCurrent
                        ? 'bg-[#0d4734] text-white border-[#0d4734] shadow-md ring-2 ring-emerald-100'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-white text-[#0d4734]'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : step.num}
                      </span>
                    </div>

                    <div className="font-bold text-[11px] leading-tight">
                      {step.title}
                    </div>

                    <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1 ${
                      isCurrent ? 'text-emerald-200' : 'opacity-70'
                    }`}>
                      {step.actor}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Before vs After Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            
            {/* Before (Non-Compliant Issue) */}
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                  Before: Official Issue Flagged
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Original Artwork</span>
              </div>
              <p className="text-xs font-semibold text-rose-950">
                {activeCapa.issueSummary}
              </p>
              <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Identified Root Cause:</span>
                <p>{activeCapa.rootCause}</p>
              </div>
            </div>

            {/* After (Corrective Action Proposed) */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  After: Re-Engineered Packaging Control
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v2.1 Proof Proofing</span>
              </div>
              <p className="text-xs font-semibold text-emerald-950">
                Batch window font enlarged to 3.0mm; Fortification (+F) mark scaled to 7.0mm.
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Automated Verification:</span>
                <p>Packaging line optical camera inspection configured to enforce zero-defect release.</p>
              </div>
            </div>

          </div>

          {/* Interactive Response Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Submit / Update CAPA Response Statement
            </h3>

            <form onSubmit={handleSubmitCapa} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corrective Action Statement (Immediate Fix) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={correctiveText}
                  onChange={e => setCorrectiveText(e.target.value)}
                  placeholder="Describe exact modifications made to packaging, formulation, or labelling..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preventive Action Plan (Long-term Process Control) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={preventiveText}
                  onChange={e => setPreventiveText(e.target.value)}
                  placeholder="Describe SOP revisions, supplier audits, or quality gates introduced to prevent recurrence..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                />
              </div>

              {/* Uploaded Evidence Cards */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attached Artwork Proofs & Laboratory Reports
                </label>
                <div className="space-y-2">
                  {activeCapa.uploadedFiles?.map((f, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0d4734]" />
                        <span className="font-semibold text-slate-800">{f.name}</span>
                        <span className="text-slate-400">({f.size})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{f.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Target Officer: <strong>Inspector Rajesh Sharma (Indore Division)</strong>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-emerald-300" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit to Regulatory Officer'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
