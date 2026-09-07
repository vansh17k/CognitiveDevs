/**
 * ============================================================================
 * ROOT APP LAYOUT & GLOBAL CONTEXT PROVIDER
 * ============================================================================
 * 
 * Provides global state management, routing dispatcher, notification toasts,
 * and inspector session states across all 12 LS modules.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { Header } from '../components/Header.jsx';
import { INITIAL_PRODUCTS, INITIAL_INSPECTIONS, INITIAL_USERS } from '../data/products.js';
import { LEGAL_RULES } from '../data/rules.js';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage.js';
import { generateAnalysisForUpload } from '../utils/helpers.js';
import { Sparkles, Scale, BookOpen, Mail, X, CheckCircle2, AlertCircle } from 'lucide-react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Navigation state (landing, dashboard, scan, analysis, result, reports, history, violations, analytics, products, rules, users, settings, help)
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Data stores with LocalStorage synchronization
  const [products, setProducts] = useState(() => getFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
  const [inspections, setInspections] = useState(() => getFromStorage(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS));
  const [users, setUsers] = useState(() => getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => getFromStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]));

  // Active scan & inspection workflow state
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [activeInspection, setActiveInspection] = useState(INITIAL_INSPECTIONS[0]);
  const [scannedImage, setScannedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Modals state
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false);
  const [selectedViolationForExplain, setSelectedViolationForExplain] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to local storage
  useEffect(() => { saveToStorage(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.INSPECTIONS, inspections); }, [inspections]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigate = (pageId, payload = null) => {
    if (payload) {
      if (payload.product) setSelectedProduct(payload.product);
      if (payload.inspection) setActiveInspection(payload.inspection);
    }
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email, role = 'inspector') => {
    const userEmail = (email || '').trim().toLowerCase();
    const targetUser = users.find(u => (u.email || '').toLowerCase() === userEmail) || 
      (role === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0]);
    setCurrentUser(targetUser);
    setCurrentPage('dashboard');
    showToast(`Welcome back, ${targetUser.name}! Signed into ${targetUser.division}.`);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
    showToast('Signed out of Legal Metrology Enforcement Session.');
  };

  const switchUserRole = (newRole) => {
    const matched = users.find(u => u.role === newRole) || (newRole === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0]);
    setCurrentUser(matched);
    showToast(`Switched active profile to ${matched.name} (${newRole.toUpperCase()})`);
  };

  const startNewScan = (imageDataUrl, productName, presetId) => {
    setScannedImage(imageDataUrl);
    setIsScanning(true);
    setCurrentPage('analysis');

    // Simulate OCR Engine
    setTimeout(() => {
      const { product, inspection } = generateAnalysisForUpload(imageDataUrl, productName, presetId);
      
      setProducts(prev => [product, ...prev.filter(p => p.id !== product.id)]);
      setInspections(prev => [inspection, ...prev]);
      setSelectedProduct(product);
      setActiveInspection(inspection);
      setIsScanning(false);
      setCurrentPage('result');
      showToast('Automated Rule 6 OCR extraction completed successfully.');
    }, 2400);
  };

  const deleteInspection = (id) => {
    setInspections(prev => prev.filter(i => i.id !== id));
    showToast('Inspection audit record removed.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        products,
        setProducts,
        inspections,
        setInspections,
        users,
        setUsers,
        currentUser,
        login,
        logout,
        switchUserRole,
        selectedProduct,
        setSelectedProduct,
        activeInspection,
        setActiveInspection,
        scannedImage,
        setScannedImage,
        isScanning,
        startNewScan,
        deleteInspection,
        showToast,
        openAboutModal: () => setAboutModalOpen(true),
        openContactModal: () => setContactModalOpen(true),
        openFeaturesModal: () => setFeaturesModalOpen(true),
        explainViolation: (viol) => setSelectedViolationForExplain(viol)
      }}
    >
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-[#0d4734]">
        {children}

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold border border-slate-700 animate-bounce-short">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        )}

        {/* AI Explainability Modal */}
        {selectedViolationForExplain && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-sm sm:text-base">Gemini Legal AI Explainability</h3>
                </div>
                <button
                  onClick={() => setSelectedViolationForExplain(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-mono text-slate-400 uppercase text-[10px] block">Infraction</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedViolationForExplain.title || selectedViolationForExplain.clauseTitle}</p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-950 block mb-1">Why was this flagged?</span>
                  <p className="text-indigo-900">{selectedViolationForExplain.finding || selectedViolationForExplain.explanation}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-mono font-bold text-slate-700 block mb-1">Statutory Excerpt (PCR 2011)</span>
                  <p className="text-slate-600 italic">{selectedViolationForExplain.lawExcerpt || 'Rule 6 & Rule 7 mandatory compliance criteria.'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] font-mono">
                  <span className="text-slate-500">Compounding Penalty</span>
                  <span className="font-bold text-rose-700">{selectedViolationForExplain.fineAmount || '₹25,000'}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedViolationForExplain(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                >
                  Close Explainability View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Modal */}
        {aboutModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0d4734] text-white flex items-center justify-center">
                    <Scale className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Legal Metrology (Packaged Commodities) Rules, 2011</h3>
                    <p className="text-xs text-slate-500 font-mono">Statutory Enforcement Framework</p>
                  </div>
                </div>
                <button onClick={() => setAboutModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>The <strong>Legal Metrology Act, 2009</strong> and the <strong>Packaged Commodities Rules (PCR), 2011</strong> mandate standardized disclosures on every pre-packaged product distributed or sold in India to protect consumer interests.</p>
                <p>Rule 6 prescribes 8 mandatory declarations including full manufacturer details, generic commodity identity, net quantity in SI units, Month/Year of packing, Maximum Retail Price inclusive of all taxes, Unit Sale Price (USP), and active consumer care contact details.</p>
                <p>This automated AI platform digitizes field verification for State Legal Metrology Officers, reducing inspection cycle time from 20 minutes to under 3 seconds per commodity.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setAboutModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-[#0d4734] text-white font-semibold text-xs">
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Enforcement Helpline & Contact</h3>
                <button onClick={() => setContactModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Directorate of Legal Metrology</span>
                  <p className="mt-0.5">Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">National Consumer Helpline (NCH)</span>
                  <p className="mt-0.5 font-mono text-emerald-800 font-bold">1800-11-4000  |  1915</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Inspector Technical Desk</span>
                  <p className="mt-0.5 font-mono text-slate-700">support.lmcc@gov.in</p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button onClick={() => setContactModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Modal */}
        {featuresModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">LS Core Capabilities</h3>
                <button onClick={() => setFeaturesModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="font-bold text-[#0d4734]">OCR Label Tokenizer</h4>
                  <p className="text-slate-600 mt-1">Extracts Net Qty, MRP, Mfg Date, and Manufacturer postal address instantly.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="font-bold text-[#0d4734]">Font Height Computer</h4>
                  <p className="text-slate-600 mt-1">Mathematically evaluates PDP typography mm heights against Rule 7 Table-1.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="font-bold text-[#0d4734]">Form-V Notice Generator</h4>
                  <p className="text-slate-600 mt-1">Generates official statutory compounding notices under Section 36 in one click.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="font-bold text-[#0d4734]">AI Legal Explainability</h4>
                  <p className="text-slate-600 mt-1">Grounds all flagged packaging infractions in precise PCR 2011 clauses and court rulings.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setFeaturesModalOpen(false)} className="px-5 py-2 rounded-xl bg-[#0d4734] text-white font-semibold text-xs">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
};
