/**
 * ============================================================================
 * LOADING SCANNER COMPONENT - AI VISION PIPELINE ANIMATION
 * ============================================================================
 * 
 * Cinematic OCR scanner simulation displaying real-time processing milestones:
 * 1. Image binarization & contrast normalization
 * 2. Principal Display Panel (PDP) segmentation
 * 3. PaddleOCR multi-lingual text token extraction
 * 4. PCR Rule 6 statutory cross-matching
 * 5. Section 36 penalty & font calculation
 */

import React, { useEffect, useState } from 'react';
import { Camera, CheckCircle2, Cpu, ShieldCheck, Sparkles, Scale } from 'lucide-react';

export const LoadingScanner = ({ image, onComplete, durationMs = 2800 }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Normalizing image contrast & detecting packaging surface...', icon: Camera },
    { label: 'Segmenting Principal Display Panel (PDP) under Rule 7...', icon: Scale },
    { label: 'Running PaddleOCR tokenization on Net Qty, MRP & Dates...', icon: Cpu },
    { label: 'Verifying mandatory declarations against PCR 2011 clauses...', icon: Sparkles },
    { label: 'Finalizing compliance certificate and Form-V audit trail...', icon: ShieldCheck }
  ];

  useEffect(() => {
    const intervalTime = 50;
    const increment = (100 / (durationMs / intervalTime));

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }

        const stepIdx = Math.min(
          steps.length - 1,
          Math.floor((next / 100) * steps.length)
        );
        setCurrentStep(stepIdx);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationMs, onComplete]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xl">
      {/* Scanner Visual Frame */}
      <div className="relative w-48 h-48 mx-auto mb-6 bg-slate-900 rounded-2xl overflow-hidden border-2 border-[#0d4734] shadow-md flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <Scale className="w-16 h-16 text-emerald-400 opacity-40 animate-pulse" />
        )}

        {/* Laser scanner bar */}
        <div 
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
          style={{
            top: `${(progress % 100)}%`,
            transition: 'top 0.1s linear'
          }}
        />

        {/* Targeting crosshairs */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
      </div>

      {/* Status Heading */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900">
        AI Legal Metrology Verification in Progress
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1 min-h-[40px] flex items-center justify-center">
        {steps[currentStep]?.label}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden border border-slate-200">
        <div 
          className="bg-[#0d4734] h-full rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Engine: Gemini Vision / PaddleOCR</span>
        <span className="font-bold text-[#0d4734]">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
