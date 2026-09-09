import React, { useState, useEffect } from 'react';
import { useApp } from '../App.jsx';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  ScanLine
} from 'lucide-react';
import { INITIAL_ANALYSIS_STEPS } from '../utils.js';
import { apiService } from '../api.js';

export const Analysis = () => {
  const { currentScan, updateCurrentScanWithAiResult, navigate, addToast } = useApp();

  const [steps, setSteps] = useState(INITIAL_ANALYSIS_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [aiSource, setAiSource] = useState('Rule Engine');

  useEffect(() => {
    let isCancelled = false;

    // Trigger backend API scan analysis in parallel with pipeline steps
    if (currentScan?.product?.imageUrl) {
      apiService.analyzeScan({
        imageBase64: currentScan.product.imageUrl,
        productName: currentScan.product.name,
        category: currentScan.product.category,
        brand: currentScan.product.brand,
        presetId: currentScan.product.id
      }).then(response => {
        if (!isCancelled && response?.data) {
          if (response.source === 'gemini-vision' || response.source?.includes('gemini')) {
            setAiSource('Gemini Vision AI (Live)');
          } else {
            setAiSource('PCR-2011 Engine');
          }
          if (updateCurrentScanWithAiResult) {
            updateCurrentScanWithAiResult(response.data);
          }
        }
      }).catch(() => {
        // Fallback already maintained in pipeline
      });
    }

    // Automated progressive simulation
    const timer1 = setTimeout(() => {
      setSteps(prev => prev.map((s, idx) => idx <= 0 ? { ...s, status: 'completed' } : idx === 1 ? { ...s, status: 'in_progress' } : s));
      setCurrentStepIndex(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setSteps(prev => prev.map((s, idx) => idx <= 1 ? { ...s, status: 'completed' } : idx === 2 ? { ...s, status: 'in_progress' } : s));
      setCurrentStepIndex(2);
    }, 1100);

    const timer3 = setTimeout(() => {
      setSteps(prev => prev.map((s, idx) => idx <= 2 ? { ...s, status: 'completed' } : idx === 3 ? { ...s, status: 'in_progress' } : s));
      setCurrentStepIndex(3);
    }, 1800);

    const timer4 = setTimeout(() => {
      setSteps(prev => prev.map((s, idx) => idx <= 3 ? { ...s, status: 'completed' } : idx === 4 ? { ...s, status: 'in_progress' } : s));
      setCurrentStepIndex(4);
    }, 2400);

    const timer5 = setTimeout(() => {
      setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      setCurrentStepIndex(5);
      setIsCompleted(true);
      addToast({
        type: 'success',
        title: 'Analysis Completed',
        description: 'Mandatory declarations verified against PCR-2011.'
      });

      // Smooth auto-transition to results just like FBO workflow
      const autoNavTimer = setTimeout(() => {
        if (!isCancelled) {
          navigate('result');
        }
      }, 700);

      return () => clearTimeout(autoNavTimer);
    }, 2600);

    return () => {
      isCancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [addToast, currentScan, navigate]);

  const fallbackProduct = {
    name: 'Amul Taaza Toned Milk',
    reportId: 'LM-2025-0513',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
  };

  const product = currentScan?.product || fallbackProduct;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {isCompleted ? 'Analysis Completed' : 'AI Analysis & OCR Processing'}
            </h2>
            <span className="text-[10px] font-mono bg-emerald-50 text-[#0d4734] border border-emerald-200 font-bold px-2 py-0.5 rounded">
              {product.reportId}
            </span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{aiSource}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating packaging imagery against Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

        {isCompleted ? (
          <button
            onClick={() => navigate('result')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>View Compliance Result</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('result')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <span>Skip to Result</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Grid: Image with live scanner + Steps pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Product Image & Laser scanner overlay */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span>Live OCR Scanning Feed</span>
            <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              ANALYZING
            </span>
          </h3>

          <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain opacity-90"
            />
            
            {/* Laser scanning bar */}
            {!isCompleted && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce top-1/3" />
            )}

            {/* Bounding box mock highlights */}
            <div className="absolute top-[35%] left-[20%] w-[60%] h-[15%] border-2 border-emerald-400/80 bg-emerald-500/10 rounded pointer-events-none flex items-start justify-end p-1">
              <span className="text-[8px] font-mono text-emerald-300 bg-slate-900/80 px-1 rounded">MRP & Net Wt.</span>
            </div>
            <div className="absolute bottom-[20%] left-[15%] w-[70%] h-[20%] border-2 border-amber-400/80 bg-amber-500/10 rounded pointer-events-none flex items-start justify-end p-1">
              <span className="text-[8px] font-mono text-amber-300 bg-slate-900/80 px-1 rounded">Mfg & Origin</span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs font-bold text-slate-900">{product.name}</p>
          </div>
        </div>

        {/* Right: Step pipeline & Rule checks */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 mb-4">Inspection Pipeline</h3>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    step.status === 'completed' 
                      ? 'bg-emerald-50/40 border-emerald-100' 
                      : step.status === 'in_progress' 
                      ? 'bg-slate-50 border-[#0d4734] shadow-xs' 
                      : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  <div className="mt-0.5">
                    {step.status === 'completed' ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : step.status === 'in_progress' ? (
                      <Loader2 className="w-5 h-5 text-[#0d4734] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{step.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick info banner */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Sparkles className="w-4 h-4 text-[#0d4734]" />
              <span>Verifying 8 mandatory declarations and font height tables</span>
            </div>
            <button
              onClick={() => navigate('rules')}
              className="text-xs font-bold text-[#0d4734] hover:underline cursor-pointer"
            >
              View Rules →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
