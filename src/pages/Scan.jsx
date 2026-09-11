import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../App.jsx';
import { 
  UploadCloud, 
  Camera, 
  Check, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Globe,
  Link2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Search,
  RefreshCw,
  AlertTriangle,
  Package,
  Layers,
  FileCheck,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data.js';
import { ECOMMERCE_SAMPLES, parseProductFromUrl } from '../data/ecommerceSamples.js';
import { SAMPLE_FBO_LABELS } from '../utils/fboOcrEngine.js';
import { ScanAuditSplitView } from '../components/ScanAuditSplitView.jsx';
import { normalizeToAuditRecord } from '../utils/scanAuditAdapter.js';
import { InspectionPipelineScreen } from '../components/InspectionPipelineScreen.jsx';

// Helper to auto-detect marketplace directly from the URL link
export const detectMarketplace = (url) => {
  if (!url || !url.trim()) return null;
  const lower = url.toLowerCase();
  if (lower.includes('amazon.')) return { name: 'Amazon', logo: '📦', color: 'bg-amber-600 text-white', badge: 'bg-amber-50 text-amber-900 border-amber-200' };
  if (lower.includes('flipkart.')) return { name: 'Flipkart', logo: '🛒', color: 'bg-blue-600 text-white', badge: 'bg-blue-50 text-blue-900 border-blue-200' };
  if (lower.includes('blinkit.')) return { name: 'Blinkit', logo: '⚡', color: 'bg-yellow-400 text-slate-900', badge: 'bg-yellow-50 text-yellow-950 border-yellow-200' };
  if (lower.includes('zepto.') || lower.includes('zeptonow.')) return { name: 'Zepto', logo: '🟣', color: 'bg-purple-600 text-white', badge: 'bg-purple-50 text-purple-900 border-purple-200' };
  if (lower.includes('swiggy.') || lower.includes('instamart')) return { name: 'Swiggy Instamart', logo: '🟠', color: 'bg-orange-500 text-white', badge: 'bg-orange-50 text-orange-950 border-orange-200' };
  if (lower.includes('bigbasket.') || lower.includes('bbnow')) return { name: 'BigBasket', logo: '🧺', color: 'bg-red-600 text-white', badge: 'bg-red-50 text-red-900 border-red-200' };
  if (lower.includes('jiomart.')) return { name: 'JioMart', logo: '🛍️', color: 'bg-sky-600 text-white', badge: 'bg-sky-50 text-sky-900 border-sky-200' };
  if (lower.includes('myntra.')) return { name: 'Myntra', logo: '👗', color: 'bg-pink-600 text-white', badge: 'bg-pink-50 text-pink-900 border-pink-200' };
  if (lower.includes('nykaa.')) return { name: 'Nykaa', logo: '💄', color: 'bg-rose-600 text-white', badge: 'bg-rose-50 text-rose-900 border-rose-200' };
  if (lower.includes('meesho.')) return { name: 'Meesho', logo: '🌸', color: 'bg-fuchsia-600 text-white', badge: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200' };
  
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = parsed.hostname.replace('www.', '').split('.')[0];
    if (host && host.length > 1) {
      const formatted = host.charAt(0).toUpperCase() + host.slice(1);
      return { name: formatted, logo: '🌐', color: 'bg-emerald-700 text-white', badge: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
    }
  } catch {
    // fallback
  }
  return { name: 'Online Store', logo: '🌐', color: 'bg-slate-700 text-white', badge: 'bg-slate-100 text-slate-800 border-slate-200' };
};

export const Scan = ({ defaultTab = 'physical' }) => {
  const { startNewScan, navigate, addToast, currentUser, openExplainModal } = useApp();
  const [showEcomPanel, setShowEcomPanel] = useState(defaultTab === 'ecommerce');
  const ecomSectionRef = useRef(null);
  
  const isConsumer = currentUser?.role === 'consumer';
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Direct In-Page Audit Result state
  const [auditResult, setAuditResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningProductTitle, setScanningProductTitle] = useState('');
  const [pendingScanRecord, setPendingScanRecord] = useState(null);

  // E-Commerce scan states
  const [ecomUrl, setEcomUrl] = useState('');
  const [selectedEcomSample, setSelectedEcomSample] = useState(ECOMMERCE_SAMPLES[0]);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Real-time auto-detection of marketplace from the link
  const detectedMarketplace = useMemo(() => {
    return detectMarketplace(ecomUrl);
  }, [ecomUrl]);

  useEffect(() => {
    if (defaultTab === 'ecommerce') {
      setShowEcomPanel(true);
      setTimeout(() => {
        ecomSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [defaultTab]);

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

  const triggerAuditPipeline = (imageUrl, title, presetId = null, extraMeta = null) => {
    setScanningProductTitle(title || 'Packaged Commodity');
    setPreviewUrl(imageUrl);
    setIsAnalyzing(true);
    
    // Synchronize App state
    const scanRecord = startNewScan(imageUrl, title, presetId, extraMeta);
    setPendingScanRecord(scanRecord);
  };

  const handleInspectionComplete = () => {
    if (pendingScanRecord) {
      const normalized = normalizeToAuditRecord(pendingScanRecord, currentUser?.role);
      setAuditResult(normalized);
    }
    setIsAnalyzing(false);

    if (addToast) {
      addToast({
        type: 'success',
        title: 'Statutory Verification Complete',
        description: `Visual label canvas and rule citations generated for ${scanningProductTitle || 'product'}.`
      });
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setPreviewUrl(url);
      triggerAuditPipeline(url, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample) => {
    triggerAuditPipeline(sample.imageUrl, sample.name || sample.productName, sample.id);
  };

  const handleSelectEcomSample = (sample) => {
    setSelectedEcomSample(sample);
    setEcomUrl(sample.url);
    setActiveImageIndex(0);
  };

  const handleFetchCustomUrl = (e, immediateAudit = true) => {
    if (e) e.preventDefault();
    const urlToFetch = ecomUrl.trim() || 'https://www.amazon.in/Lays-Hot-Sweet-Chilli-52g/dp/B083F51877';
    if (!ecomUrl.trim()) {
      setEcomUrl(urlToFetch);
    }

    setIsFetchingUrl(true);

    setTimeout(() => {
      setIsFetchingUrl(false);
      
      const extractedProduct = parseProductFromUrl(urlToFetch);
      setSelectedEcomSample(extractedProduct);
      setShowEcomPanel(true);
      setActiveImageIndex(0);

      if (immediateAudit) {
        const chosenImage = extractedProduct.gallery?.[0] || extractedProduct.imageUrl;
        triggerAuditPipeline(chosenImage, extractedProduct.title, null, extractedProduct);
      } else {
        if (addToast) {
          addToast({
            type: 'success',
            title: 'PDP Extracted Successfully',
            description: `Extracted ${extractedProduct.title}. Ready for Legal Metrology audit.`
          });
        }
        setTimeout(() => {
          ecomSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }, 600);
  };

  const handleLaunchEcomScan = () => {
    if (!selectedEcomSample) return;
    const chosenImage = selectedEcomSample.gallery?.[activeImageIndex] || selectedEcomSample.imageUrl;
    triggerAuditPipeline(chosenImage, selectedEcomSample.title, null, selectedEcomSample);
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
        triggerAuditPipeline(dataUrl, 'Camera_Capture_' + Date.now() + '.jpg');
      }
    }
  };

  const handleResetScan = () => {
    setAuditResult(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsCameraActive(false);
  };

  const handleFileNotice = () => {
    navigate('requests', { newRequest: true });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Role-Aware Scanning Header Banner */}
      {isConsumer ? (
        <div className="bg-gradient-to-r from-sky-50 via-teal-50/70 to-emerald-50 border border-sky-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wide bg-sky-600 text-white px-2 py-0.5 rounded">
                  Citizen Public Verification
                </span>
                <span className="text-xs font-bold text-sky-950">
                  Zero Data Retention Guaranteed
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-2xl">
                Aapka upload ya scan kiya hua product data server me <strong>store nahi hota</strong>. Instant Legal Metrology visual canvas inspection ke baad aap turant official PDF report download kar sakte hain.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-sky-100 text-sky-800 border border-sky-200 font-bold px-3 py-1.5 rounded-lg shrink-0">
            Ephemeral Mode: Active
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-slate-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#0d4734] text-white rounded-xl shadow-xs shrink-0">
              <Layers className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wide bg-[#0d4734] text-white px-2 py-0.5 rounded">
                  Enforcement Wing
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  Statutory PCR-2011 Enforcement Inspection
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-2xl">
                High-fidelity OCR bounding box canvas, Section 36 statutory penal provisions, and Rule 6 mandatory declarations audit.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-emerald-100 text-[#0d4734] border border-emerald-300 font-bold px-3 py-1.5 rounded-lg shrink-0">
            Inspector Mode: Active
          </span>
        </div>
      )}

      {/* ACTIVE ANALYZING / OCR STATE: EXACT INSPECTION PIPELINE 5 AUTOMATED STAGES SCREEN */}
      {isAnalyzing && (
        <InspectionPipelineScreen
          imageUrl={previewUrl}
          productTitle={scanningProductTitle || 'Packaged Commodity'}
          role={currentUser?.role || 'inspector'}
          onComplete={handleInspectionComplete}
          onSkip={handleInspectionComplete}
          reportId={pendingScanRecord?.product?.reportId || 'LM-INSP-2026-08'}
        />
      )}

      {/* IF AUDIT RESULT IS ACTIVE: DISPLAY REPLICATED FBO VISUAL CANVAS */}
      {!isAnalyzing && auditResult && (
        <ScanAuditSplitView
          auditResult={auditResult}
          uploadedImage={previewUrl}
          onScanAnother={handleResetScan}
          role={currentUser?.role || 'inspector'}
          isConsumer={isConsumer}
          onFileNotice={handleFileNotice}
          onExplain={openExplainModal}
        />
      )}

      {/* IF NO AUDIT RESULT IS ACTIVE: SHOW SCAN INPUT PORTAL */}
      {!isAnalyzing && !auditResult && (
        <>
          {/* Upload, Capture & E-Commerce Grid Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Box 1: Drag & Drop Packaging Image */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-between cursor-pointer transition-all min-h-[320px] ${
                  isDragging ? 'border-[#0d4734] bg-emerald-50/50 shadow-md scale-[1.01]' : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-3 shadow-md">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-slate-900">Drag & Drop Packaging Image</p>
                  <span className="text-xs text-slate-500 font-medium block">Upload or drop high-resolution packaging photo</span>
                </div>
                
                <button 
                  type="button"
                  className="w-full max-w-[200px] py-3 px-5 bg-[#0d4734] hover:bg-[#083325] text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer my-2"
                >
                  Upload File
                </button>

                <p className="text-xs text-slate-400 font-medium">JPG, PNG, WEBP (Max 10MB)</p>
              </div>

              {/* Box 2: Camera Capture Box */}
              <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-between bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[320px]">
                {isCameraActive ? (
                  <div className="w-full space-y-4 my-auto">
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-52 shadow-md">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={capturePhoto}
                        className="px-5 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-sm font-bold rounded-xl shadow-sm cursor-pointer transition-all"
                      >
                        Take Snap
                      </button>
                      <button
                        onClick={() => setIsCameraActive(false)}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center mb-3 shadow-sm">
                      <Camera className="w-8 h-8 text-slate-800" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-base sm:text-lg font-bold text-slate-900">Live Device Camera</p>
                      <span className="text-xs text-slate-500 font-medium block">Real-time label capture & instant OCR</span>
                    </div>
                    
                    <button 
                      onClick={startCamera}
                      type="button"
                      className="w-full max-w-[200px] py-3 px-5 bg-[#0d4734] hover:bg-[#083325] text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer my-2"
                    >
                      Use Camera
                    </button>

                    <p className="text-xs text-slate-400 font-medium">Direct packaging snap</p>
                  </>
                )}
              </div>

              {/* Box 3: E-Commerce Product Link with direct Fetch & Verify option */}
              <div 
                className="border-2 border-[#0d4734] bg-emerald-50/40 rounded-2xl p-6 text-left flex flex-col justify-between transition-all min-h-[320px] shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#0d4734] flex items-center justify-center shadow-2xs shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-base font-bold text-slate-900 leading-tight">E-Com Link Scan</p>
                          <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap shrink-0">
                            Rule 6(10)
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 block truncate mt-0.5">
                          Auto-detects marketplace from link
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Link Input & Fetch & Verify Button */}
                  <form 
                    onSubmit={(e) => handleFetchCustomUrl(e, true)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full mt-2 flex flex-col gap-2.5"
                  >
                    <div className="relative w-full">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={ecomUrl}
                        onChange={(e) => setEcomUrl(e.target.value)}
                        placeholder="Paste product link (Amazon, Blinkit, etc.)..."
                        className="w-full pl-9 pr-28 py-2.5 bg-white border-2 border-[#0d4734] rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d4734]/30 font-mono shadow-2xs placeholder:text-slate-400"
                      />
                      {detectedMarketplace ? (
                        <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 border rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1 shrink-0 whitespace-nowrap ${detectedMarketplace.badge}`}>
                          <span>{detectedMarketplace.logo}</span>
                          <span>{detectedMarketplace.name}</span>
                        </span>
                      ) : (
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium shrink-0 whitespace-nowrap">
                          Auto-Detect
                        </span>
                      )}
                    </div>

                    <div className="w-full">
                      <button
                        type="submit"
                        disabled={isFetchingUrl}
                        className="w-full py-2.5 px-4 bg-[#0d4734] hover:bg-[#083325] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        {isFetchingUrl ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Checking Listing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
                            <span>Fetch & Check Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Demo URL Shortcuts */}
                <div className="mt-3 pt-3 border-t border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Quick Test Links:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const demoUrl = 'https://www.amazon.in/Lays-Hot-Sweet-Chilli-52g/dp/B083F51877';
                        setEcomUrl(demoUrl);
                      }}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      📦 Lay's 52g (Amazon)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const demoUrl = 'https://blinkit.com/prn/haldirams-bhujia-sev/prid/128392';
                        setEcomUrl(demoUrl);
                      }}
                      className="px-2 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-950 border border-yellow-300 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      ⚡ Bhujia (Blinkit)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const demoUrl = 'https://www.zeptonow.com/pn/cadbury-dairy-milk-silk-150g/pvid/84210';
                        setEcomUrl(demoUrl);
                      }}
                      className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      🟣 Dairy Milk (Zepto)
                    </button>
                  </div>
                </div>
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
                  <span>Focus on label declarations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                  <span>Avoid glare on printed MRP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#0d4734] stroke-[2.5]" />
                  <span>Supports e-commerce product URLs</span>
                </div>
              </div>
            </div>

          </div>

          {/* 1-Click Test Packaging Samples Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">1-Click Test Packaging Samples</h3>
                <p className="text-[11px] text-slate-500">Test instant Legal Metrology OCR analysis on pre-verified physical commodities:</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-[#0d4734] font-semibold px-2 py-0.5 rounded">
                Ready to verify
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Combine FBO High-Fidelity Labels with Classic FMCG Products */}
              {[
                {
                  id: 'sample-fbo-1',
                  name: 'AeroPulse Vitality Sparkling Energy (250ml)',
                  category: 'Beverage / Functional Drink',
                  score: 96,
                  status: 'Ready for Market',
                  imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800&auto=format&fit=crop&q=80'
                },
                {
                  id: 'sample-fbo-2',
                  name: 'Himalayan Gold Organic Green Tea (100g)',
                  category: 'Beverage / Tea',
                  score: 82,
                  status: 'Requires Revision',
                  imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
                },
                {
                  id: 'sample-fbo-3',
                  name: 'Royal Harvest Premium Basmati Rice (5kg)',
                  category: 'Packaged Food / Grain',
                  score: 54,
                  status: 'Requires Revision',
                  imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
                },
                {
                  id: 'sample-fbo-4',
                  name: 'ChocoDelight Hazelnut Cocoa Spread (350g)',
                  category: 'Confectionery',
                  score: 74,
                  status: 'Requires Revision',
                  imageUrl: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&auto=format&fit=crop&q=80'
                },
                ...INITIAL_PRODUCTS.slice(0, 2)
              ].map((pkg) => {
                const isCompliant = (pkg.score || pkg.complianceScore || 0) >= 90;
                const score = pkg.score || pkg.complianceScore || 85;

                return (
                  <div 
                    key={pkg.id}
                    onClick={() => handleSelectSample(pkg)}
                    className="group p-3 rounded-2xl border border-slate-200/90 hover:border-[#0d4734] bg-slate-50/60 hover:bg-emerald-50/30 cursor-pointer transition-all flex items-center gap-3 shadow-2xs hover:shadow-xs"
                  >
                    <img 
                      src={pkg.imageUrl} 
                      alt={pkg.name} 
                      className="w-13 h-13 object-cover rounded-xl border border-slate-200 shrink-0 bg-white" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0d4734]">{pkg.name}</h4>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isCompliant 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : score >= 65 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {score}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 truncate">{pkg.category}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className={`text-[9px] font-semibold truncate ${
                          isCompliant ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {isCompliant ? 'Compliant' : pkg.status || 'Requires Revision'}
                        </span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#0d4734] group-hover:translate-x-0.5 transition-transform">
                        Launch Visual Canvas Audit →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
