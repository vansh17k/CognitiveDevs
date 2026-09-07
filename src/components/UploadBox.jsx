/**
 * ============================================================================
 * UPLOAD BOX COMPONENT - MULTI-CHANNEL PACKAGE INTAKE
 * ============================================================================
 * 
 * Supports:
 * - Drag-and-drop packaging label images (JPEG, PNG, WebP)
 * - File picker dialog
 * - Quick preset selection for immediate demonstration
 * - Live camera intake integration
 */

import React, { useRef, useState } from 'react';
import { Upload, Camera, Sparkles, FileImage, Image as ImageIcon } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products.js';

export const UploadBox = ({ onImageSelected, onSelectPreset }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag and drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-[#0d4734] bg-emerald-50/60 scale-[1.01]' 
            : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0d4734] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Upload Commodity Package Photo or Label
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          Drag and drop high-resolution front or back panel image, or click to browse files. Supports PNG, JPG, WebP.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d4734] text-white text-xs font-semibold shadow-xs hover:bg-[#083325] transition-colors pointer-events-none"
          >
            <Camera className="w-4 h-4" />
            <span>Select Local Image</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">Max file size: 15 MB</span>
        </div>
      </div>

      {/* Preset Commodity Test Cases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Or Choose a Verified PCR Test Preset
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">Click to load instantaneously</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {INITIAL_PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              onClick={() => onSelectPreset(prod)}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:border-[#0d4734] hover:shadow-sm text-left transition-all group cursor-pointer"
            >
              <div className="w-full h-20 bg-slate-50 rounded-lg mb-2 p-1 flex items-center justify-center overflow-hidden">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                />
              </div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#0d4734] truncate">
                {prod.name}
              </p>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                <span className="text-slate-500">{prod.brand}</span>
                <span className={`font-bold ${prod.complianceScore >= 90 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {prod.complianceScore}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
