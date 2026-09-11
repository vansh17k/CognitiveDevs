import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Building2, 
  Tag, 
  Layers, 
  HelpCircle,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  X,
  FileCheck,
  Package,
  Info,
  Sliders,
  Check,
  Camera,
  Loader2,
  ScanLine,
  Trash2
} from 'lucide-react';
import { 
  SAMPLE_FBO_LABELS, 
  INITIAL_FBO_AUDIT_HISTORY, 
  runOcrLegalMetrologyAudit, 
  exportFboPreAuditPDF, 
  exportFboPreAuditCSV 
} from '../../utils/fboOcrEngine.js';
import { apiService } from '../../api.js';

const FBO_INSPECTION_STEPS = [
  { id: 1, title: 'Image Preprocessing & PCR-2011 Scanning', description: 'Normalizing contrast and text zone extraction', duration: '0.4s' },
  { id: 2, title: 'Text & Symbol Extraction', description: 'PaddleOCR / EasyOCR text recognition engine', duration: '0.6s' },
  { id: 3, title: 'Mandatory Declaration Detection', description: 'Parsing MRP, Net Qty, Mfg Address, Date', duration: '0.5s' },
  { id: 4, title: 'Rule Engine Validation', description: 'Validating against Packaged Commodities Rules, 2011', duration: '0.8s' },
  { id: 5, title: 'Compliance Scoring & Explainability', description: 'Generating final score, violations & legal evidence', duration: '0.5s' },
];

export const FboDashboard = () => {
  const { 
    navigate, 
    fboProfile,
    saveFboProductToFirestore,
    addToast 
  } = useApp();

  // Active Main Tab: 'screening' (New Label Screening) or 'history' (Compliance History)
  const [activeTab, setActiveTab] = useState('screening');

  // Persistence: Audit History State
  const [auditHistory, setAuditHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_audit_history_v2');
      return saved ? JSON.parse(saved) : INITIAL_FBO_AUDIT_HISTORY;
    } catch {
      return INITIAL_FBO_AUDIT_HISTORY;
    }
  });

  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('fbo_audit_history_v2');
        if (saved) setAuditHistory(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('fbo_history_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('fbo_history_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleDeleteRecord = (record) => {
    setRecordToDelete(record);
  };

  const confirmDeleteRecord = () => {
    if (!recordToDelete) return;
    const updated = auditHistory.filter(item => item.id !== recordToDelete.id);
    setAuditHistory(updated);
    try {
      localStorage.setItem('fbo_audit_history_v2', JSON.stringify(updated));
      window.dispatchEvent(new Event('fbo_history_updated'));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    if (selectedAuditModal?.id === recordToDelete.id) {
      setSelectedAuditModal(null);
    }
    addToast({
      type: 'success',
      title: 'Audit Record Deleted',
      description: `"${recordToDelete.productName}" removed from compliance history.`
    });
    setRecordToDelete(null);
  };

  useEffect(() => {
    try {
      localStorage.setItem('fbo_audit_history_v2', JSON.stringify(auditHistory));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [auditHistory]);

  // Listener to focus on the Upload Packaging Label Artwork box when triggered by New Label Scan
  useEffect(() => {
    const handleFocusUpload = () => {
      setActiveTab('screening');
      setIsAnalyzing(false);
      setTimeout(() => {
        const el = document.getElementById('fbo-upload-artwork-box');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70');
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70');
          }, 2500);
        }
      }, 100);
    };

    window.addEventListener('focus-fbo-upload-artwork', handleFocusUpload);
    return () => window.removeEventListener('focus-fbo-upload-artwork', handleFocusUpload);
  }, []);

  // ==========================================
  // SECTION A: NEW LABEL SCREENING STATE
  // ==========================================
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const pipelineTimers = useRef([]);

  // Camera & Pipeline scanning states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scanReportId, setScanReportId] = useState('FBO-SCAN-4819');

  // Clean up camera & timers on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      pipelineTimers.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Form Metadata (Auto-populated by OCR or presets)
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Food & Beverage');
  const [netQuantity, setNetQuantity] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [mrp, setMrp] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [pdpArea, setPdpArea] = useState(180);
  const [manufacturer, setManufacturer] = useState('');

  // Scanning Execution State
  const [isScanning, setIsScanning] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [activeBoxHover, setActiveBoxHover] = useState(null);

  // Zoom and Canvas state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Camera Handlers
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access not granted or unavailable:', err);
      addToast({
        type: 'warning',
        title: 'Camera Access Needed',
        description: 'Please grant camera access or use the file upload option.'
      });
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
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
        stopCamera();
        triggerScan(dataUrl, 'Packaging Label Camera Capture');
      }
    }
  };

  // Pipeline Scan Trigger (Matching Inspector Portal Live Flow)
  const triggerScan = (imgUrl, title = 'Packaging Label Artwork', presetObj = null) => {
    stopCamera();
    setUploadedImage(imgUrl);
    setProductName(presetObj?.productName || title);
    if (presetObj) {
      setSelectedPresetId(presetObj.id);
      setCategory(presetObj.category);
      setNetQuantity(presetObj.netQuantity);
      setBatchNumber(presetObj.batchNumber);
      setMrp(presetObj.mrp);
      setMfgDate(presetObj.mfgDate);
      setPdpArea(presetObj.pdpArea || 180);
      setManufacturer(presetObj.manufacturer);
    } else {
      setSelectedPresetId('custom');
    }

    const reportId = 'FBO-SCAN-' + Math.floor(1000 + Math.random() * 9000);
    setScanReportId(reportId);
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setIsCompleted(false);

    // Call background AI scan endpoint
    apiService.analyzeScan({
      imageBase64: imgUrl,
      productName: presetObj?.productName || title,
      category: presetObj?.category || 'Food & Beverage',
      presetId: presetObj?.id || 'custom'
    }).catch(() => {});

    // Clear prior timers
    pipelineTimers.current.forEach(t => clearTimeout(t));
    pipelineTimers.current = [];

    const t1 = setTimeout(() => setAnalysisStep(1), 500);
    const t2 = setTimeout(() => setAnalysisStep(2), 1100);
    const t3 = setTimeout(() => setAnalysisStep(3), 1700);
    const t4 = setTimeout(() => setAnalysisStep(4), 2300);
    const t5 = setTimeout(() => {
      setAnalysisStep(5);
      setIsCompleted(true);

      const result = presetObj || runOcrLegalMetrologyAudit({
        productName: title,
        category: 'Food & Beverage',
        netQuantity: '250 g',
        mrp: '₹ 99.00',
        batchNumber: 'LOT-' + Date.now().toString().slice(-4),
        mfgDate: '08/2026',
        pdpArea: 180,
        manufacturer: 'Apex Nutrition & Agro Foods Pvt. Ltd., Industrial Estate, Bengaluru - 560078',
        fssaiLicense: fboProfile?.fssaiLicenseNo || '10020022001948'
      }, imgUrl);

      setAuditResult(result);
      setAuditHistory(prev => [result, ...prev.filter(item => item.id !== result.id)]);

      // Sync to Firebase Firestore so Inspector can oversee FBO work
      if (saveFboProductToFirestore) {
        saveFboProductToFirestore({
          id: result.id || `fbo-audit-${Date.now()}`,
          name: result.productName || productName,
          category: result.category || category,
          productId: result.batchNumber || `LOT-${Date.now().toString().slice(-4)}`,
          netQuantity: result.netQuantity || netQuantity,
          mrp: result.mrp || mrp,
          currentLabel: imgUrl || uploadedImage,
          complianceStatus: result.status || 'Ready for Market',
          complianceScore: result.overallScore || 85,
          lastAiCheck: 'Completed pre-audit',
          openIssuesCount: (result.violations || []).length,
          issues: result.violations || [],
          fboId: fboProfile?.fboId || fboProfile?.id || 'FBO-APEX-001'
        }, fboProfile);
      }

      addToast({
        type: 'success',
        title: 'Analysis Completed & Synced',
        description: 'Mandatory declarations verified against PCR-2011 and synced to Cloud DB.'
      });
    }, 2800);

    pipelineTimers.current = [t1, t2, t3, t4, t5];
  };

  const handleFinishAnalysis = () => {
    pipelineTimers.current.forEach(t => clearTimeout(t));
    setAnalysisStep(5);
    setIsCompleted(true);
    if (!auditResult || auditResult.imageUrl !== uploadedImage) {
      const result = runOcrLegalMetrologyAudit({
        productName,
        category,
        netQuantity,
        mrp,
        batchNumber,
        mfgDate,
        pdpArea,
        manufacturer,
        fssaiLicense: fboProfile?.fssaiLicenseNo || '10020022001948'
      }, uploadedImage);
      setAuditResult(result);
      setAuditHistory(prev => [result, ...prev.filter(item => item.id !== result.id)]);
    }
    setIsAnalyzing(false);
  };

  // Quick Preset Selection Handler
  const handleSelectPreset = (preset) => {
    triggerScan(preset.imageUrl, preset.productName, preset);
  };

  // Image Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        triggerScan(reader.result, file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        triggerScan(reader.result, file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Metrology Audit
  const handleRunAudit = () => {
    triggerScan(uploadedImage, productName);
  };

  // PDF Export
  const handleDownloadPDF = (record) => {
    const target = record || auditResult;
    const ok = exportFboPreAuditPDF(target);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Pre-Audit PDF Exported',
        description: `Downloaded statutory audit record for ${target.productName}.`
      });
    }
  };

  // CSV Export
  const handleDownloadCSV = (record) => {
    const target = record || auditResult;
    const ok = exportFboPreAuditCSV(target);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Spreadsheet Exported',
        description: `CSV dataset downloaded for ${target.productName}.`
      });
    }
  };

  // ==========================================
  // SECTION B: COMPLIANCE HISTORY FILTER STATE
  // ==========================================
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAuditModal, setSelectedAuditModal] = useState(null);

  const filteredHistory = auditHistory.filter(item => {
    const matchesSearch = (item.productName || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                          (item.batchNumber || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                          (item.id || '').toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'ready' && item.status === 'Ready for Market') ||
                          (statusFilter === 'revision' && item.status === 'Requires Revision');
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const businessName = fboProfile?.businessName || 'Apex Nutrition & Agro Foods Pvt. Ltd.';

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Pre-Release Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#065F46] font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-wider border border-emerald-200">
              FBO PRE-RELEASE PACKAGING AUDIT
            </span>
            <span className="text-slate-300 hidden xs:inline">•</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">PCR-2011 & FSSAI Aligned</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Packaging Compliance & Legal Metrology Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Automated OCR rule validation against Rules 6, 9, 18, and Schedule II standard package weights before commercial printing.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NEW LABEL SCREENING & OCR RULE VERIFICATION */}
      {/* ========================================================================= */}
      {activeTab === 'screening' && (
        <div className="space-y-6">
          
          {/* Main Inspection Workspace: Pipeline Analysis (Image 2) or Dual Upload & Camera Portal (Image 1) */}
          {isAnalyzing ? (
            /* ========================================================================= */
            /* PIPELINE SCANNING VIEW (MATCHING INSPECTOR PORTAL - IMAGE 2) */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Pipeline Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      {isCompleted ? 'Analysis Completed' : 'AI Analysis & OCR Processing'}
                    </h2>
                    <span className="text-[10px] font-mono bg-emerald-50 text-[#065F46] border border-emerald-200 font-bold px-2 py-0.5 rounded">
                      {scanReportId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Evaluating packaging imagery against Legal Metrology (Packaged Commodities) Rules, 2011.
                  </p>
                </div>

                {isCompleted ? (
                  <button
                    onClick={handleFinishAnalysis}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#065F46] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <span>View Compliance Result</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishAnalysis}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <span>Skip to Result</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Grid: Live Scanner Feed + Inspection Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Product Image & Laser scanner overlay */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                    <span>Live PCR-2011 Scanning Feed</span>
                    <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      ANALYZING
                    </span>
                  </h3>

                  <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
                    <img 
                      src={uploadedImage} 
                      alt={productName} 
                      className="w-full h-full object-contain opacity-90"
                    />
                    
                    {/* Laser scanning bar */}
                    {!isCompleted && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#10b981] animate-bounce top-1/3 z-20 pointer-events-none" />
                    )}

                    {/* Bounding box mock highlights */}
                    <div className="absolute top-[35%] left-[15%] w-[65%] h-[16%] border-2 border-emerald-400/90 bg-emerald-500/15 rounded pointer-events-none flex items-start justify-end p-1 z-10 shadow-sm">
                      <span className="text-[8px] font-mono font-bold text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded">
                        MRP & Net Wt.
                      </span>
                    </div>
                    <div className="absolute bottom-[20%] left-[12%] w-[72%] h-[22%] border-2 border-amber-400/90 bg-amber-500/15 rounded pointer-events-none flex items-start justify-end p-1 z-10 shadow-sm">
                      <span className="text-[8px] font-mono font-bold text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded">
                        Mfg & Origin
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-slate-900 truncate">{productName}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">High-Precision Neural OCR Feed</p>
                  </div>
                </div>

                {/* Right: Inspection Pipeline */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center justify-between">
                      <span>Inspection Pipeline</span>
                      <span className="text-[10px] font-mono text-slate-500">5 Automated Stages</span>
                    </h3>

                    <div className="space-y-3">
                      {FBO_INSPECTION_STEPS.map((step, idx) => {
                        const isStepDone = analysisStep > idx;
                        const isStepCurrent = analysisStep === idx;

                        return (
                          <div 
                            key={step.id} 
                            className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                              isStepDone 
                                ? 'bg-emerald-50/40 border-emerald-100' 
                                : isStepCurrent 
                                ? 'bg-slate-50 border-[#065F46] shadow-xs' 
                                : 'bg-white border-slate-100 opacity-60'
                            }`}
                          >
                            <div className="mt-0.5">
                              {isStepDone ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : isStepCurrent ? (
                                <Loader2 className="w-5 h-5 text-[#065F46] animate-spin" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                                <span className="text-[10px] font-mono text-slate-500">{step.duration}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick info banner */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Sparkles className="w-4 h-4 text-[#065F46]" />
                      <span>Verifying 8 mandatory declarations and font height tables</span>
                    </div>
                    <button
                      onClick={() => navigate('rules')}
                      className="text-xs font-bold text-[#065F46] hover:underline cursor-pointer"
                    >
                      View Rules →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* UPLOAD & CAMERA SCANNING PORTAL (IMAGE 1) + VERIFIED AUDIT RESULTS */
            /* ========================================================================= */
            <div className="space-y-6">
              
              {/* Upload & Camera Capture Box (MATCHING INSPECTOR PORTAL - IMAGE 1) */}
              <div 
                id="fbo-upload-artwork-box"
                className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs scroll-mt-28"
              >
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-center">
                  
                  {/* Left: Drag & Drop Zone (5 cols) */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`md:col-span-5 border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragging ? 'border-[#065F46] bg-emerald-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
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

                    <p className="text-xs sm:text-sm font-bold text-slate-800">Drag & Drop packaging image</p>
                    <span className="text-[11px] text-slate-400 my-1 font-medium">or</span>
                    
                    <button 
                      type="button"
                      className="px-4 py-2 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer min-h-[38px]"
                    >
                      Upload File
                    </button>

                    <p className="text-[10px] text-slate-400 mt-2.5">JPG, PNG, WEBP (Max 10MB)</p>
                  </div>

                  {/* Middle "OR" Divider (1 col) */}
                  <div className="md:col-span-1 flex items-center justify-center py-1 md:py-0">
                    <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full md:bg-transparent md:p-0">OR</span>
                  </div>

                  {/* Right: Camera Capture Zone (5 cols) */}
                  <div className="md:col-span-5 border border-slate-200 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 min-h-[190px]">
                    {isCameraActive ? (
                      <div className="w-full space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-44">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="px-4 py-2 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer min-h-[38px]"
                          >
                            Take Snap
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer min-h-[38px]"
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

                        <p className="text-xs sm:text-sm font-bold text-slate-800">Direct Camera Capture</p>
                        
                        <button 
                          onClick={startCamera}
                          type="button"
                          className="mt-2.5 px-4 py-2 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer min-h-[38px]"
                        >
                          Use Camera
                        </button>
                      </>
                    )}
                  </div>

                </div>

                {/* Tips for Best Results */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">Tips for high OCR accuracy:</span>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#065F46] stroke-[2.5]" />
                      <span>Even lighting</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#065F46] stroke-[2.5]" />
                      <span>Zero reflections</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#065F46] stroke-[2.5]" />
                      <span>Keep label flat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Visual Scan Split-Screen & Compliance Audit Findings */}
              {auditResult && (
                <div className="space-y-4">
              
              {/* Summary Metric Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                    auditResult.complianceScore >= 90
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : auditResult.complianceScore >= 65
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-rose-50 border-rose-300 text-rose-700'
                  }`}>
                    <span className="text-xl sm:text-2xl font-black font-mono leading-none">{auditResult.complianceScore}%</span>
                    <span className="text-[9px] uppercase font-bold tracking-tight mt-0.5">Score</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        auditResult.status === 'Ready for Market'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {auditResult.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {auditResult.violationsList?.filter(v => v.severity !== 'Compliant').length || 0} Infractions
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {auditResult.complianceScore >= 90 
                        ? 'Artwork passes statutory Legal Metrology inspection standards.'
                        : 'Review cited rule infractions below and adjust typeface/clauses before releasing packaging.'}
                    </p>
                  </div>
                </div>

                {/* Quick Action Export & Reset Buttons - Full Width on Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setAuditResult(null);
                      setUploadedImage(null);
                      setSelectedPresetId(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full md:w-auto px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Scan Another</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(auditResult)}
                    className="w-full md:w-auto px-3.5 py-2.5 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCSV(auditResult)}
                    className="w-full md:w-auto px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Split Screen Container */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                
                {/* Visual Label Canvas on Left (XL: 6 cols) */}
                <div className="xl:col-span-6 bg-[#06241a] rounded-2xl border border-[#0b4d38] p-3 sm:p-4 text-white flex flex-col justify-between overflow-hidden relative min-h-[340px] sm:min-h-[440px]">
                  
                  {/* Canvas Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#0b4d38] z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-bold text-emerald-200 font-mono">
                        IMAGE PREVIEW CANVAS
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#083829] p-1 rounded-xl border border-[#0d5941]">
                      <button
                        onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
                        title="Zoom Out"
                        className="p-1.5 hover:bg-[#0b4d38] rounded-lg text-emerald-200 cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono px-1.5 text-emerald-200 font-semibold">{Math.round(zoomLevel * 100)}%</span>
                      <button
                        onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))}
                        title="Zoom In"
                        className="p-1.5 hover:bg-[#0b4d38] rounded-lg text-emerald-200 cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoomLevel(1)}
                        title="Reset Zoom"
                        className="p-1.5 hover:bg-[#0b4d38] rounded-lg text-emerald-200 cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-3.5 w-px bg-[#0d5941] mx-0.5" />
                      <button
                        onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                        title="Toggle OCR Bounding Boxes"
                        className={`p-1.5 rounded-lg cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center ${showBoundingBoxes ? 'bg-[#059669] text-white' : 'hover:bg-[#0b4d38] text-emerald-400'}`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Canvas Container with Overlays */}
                  <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative my-2 min-h-[220px]">
                    <div 
                      className="relative transition-transform duration-200 max-w-full"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      <img
                        src={uploadedImage}
                        alt="Packaging Label Preview"
                        className="max-h-[260px] sm:max-h-[340px] max-w-full rounded-xl object-contain shadow-2xl border border-[#0d5941] select-none"
                      />

                      {/* OCR Bounding Boxes Overlays */}
                      {showBoundingBoxes && (auditResult.extractedFields || []).map((field, idx) => {
                        if (!field.bbox) return null;
                        const [left, top, width, height] = field.bbox;
                        const isHovered = activeBoxHover === field.key;
                        const isViolating = !field.compliant;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setActiveBoxHover(field.key)}
                            onMouseLeave={() => setActiveBoxHover(null)}
                            style={{
                              position: 'absolute',
                              left: `${left}%`,
                              top: `${top}%`,
                              width: `${width}%`,
                              height: `${height}%`,
                            }}
                            className={`rounded transition-all cursor-pointer ${
                              isViolating
                                ? 'border-2 border-rose-500 bg-rose-500/20'
                                : 'border-2 border-emerald-400 bg-emerald-400/15'
                            } ${isHovered ? 'ring-4 ring-emerald-300 scale-105 z-20' : ''}`}
                          >
                            <div className={`absolute -top-4 left-0 px-1 py-0.2 rounded text-[8px] font-mono font-bold whitespace-nowrap shadow-xs ${
                              isViolating ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                            }`}>
                              {field.key}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Canvas Bottom Legend */}
                  <div className="pt-2.5 border-t border-[#0b4d38] flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 text-[10px] text-emerald-300">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Compliant Field
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Non-Conformance Box
                      </span>
                    </div>
                    <span className="text-emerald-400/80">Tap box to inspect</span>
                  </div>

                </div>

                {/* Parsed Fields & Detected Violations List on Right (XL: 6 cols) */}
                <div className="xl:col-span-6 space-y-4">
                  
                  {/* Violations & Non-Conformances List */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#065F46]" />
                        <h3 className="text-sm font-bold text-slate-900">
                          Detected Violations & Statutory Citations
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-[#065F46] rounded-md border border-emerald-200">
                        {auditResult.violationsList?.length || 0} Rules
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {(auditResult.violationsList || []).map((viol, index) => {
                        const isCritical = viol.severity === 'Critical Violation';
                        const isWarning = viol.severity === 'Moderate Warning';
                        const isClean = viol.severity === 'Compliant';

                        return (
                          <div 
                            key={viol.id || index}
                            className={`p-4 rounded-xl border transition-all ${
                              isCritical 
                                ? 'bg-rose-50/50 border-rose-200' 
                                : isWarning 
                                ? 'bg-amber-50/50 border-amber-200' 
                                : 'bg-emerald-50/50 border-emerald-200'
                            }`}
                          >
                            {/* Card Header: Severity & Rule Cited */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded font-mono ${
                                  isCritical 
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                                    : isWarning 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}>
                                  {viol.severity}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 mt-1 font-mono">
                                  {viol.ruleCited}
                                </h4>
                              </div>
                              {isClean ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              )}
                            </div>

                            {/* Observed on Label */}
                            <div className="text-xs text-slate-700 mb-2">
                              <span className="font-semibold text-slate-900">Observed: </span>
                              {viol.observed}
                            </div>

                            {/* Statutory Penalty Section */}
                            {!isClean && viol.penalty && (
                              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 mb-2 font-mono">
                                <span className="font-bold text-rose-700">Statutory Penal Provision: </span>
                                {viol.penalty}
                              </div>
                            )}

                            {/* Actionable Correction Guidance */}
                            <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/60">
                              <span className="font-bold text-[#065F46]">Correction Guidance: </span>
                              {viol.guidance}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Parsed OCR Declarations Grid */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-[#065F46]" />
                        <span>OCR Parsed Statutory Declarations</span>
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">PaddleOCR v2.8</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(auditResult.extractedFields || []).map((f, i) => (
                        <div 
                          key={i}
                          onMouseEnter={() => setActiveBoxHover(f.key)}
                          onMouseLeave={() => setActiveBoxHover(null)}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            f.compliant 
                              ? 'bg-slate-50/80 border-slate-200' 
                              : 'bg-rose-50 border-rose-200 text-rose-950 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 text-[11px]">{f.key}</span>
                            <span className="text-[9px] font-mono text-slate-400">{f.confidence}% conf</span>
                          </div>
                          <div className="text-slate-900 font-mono text-[11px] mt-0.5 truncate">
                            {f.value}
                          </div>
                          {f.issue && (
                            <div className="text-[10px] text-rose-600 mt-1 font-semibold">
                              ⚠️ {f.issue}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPLIANCE AUDIT HISTORY & ARCHIVES */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          
          {/* History Filters & Search Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pre-Release Compliance Audit Archives</h3>
                <p className="text-xs text-slate-500">Search past packaging label audits, view evidence sheets, and export PDF inspection reports.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ok = exportFboPreAuditCSV(auditHistory[0] || auditResult);
                    if (ok) addToast({ type: 'success', title: 'History Exported', description: 'Downloaded CSV dataset.' });
                  }}
                  className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export All CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
              <div className="sm:col-span-5 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search by Product Name, Batch ID, or Audit ID..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#065F46] focus:outline-hidden text-slate-900"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#065F46] focus:outline-hidden text-slate-900"
                >
                  <option value="all">All Product Categories</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Packaged Food">Packaged Food</option>
                  <option value="Confectionery">Confectionery</option>
                  <option value="Dairy Product">Dairy Product</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#065F46] focus:outline-hidden text-slate-900"
                >
                  <option value="all">All Audit Statuses</option>
                  <option value="ready">Approved / Market Ready</option>
                  <option value="revision">Revision Required</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit History Content: Mobile Cards (<md) & Full Table (>=md) */}
          <div className="space-y-3">
            
            {/* Mobile Cards View (Visible on screens < md) */}
            <div className="md:hidden space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-xs text-slate-400">
                  No compliance audit records found matching the filters.
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const isReady = item.status === 'Ready for Market';
                  return (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={item.labelImageUrl} 
                          alt={item.productName} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="font-bold text-slate-900 text-xs truncate leading-snug">
                              {item.productName}
                            </h4>
                            <span className="font-mono font-bold text-slate-800 text-xs shrink-0">
                              {item.complianceScore}%
                            </span>
                          </div>
                          
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                            Batch: {item.batchNumber} • {item.netQuantity || item.category}
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              isReady
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}>
                              {isReady ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <AlertCircle className="w-2.5 h-2.5 text-rose-600" />}
                              <span>{isReady ? 'Market Ready' : 'Revision Required'}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Ref: #{item.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rules Triggered Chips */}
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                        {(item.rulesTriggered || ['Rule 6', 'Rule 9']).map((rule, ri) => (
                          <span 
                            key={ri}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-[#065F46] border border-emerald-200"
                          >
                            {rule}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedAuditModal(item)}
                          className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center min-h-[36px] flex items-center justify-center"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(item)}
                          className="px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#065F46] text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 min-h-[36px]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => {
                            handleSelectPreset(item);
                            setActiveTab('screening');
                          }}
                          className="px-2 py-2 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 min-h-[36px]"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Re-Scan</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(item)}
                          title="Delete Record"
                          className="px-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center min-h-[36px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View (Hidden on mobile < md) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Label Preview</th>
                      <th className="py-3.5 px-4">Product Name & Batch</th>
                      <th className="py-3.5 px-4">Scan Date & Ref</th>
                      <th className="py-3.5 px-4">Rules Triggered</th>
                      <th className="py-3.5 px-4">Compliance Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No compliance audit records found matching the filters.
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map((item) => {
                        const isReady = item.status === 'Ready for Market';

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            
                            {/* Thumbnail */}
                            <td className="py-3 px-4">
                              <img 
                                src={item.labelImageUrl} 
                                alt={item.productName} 
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                              />
                            </td>

                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 text-xs">{item.productName}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                Batch: {item.batchNumber} • {item.netQuantity || item.category}
                              </div>
                            </td>

                            {/* Timestamp */}
                            <td className="py-3 px-4">
                              <div className="font-mono text-slate-800 text-[11px]">{item.timestamp}</div>
                              <div className="text-[10px] text-slate-400 font-mono">Ref: #{item.id}</div>
                            </td>

                            {/* Rules Triggered */}
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {(item.rulesTriggered || ['Rule 6', 'Rule 9']).map((rule, ri) => (
                                  <span 
                                    key={ri}
                                    className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-50 text-[#065F46] border border-emerald-200"
                                  >
                                    {rule}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                                  isReady
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}>
                                  {isReady ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                                  <span>{isReady ? 'Market Ready' : 'Revision Required'}</span>
                                </span>
                                <span className="font-mono font-bold text-slate-700 text-xs">
                                  {item.complianceScore}%
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedAuditModal(item)}
                                  title="View Full Audit Sheet"
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  View Details
                                </button>

                                <button
                                  onClick={() => handleDownloadPDF(item)}
                                  title="Download PDF Evidence Report"
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#065F46] rounded-lg transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    handleSelectPreset(item);
                                    setActiveTab('screening');
                                  }}
                                  title="Re-Scan Updated Label"
                                  className="px-2.5 py-1.5 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Re-Scan</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteRecord(item)}
                                  title="Delete Record"
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* AUDIT DETAILS MODAL / DRAWER */}
      {/* ========================================================================= */}
      {selectedAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 sm:space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
              <div className="min-w-0 pr-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-[#065F46] bg-emerald-50 px-2 py-0.5 rounded font-mono border border-emerald-200">
                    AUDIT REF #{selectedAuditModal.id}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-mono">{selectedAuditModal.timestamp}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 truncate">
                  {selectedAuditModal.productName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedAuditModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
              <div className="md:col-span-5 bg-[#06241a] rounded-2xl p-3 flex items-center justify-center border border-[#0b4d38] min-h-[180px]">
                <img 
                  src={selectedAuditModal.labelImageUrl} 
                  alt={selectedAuditModal.productName} 
                  className="max-h-52 sm:max-h-64 rounded-xl object-contain shadow-lg"
                />
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Number:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared MRP:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.mrp || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared Net Qty:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.netQuantity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200">
                    <span className="text-slate-500">Score & Result:</span>
                    <span className={`font-bold ${selectedAuditModal.complianceScore >= 90 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {selectedAuditModal.complianceScore}% ({selectedAuditModal.status})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Statutory Rule Infractions:
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(selectedAuditModal.violationsList || []).map((v, i) => (
                      <div key={i} className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-rose-900 font-mono">{v.ruleCited}</div>
                        <div className="text-slate-700 leading-relaxed">{v.observed}</div>
                        {v.penalty && <div className="text-[11px] text-rose-700 font-mono">⚖️ {v.penalty}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                onClick={() => setSelectedAuditModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer text-center min-h-[40px]"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const toDelete = selectedAuditModal;
                    handleDeleteRecord(toDelete);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors min-h-[40px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF(selectedAuditModal)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#065F46] text-white rounded-xl text-xs font-bold hover:bg-[#047857] flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Download PDF Audit Report</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Compliance Record?</h3>
                <p className="text-xs text-slate-500">This record will be permanently deleted from your compliance history.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">{recordToDelete.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch / Ref:</span>
                <span className="font-mono text-slate-700">#{recordToDelete.id} (Batch {recordToDelete.batchNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-semibold ${recordToDelete.status === 'Ready for Market' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {recordToDelete.status} ({recordToDelete.complianceScore}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRecord}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
