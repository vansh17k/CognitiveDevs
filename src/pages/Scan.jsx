import React, { useState, useRef } from 'react';
import { useApp } from '../App.jsx';
import { 
  UploadCloud, 
  Camera, 
  Check, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data.js';

export const Scan = () => {
  const { startNewScan, navigate } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setPreviewUrl(url);
      startNewScan(url, file.name);
      navigate('analysis');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample) => {
    startNewScan(sample.imageUrl, sample.name, sample.id);
    navigate('analysis');
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access not granted or unavailable:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraActive(false);
        startNewScan(dataUrl, 'Camera_Capture_' + Date.now() + '.jpg');
        navigate('analysis');
      }
    }
  };

  const recentScans = [
    {
      id: 'insp-1',
      name: 'Parle-G Biscuit',
      date: '12 May 2025',
      status: 'Compliant',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&auto=format&fit=crop&q=60',
    },
    {
      id: 'insp-2',
      name: 'Amul Taaza Milk',
      date: '11 May 2025',
      status: 'Non-Compliant',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60',
    },
    {
      id: 'insp-3',
      name: 'Lays Classic',
      date: '11 May 2025',
      status: 'Compliant',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=150&auto=format&fit=crop&q=60',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left / Main Section (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        
        {/* Upload & Capture Grid Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
            
            {/* Box 1: Drag & Drop Box (5 cols) */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`md:col-span-5 border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging ? 'border-[#0d4734] bg-emerald-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mb-3 shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-xs font-bold text-slate-800">Drag & Drop image here</p>
              <span className="text-[11px] text-slate-400 my-1 font-medium">or</span>
              
              <button 
                type="button"
                className="px-4 py-1.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Upload File
              </button>

              <p className="text-[10px] text-slate-400 mt-3">JPG, PNG, WEBP (Max 10MB)</p>
            </div>

            {/* Middle "OR" divider (1 col) */}
            <div className="md:col-span-1 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
            </div>

            {/* Box 2: Camera Capture Box (5 cols) */}
            <div className="md:col-span-5 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 min-h-[200px]">
              {isCameraActive ? (
                <div className="w-full space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-40">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={capturePhoto}
                      className="px-4 py-1.5 bg-[#0d4734] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Take Snap
                    </button>
                    <button
                      onClick={() => setIsCameraActive(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center mb-3 shadow-2xs">
                    <Camera className="w-6 h-6 text-slate-700" />
                  </div>

                  <p className="text-xs font-bold text-slate-800">Capture Image</p>
                  
                  <button 
                    onClick={startCamera}
                    type="button"
                    className="mt-3 px-4 py-1.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Use Camera
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Tips for best results */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2.5">Tips for best results</p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                <span>Ensure good lighting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                <span>Focus on label</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                <span>Avoid blur</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Test Samples Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">1-Click Test Packaging Samples</h3>
              <p className="text-[11px] text-slate-500">Test instant Legal Metrology OCR analysis on pre-verified commodities:</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-[#0d4734] font-semibold px-2 py-0.5 rounded">
              Ready to verify
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INITIAL_PRODUCTS.slice(0, 3).map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => handleSelectSample(pkg)}
                className="group p-2.5 rounded-xl border border-slate-200 hover:border-[#0d4734] bg-slate-50/60 hover:bg-emerald-50/30 cursor-pointer transition-all flex items-center gap-3"
              >
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.name}
                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0d4734]">{pkg.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{pkg.category}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-semibold text-[#0d4734]">
                    Scan Sample →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Sidebar: Recent Scans (4 cols) */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Scans</h3>
        </div>

        <div className="divide-y divide-slate-100 my-2">
          {recentScans.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                navigate('result', { productId: item.id === 'insp-2' ? 'prod-2' : 'prod-1' });
              }}
              className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 rounded-lg px-1 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-11 h-11 object-cover rounded-lg border border-slate-200" 
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.date}</p>
                </div>
              </div>

              <div>
                {item.status === 'Compliant' ? (
                  <span className="px-2.5 py-1 rounded-md bg-[#e6f7ef] text-[#0b8a4f] text-[11px] font-semibold flex items-center gap-1">
                    ✓ Compliant
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-[#fdeeed] text-[#d93025] text-[11px] font-semibold flex items-center gap-1">
                    ● Non-Compliant
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center border-t border-slate-100">
          <button
            onClick={() => navigate('history')}
            className="text-xs font-bold text-slate-800 hover:text-[#0b4d3c] transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
};
