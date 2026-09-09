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
  Layers
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data.js';
import { ECOMMERCE_SAMPLES, parseProductFromUrl } from '../data/ecommerceSamples.js';

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
  const { startNewScan, navigate, addToast } = useApp();
  const [showEcomPanel, setShowEcomPanel] = useState(defaultTab === 'ecommerce');
  const ecomSectionRef = useRef(null);
  
  // Physical scan states
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

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

    const detected = detectMarketplace(urlToFetch);
    setIsFetchingUrl(true);

    setTimeout(() => {
      setIsFetchingUrl(false);
      
      // Accurately parse product data from any URL (including user's Amazon Lay's link)
      const extractedProduct = parseProductFromUrl(urlToFetch);
      
      setSelectedEcomSample(extractedProduct);
      setShowEcomPanel(true);
      setActiveImageIndex(0);

      if (immediateAudit) {
        if (addToast) {
          addToast({
            type: 'info',
            title: `E-Commerce PDP Extracted (${extractedProduct.platform})`,
            description: `Extracted ${extractedProduct.title}. Launching automated Legal Metrology Rule 6(10) audit...`
          });
        }
        const chosenImage = extractedProduct.gallery?.[0] || extractedProduct.imageUrl;
        startNewScan(chosenImage, extractedProduct.title, null, extractedProduct);
        navigate('analysis');
      } else {
        if (addToast) {
          addToast({
            type: 'success',
            title: 'PDP Extracted Successfully',
            description: `Extracted ${extractedProduct.title}. Preview listing below or run the compliance audit.`
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
    startNewScan(chosenImage, selectedEcomSample.title, null, selectedEcomSample);
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
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
                {/* Input with deep green rounded border and auto-detect badge */}
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

                {/* Action Button */}
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

        {/* E-COMMERCE LINK SCANNER (RULE 6(10)) - EXPANDABLE/ACTIVE PANEL */}
        {showEcomPanel && (
          <div ref={ecomSectionRef} className="space-y-4">
            {/* Statutory Banner & Auto-Detect Confirmation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0d4734] flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-5 h-5 text-[#0d4734]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 text-sm">
                        Rule 6(10) E-Commerce Digital Listing Verification
                      </p>
                      {selectedEcomSample && (
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 ${selectedEcomSample.platformColor}`}>
                          <span>{selectedEcomSample.platformLogo}</span>
                          <span>Auto-Detected: {selectedEcomSample.platform}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Under Legal Metrology (Packaged Commodities) Rules, 2011, e-commerce marketplaces must declare 
                      all statutory physical package details (MRP, Unit Sale Price, Net Quantity, Country of Origin, Mfg/Packer info) 
                      directly on digital product display pages. Verified automatically from the product link.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Product Listing Preview Card */}
            {selectedEcomSample && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${selectedEcomSample.platformColor}`}>
                      <span>{selectedEcomSample.platformLogo}</span>
                      <span>Auto-Detected: {selectedEcomSample.platform} Listing</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500">• Seller: {selectedEcomSample.sellerName}</span>
                  </div>

                  <a 
                    href={selectedEcomSample.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[11px] text-[#0d4734] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Live URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  {/* Left: Scraped Packaging Photos (5 cols) */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img 
                        src={selectedEcomSample.gallery?.[activeImageIndex] || selectedEcomSample.imageUrl} 
                        alt={selectedEcomSample.title}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                        PDP Image {activeImageIndex + 1} of {selectedEcomSample.gallery?.length || 1}
                      </div>
                    </div>

                    {/* Image thumbnails */}
                    {selectedEcomSample.gallery && selectedEcomSample.gallery.length > 1 && (
                      <div className="flex gap-2">
                        {selectedEcomSample.gallery.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                              activeImageIndex === idx ? 'border-[#0d4734] ring-1 ring-[#0d4734]' : 'border-slate-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Extracted Metadata & Rule 6(10) Check (7 cols) */}
                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {selectedEcomSample.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Brand: <strong>{selectedEcomSample.brand}</strong> | Category: {selectedEcomSample.category}
                      </p>
                    </div>

                    {/* Pricing & Unit Sale Price comparison banner */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Online Listed Price</span>
                        <strong className="text-slate-900 text-sm">₹{selectedEcomSample.listedPrice}</strong>
                      </div>
                      <div className="border-x border-slate-200 px-1">
                        <span className="text-[10px] text-slate-500 block">Package MRP (Rule 6)</span>
                        <strong className="text-slate-900 text-sm">₹{selectedEcomSample.printedMrp}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Unit Sale Price (USP)</span>
                        <strong className={`text-xs ${selectedEcomSample.unitSalePrice?.includes('Missing') ? 'text-red-600 font-bold' : 'text-emerald-700 font-semibold'}`}>
                          {selectedEcomSample.unitSalePrice}
                        </strong>
                      </div>
                    </div>

                    {/* Rule 6(10) Status Alert */}
                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      selectedEcomSample.isRule610Compliant 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-red-50 border-red-200 text-red-950'
                    }`}>
                      {selectedEcomSample.isRule610Compliant ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">
                          {selectedEcomSample.isRule610Compliant 
                            ? 'Rule 6(10) Statutory Compliant' 
                            : 'Potential Statutory Violation Detected'}
                        </p>
                        <p className="text-[11px] mt-0.5 opacity-90">
                          {selectedEcomSample.rule610Status}
                        </p>
                      </div>
                    </div>

                    {/* Primary CTA */}
                    <div className="pt-2">
                      <button
                        onClick={handleLaunchEcomScan}
                        className="w-full py-3 px-4 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-300" />
                        <span>Run AI Legal Metrology Audit on Extracted Packaging →</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>
        )}

    </div>
  );
};
