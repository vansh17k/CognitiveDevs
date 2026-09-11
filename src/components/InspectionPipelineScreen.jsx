import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  ScanLine,
  Eye,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const PIPELINE_STAGES = [
  {
    id: 1,
    title: 'Image Preprocessing & PCR-2011 Scanning',
    description: 'Normalizing contrast and text zone extraction',
    duration: '0.4s',
    delay: 400
  },
  {
    id: 2,
    title: 'Text & Symbol Extraction',
    description: 'PaddleOCR / EasyOCR text recognition engine',
    duration: '0.6s',
    delay: 1000
  },
  {
    id: 3,
    title: 'Mandatory Declaration Detection',
    description: 'Parsing MRP, Net Qty, Mfg Address, Date',
    duration: '0.5s',
    delay: 1500
  },
  {
    id: 4,
    title: 'Rule Engine Validation',
    description: 'Validating against Packaged Commodities Rules, 2011',
    duration: '0.8s',
    delay: 2300
  },
  {
    id: 5,
    title: 'Compliance Scoring & Explainability',
    description: 'Generating final score, violations & legal evidence',
    duration: '0.5s',
    delay: 2800
  }
];

export const InspectionPipelineScreen = ({
  imageUrl,
  productTitle = 'Packaged Commodity',
  role = 'inspector',
  onComplete,
  onSkip,
  reportId = 'LM-INSP-2026-08'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timersRef = useRef([]);

  const isConsumer = role === 'consumer';
  const isDgm = role === 'dgm';

  useEffect(() => {
    // Clear any previous timers
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];

    // Step 1 done, step 2 active
    const t1 = setTimeout(() => setCurrentStepIndex(1), 400);
    // Step 2 done, step 3 active
    const t2 = setTimeout(() => setCurrentStepIndex(2), 1000);
    // Step 3 done, step 4 active
    const t3 = setTimeout(() => setCurrentStepIndex(3), 1500);
    // Step 4 done, step 5 active
    const t4 = setTimeout(() => setCurrentStepIndex(4), 2300);
    // All 5 stages complete
    const t5 = setTimeout(() => {
      setCurrentStepIndex(5);
      setIsDone(true);
      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      timersRef.current.push(finishTimer);
    }, 2800);

    timersRef.current = [t1, t2, t3, t4, t5];

    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, [onComplete]);

  const handleManualFinish = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    setCurrentStepIndex(5);
    setIsDone(true);
    if (onComplete) {
      onComplete();
    } else if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0d4734] text-white rounded-xl shadow-xs">
            <ScanLine className="w-5 h-5 animate-pulse text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                {isDone ? 'Inspection Pipeline Complete' : 'Statutory Inspection & PCR-2011 Scanning'}
              </h2>
              <span className="text-[10px] font-mono bg-emerald-50 text-[#0d4734] border border-emerald-300 font-bold px-2 py-0.5 rounded">
                {reportId}
              </span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>PaddleOCR v2.8 + PCR-2011</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isConsumer 
                ? 'Citizen Verification • Zero Data Retention • Immediate ephemeral legal compliance evaluation.'
                : isDgm
                ? 'DLMO(District Legal Metrology Officer) Supervisory Level • Validating packaging imagery against Legal Metrology Rules, 2011.'
                : 'Enforcement Wing • Rule 6, Rule 9 and Rule 18 penal provision bounding box audit.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleManualFinish}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>{isDone ? 'View Audit Canvas' : 'Instant Result'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* Main Grid: Live Scanning Feed (Left) + Exact Inspection Pipeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Live PCR-2011 Scanning Feed & Laser Beam */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#0d4734]" />
                Live PCR-2011 Scanning Feed
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ANALYZING
              </span>
            </div>

            {/* Packaging Image with scanning laser & detection boxes */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner flex items-center justify-center group">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={productTitle} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-500 text-xs font-mono">No Image Feed</div>
              )}

              {/* Laser scanning bar */}
              {!isDone && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#10b981] animate-bounce top-1/3" />
              )}

              {/* Dynamic OCR Bounding Box Highlights */}
              <div className="absolute top-[28%] left-[12%] w-[76%] h-[16%] border-2 border-emerald-400/90 bg-emerald-500/15 rounded-md pointer-events-none flex items-start justify-end p-1 shadow-sm">
                <span className="text-[8px] font-mono font-bold text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded">
                  MRP & Net Qty (Rule 6)
                </span>
              </div>
              <div className="absolute bottom-[22%] left-[14%] w-[72%] h-[18%] border-2 border-emerald-400/80 bg-emerald-500/10 rounded-md pointer-events-none flex items-start justify-end p-1 shadow-sm">
                <span className="text-[8px] font-mono font-bold text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded">
                  Mfg Address & Origin (Rule 9)
                </span>
              </div>

              {/* Live coordinates ticker */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-emerald-400">
                <span>PDP Area: 182 cm²</span>
                <span>Confidence: 97.4%</span>
              </div>
            </div>

            <div className="mt-3.5 text-center">
              <p className="text-xs font-bold text-slate-900 truncate">{productTitle}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">High-Precision Neural PCR-2011 Scanning Feed</p>
            </div>
          </div>

          {/* Quick info banner */}
          <div className="mt-5 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center gap-2.5 text-xs text-slate-700">
            <Sparkles className="w-4 h-4 text-[#0d4734] shrink-0" />
            <span className="text-[11px] leading-snug">
              Verifying 8 statutory declarations, metric units, and font height requirements.
            </span>
          </div>
        </div>

        {/* Right Col: The Exact Inspection Pipeline 5 Automated Stages Card from User's Screenshot */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
            {/* Header: Inspection Pipeline | 5 Automated Stages */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Inspection Pipeline
              </h3>
              <span className="text-xs font-mono text-slate-500 font-medium">
                5 Automated Stages
              </span>
            </div>

            {/* 5 Stages List - Exactly styled matching the provided reference screenshot */}
            <div className="space-y-3.5">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isStepCompleted = currentStepIndex > idx;
                const isStepActive = currentStepIndex === idx;

                return (
                  <div 
                    key={stage.id} 
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isStepCompleted 
                        ? 'bg-emerald-50/20 border-emerald-300' 
                        : isStepActive 
                        ? 'bg-emerald-50/40 border-emerald-400 ring-2 ring-emerald-300/30 shadow-xs' 
                        : 'bg-white border-slate-200/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0">
                        {isStepCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isStepActive ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0d4734] flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-[#0d4734] animate-spin" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-xs font-mono font-medium">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {stage.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-500 font-medium shrink-0">
                      {stage.duration}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0d4734] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((currentStepIndex) / 5) * 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 shrink-0">
                {Math.min(100, Math.round(((currentStepIndex) / 5) * 100))}% Completed
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
