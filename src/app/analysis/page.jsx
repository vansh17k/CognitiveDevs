/**
 * ============================================================================
 * ANALYSIS SCANNER PAGE (src/app/analysis/page.jsx)
 * ============================================================================
 * 
 * Animated pipeline screen simulating real-time computer vision & OCR token extraction.
 */

import React, { useState } from 'react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { LoadingScanner } from '../../components/LoadingScanner.jsx';

export default function AnalysisPage() {
  const { scannedImage, navigate } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <LoadingScanner
            image={scannedImage}
            durationMs={2200}
            onComplete={() => navigate('result')}
          />
        </main>
      </div>
    </div>
  );
}
