import React, { useEffect } from 'react';
import { useApp } from '../App.jsx';
import { apiService } from '../api.js';
import { InspectionPipelineScreen } from '../components/InspectionPipelineScreen.jsx';

export const Analysis = () => {
  const { currentScan, updateCurrentScanWithAiResult, navigate, currentUser } = useApp();

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
          if (updateCurrentScanWithAiResult) {
            updateCurrentScanWithAiResult(response.data);
          }
        }
      }).catch(() => {
        // Fallback already maintained
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [currentScan, updateCurrentScanWithAiResult]);

  const fallbackProduct = {
    name: 'Amul Taaza Toned Milk',
    reportId: 'LM-2025-0513',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
  };

  const product = currentScan?.product || fallbackProduct;

  return (
    <div className="w-full">
      <InspectionPipelineScreen
        imageUrl={product.imageUrl}
        productTitle={product.name}
        role={currentUser?.role || 'inspector'}
        onComplete={() => navigate('result')}
        onSkip={() => navigate('result')}
        reportId={product.reportId || 'LM-INSP-2026-08'}
      />
    </div>
  );
};
