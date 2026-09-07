/**
 * ============================================================================
 * SCAN INTAKE PAGE (src/app/scan/page.jsx)
 * ============================================================================
 * 
 * Provides multiple intake pipelines for commodity packages:
 * 1. Upload local photo / label crop
 * 2. Camera snapshot capture
 * 3. Quick preset selection (Amul, Parle-G, Lays, Maggi, Coca-Cola)
 */

import React, { useState } from 'react';
import { Camera, Sparkles, Scale, Info, ArrowLeft } from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { UploadBox } from '../../components/UploadBox.jsx';

export default function ScanPage() {
  const { startNewScan, navigate } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productNameInput, setProductNameInput] = useState('');

  const handleImageSelected = (imageDataUrl, fileName) => {
    startNewScan(imageDataUrl, productNameInput || fileName.replace(/\.[^/.]+$/, ''));
  };

  const handleSelectPreset = (preset) => {
    startNewScan(preset.image, preset.name, preset.id);
  };

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0d4734] mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Commodity Packaging Verification Intake
              </h2>
              <p className="text-xs text-slate-500">
                Upload or photograph packaging label for instant OCR and Rule 6 compliance assessment
              </p>
            </div>
          </div>

          {/* Optional Product Name input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Commodity Name / Brand Identifier (Optional)
            </label>
            <input
              type="text"
              value={productNameInput}
              onChange={(e) => setProductNameInput(e.target.value)}
              placeholder="e.g. Parle-G 800g Biscuits, Amul Butter 500g..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#0d4734] outline-hidden"
            />
          </div>

          {/* Upload and Preset Selection Component */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <UploadBox
              onImageSelected={handleImageSelected}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Legal Notice note */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#0d4734]">Legal Metrology Verification SOP Note:</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Ensure the Principal Display Panel (PDP) and the manufacturer information panel are clearly legible with minimal glare or distortion. High contrast photography ensures 99.4% OCR token accuracy.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
