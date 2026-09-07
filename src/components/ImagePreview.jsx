/**
 * ============================================================================
 * IMAGE PREVIEW COMPONENT - BOUNDING BOX OVERLAY CANVAS
 * ============================================================================
 * 
 * Renders the uploaded commodity package with interactive bounding box tokens:
 * - Highlights Net Quantity, MRP, Manufacturer, Date stamps
 * - Hover / click token inspect tool
 * - High-contrast overlay toggle
 */

import React, { useState } from 'react';
import { Layers, ZoomIn, Eye, Sparkles } from 'lucide-react';

export const ImagePreview = ({ image, tokens = [], selectedToken, onSelectToken }) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
      {/* Control bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0d4734]" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Principal Display Panel (PDP)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              showBoundingBoxes 
                ? 'bg-emerald-100 text-[#0d4734] border border-emerald-300' 
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {showBoundingBoxes ? '✓ Bounding Boxes: ON' : 'Bounding Boxes: OFF'}
          </button>
        </div>
      </div>

      {/* Visual stage */}
      <div className="relative w-full aspect-square max-h-[420px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center select-none">
        {image ? (
          <img
            src={image}
            alt="Commodity package scan"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-slate-500 text-xs font-mono">No Image Loaded</div>
        )}

        {/* Dynamic Bounding Box Overlay */}
        {showBoundingBoxes && tokens.map((t) => {
          const [x, y, w, h] = t.box || [20, 20, 30, 10];
          const isSelected = selectedToken?.id === t.id;

          return (
            <div
              key={t.id}
              onClick={() => onSelectToken && onSelectToken(t)}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
              }}
              className={`absolute border-2 transition-all cursor-pointer rounded-sm ${
                isSelected 
                  ? 'border-amber-400 bg-amber-400/30 z-20 shadow-md ring-2 ring-amber-300' 
                  : 'border-emerald-400 bg-emerald-400/15 hover:bg-emerald-400/25 z-10'
              }`}
              title={`${t.text} (${Math.round(t.confidence * 100)}%)`}
            >
              <span className="absolute -top-4 left-0 bg-slate-900 text-white text-[9px] font-mono px-1 py-0.2 rounded opacity-90 truncate max-w-[120px]">
                {t.field || 'token'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer token status */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Detected Tokens: {tokens.length}</span>
        <span className="text-emerald-700 font-semibold">PaddleOCR v4 / Gemini Vision</span>
      </div>
    </div>
  );
};
