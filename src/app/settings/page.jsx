/**
 * ============================================================================
 * STATION & OFFICER SETTINGS (src/app/settings/page.jsx)
 * ============================================================================
 * 
 * Configures enforcement terminal preferences:
 * - OCR confidence threshold (95% default)
 * - Automatic Form-V notice drafting
 * - Enforcement division jurisdiction & officer profile
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Cpu, 
  Bell, 
  FileText, 
  Building2, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';

export default function SettingsPage() {
  const { currentUser, showToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [ocrEngine, setOcrEngine] = useState('paddleocr_gemini');
  const [autoDraftNotice, setAutoDraftNotice] = useState(true);
  const [minConfidence, setMinConfidence] = useState(85);
  const [enforceStrictUsp, setEnforceStrictUsp] = useState(true);
  const [stationName, setStationName] = useState(currentUser?.division || 'Central Zone Enforcement Terminal');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Inspection terminal configuration updated successfully.');
  };

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Enforcement Terminal Settings
              </h2>
              <p className="text-xs text-slate-500">
                Configure Legal Metrology OCR engine parameters and compliance tolerances
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Station Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-[#0d4734]" />
                <h3 className="text-sm font-bold text-slate-900">Enforcement Station & Jurisdiction</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Station Jurisdiction Name</label>
                  <input
                    type="text"
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#0d4734] outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Active Inspecting Officer</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Inspector Rajesh Sharma'}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* AI Vision & OCR Engine Options */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Cpu className="w-4 h-4 text-[#0d4734]" />
                <h3 className="text-sm font-bold text-slate-900">AI Vision & OCR Engine Tolerances</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary OCR Recognition Engine</label>
                  <select
                    value={ocrEngine}
                    onChange={(e) => setOcrEngine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#0d4734] outline-hidden font-medium"
                  >
                    <option value="paddleocr_gemini">PaddleOCR v4 + Google Gemini Vision Hybrid (Recommended)</option>
                    <option value="gemini_direct">Gemini Vision Native PDP Scanner</option>
                    <option value="tesseract">Standard Metrology OCR Fallback</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Minimum Text Confidence Threshold</span>
                    <span className="font-mono text-[#0d4734]">{minConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(Number(e.target.value))}
                    className="w-full accent-[#0d4734] cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Tokens below this confidence rating will be highlighted in amber for manual officer audit.</p>
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enforceStrictUsp}
                      onChange={(e) => setEnforceStrictUsp(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0d4734] accent-[#0d4734]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Strict Unit Sale Price (USP) Enforcement</span>
                      <span className="text-[11px] text-slate-500">Enforce Rule 6(1)(j) amendment for packages containing more than 1 item or &gt;100g.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoDraftNotice}
                      onChange={(e) => setAutoDraftNotice(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0d4734] accent-[#0d4734]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Auto-Draft Form-V Notice on Rule 6 Failure</span>
                      <span className="text-[11px] text-slate-500">Automatically prepare Section 36 statutory summons when infractions are flagged.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save CTA */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Terminal Configuration</span>
              </button>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
}
