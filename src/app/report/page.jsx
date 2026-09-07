/**
 * ============================================================================
 * REPORT / NOTICE GENERATOR PAGE (src/app/report/page.jsx)
 * ============================================================================
 * 
 * Generates and prints official Form-V Statutory Notices & Certificates under
 * Section 36 of the Legal Metrology Act, 2009.
 */

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Share2, 
  FileText, 
  Scale,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { ReportPreview } from '../../components/ReportPreview.jsx';

export default function ReportPage() {
  const { selectedProduct, activeInspection, navigate, showToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Inspection Notice compiled as official PDF archive.');
  };

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <div className="no-print">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col lg:pl-64">
        <div className="no-print">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
          
          {/* Action Toolbar */}
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <button
                onClick={() => navigate('result')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0d4734] mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Verification Result</span>
              </button>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Statutory Notice & Certificate Generator
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Form-V</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Official Document Preview */}
          <ReportPreview
            product={selectedProduct}
            inspection={activeInspection}
            onPrint={handlePrint}
          />

        </main>
      </div>
    </div>
  );
}
