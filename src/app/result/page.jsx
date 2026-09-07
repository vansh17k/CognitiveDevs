/**
 * ============================================================================
 * OCR RESULT & VERIFICATION PAGE (src/app/result/page.jsx)
 * ============================================================================
 * 
 * 3-Column inspection results screen:
 * - Left: Interactive package canvas with bounding box overlays
 * - Center: Extracted statutory declarations & Rule 6 matrix
 * - Right: Compliance verdict, radial score, violations & Form-V generator CTA
 */

import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Scale,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { ImagePreview } from '../../components/ImagePreview.jsx';
import { DeclarationTable } from '../../components/DeclarationTable.jsx';
import { ComplianceScore } from '../../components/ComplianceScore.jsx';
import { ViolationCard } from '../../components/ViolationCard.jsx';
import { formatINR } from '../../utils/helpers.js';

export default function ResultPage() {
  const { 
    selectedProduct, 
    activeInspection, 
    navigate, 
    explainViolation,
    showToast 
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const product = selectedProduct;
  const violations = product?.violations || [];
  const isCompliant = (product?.complianceScore || 0) >= 90 && violations.length === 0;

  if (!product) {
    return (
      <div className="flex-1 flex bg-slate-100 min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:pl-64">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-8 text-center">
            <p className="text-slate-500">No commodity scan active.</p>
            <button onClick={() => navigate('scan')} className="mt-4 px-4 py-2 bg-[#0d4734] text-white rounded-xl text-xs font-bold">
              Start Scan
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('scan')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0d4734] mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Scan Another Package</span>
              </button>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{product.name}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {product.brand}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('reports')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Form-V Notice / Certificate</span>
              </button>
            </div>
          </div>

          {/* 3-Column Inspection Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1: Image Canvas & Tokens (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <ImagePreview
                image={product.image}
                tokens={product.ocrTokens || []}
                selectedToken={selectedToken}
                onSelectToken={(token) => setSelectedToken(token)}
              />

              {/* Token inspector box */}
              {selectedToken && (
                <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-xs text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-amber-900 uppercase">{selectedToken.field}</span>
                    <span className="text-emerald-700 font-bold">{Math.round(selectedToken.confidence * 100)}% Match</span>
                  </div>
                  <p className="font-mono text-slate-800 font-semibold">{selectedToken.text}</p>
                </div>
              )}
            </div>

            {/* Column 2: Rule 6 Declarations Table (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <DeclarationTable product={product} />
            </div>

            {/* Column 3: Score Verdict & Violations (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Score Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Statutory Scorecard
                </h4>
                <ComplianceScore score={product.complianceScore || 0} />

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Net Quantity:</span>
                    <span className="font-mono font-bold text-slate-800">{product.netQuantityValue || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retail Price:</span>
                    <span className="font-mono font-bold text-slate-800">{formatINR(product.mrpValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Sale Price:</span>
                    <span className="font-mono font-bold text-slate-800">{product.uspValue || 'Omitted'}</span>
                  </div>
                </div>
              </div>

              {/* Violations List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    Flagged Infractions ({violations.length})
                  </h4>
                </div>

                {violations.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Zero infractions. Fully compliant with PCR, 2011.</span>
                  </div>
                ) : (
                  violations.map((v, i) => (
                    <ViolationCard
                      key={v.id || i}
                      violation={v}
                      onExplain={explainViolation}
                    />
                  ))
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
