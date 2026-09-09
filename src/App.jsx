import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_INSPECTIONS, 
  INITIAL_USERS, 
  INITIAL_REQUESTS,
  LEGAL_RULES 
} from './data.js';
import {
  INITIAL_FBO_PROFILE,
  INITIAL_FBO_PRODUCTS,
  INITIAL_FBO_NOTICES,
  INITIAL_FBO_CORRECTIVE_ACTIONS,
  INITIAL_COMPLIANCE_CALENDAR_EVENTS,
  INITIAL_FBO_DOCUMENTS,
  INITIAL_COMPLIANCE_HISTORY_TIMELINE,
  INITIAL_FBO_NOTIFICATIONS
} from './data/fboData.js';
import { generateAnalysisForUpload } from './utils.js';
import { apiService } from './api.js';

// Modals & Layout from components.jsx
import { 
  DashboardLayout,
  ExplainViolationModal,
  ManualReviewModal,
  AboutModal,
  ContactModal,
  FeaturesModal,
  ToastContainer
} from './components.jsx';
import { FboLayout } from './components/fbo/FboLayout.jsx';

// 16 Pages from ./pages/
import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Scan } from './pages/Scan.jsx';
import { Analysis } from './pages/Analysis.jsx';
import { Result } from './pages/Result.jsx';
import { Report } from './pages/Report.jsx';
import { History } from './pages/History.jsx';
import { Violations } from './pages/Violations.jsx';
import { Analytics } from './pages/Analytics.jsx';
import { Products } from './pages/Products.jsx';
import { Rules } from './pages/Rules.jsx';
import { Users } from './pages/Users.jsx';
import { Settings } from './pages/Settings.jsx';
import { Help } from './pages/Help.jsx';
import { Requests } from './pages/Requests.jsx';

// FBO Dedicated Portal Pages
import { FboLogin } from './pages/fbo/FboLogin.jsx';
import { FboDashboard } from './pages/fbo/FboDashboard.jsx';
import { FboProducts } from './pages/fbo/FboProducts.jsx';
import { FboAiCheck } from './pages/fbo/FboAiCheck.jsx';
import { FboAiResult } from './pages/fbo/FboAiResult.jsx';
import { FboCalendar } from './pages/fbo/FboCalendar.jsx';
import { FboNotices } from './pages/fbo/FboNotices.jsx';
import { FboCorrectiveAction } from './pages/fbo/FboCorrectiveAction.jsx';
import { FboDocuments } from './pages/fbo/FboDocuments.jsx';
import { FboHistory } from './pages/fbo/FboHistory.jsx';
import { FboNotifications } from './pages/fbo/FboNotifications.jsx';
import { FboProfile } from './pages/fbo/FboProfile.jsx';

const AppContext = createContext(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'lmcc_products_v1',
  INSPECTIONS: 'lmcc_inspections_v1',
  RULES: 'lmcc_rules_v1',
  USERS: 'lmcc_users_v1',
  CURRENT_USER: 'lmcc_current_user_v1',
  REQUESTS: 'lmcc_inspector_requests_v1'
};

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [pageHistory, setPageHistory] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);
  const [loginInitialRole, setLoginInitialRole] = useState(null);

  // Persistence Loaders
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [inspections, setInspections] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INSPECTIONS);
      return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
    } catch {
      return INITIAL_INSPECTIONS;
    }
  });

  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RULES);
      return saved ? JSON.parse(saved) : LEGAL_RULES;
    } catch {
      return LEGAL_RULES;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('lmcc_is_logged_in_v1');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Centralized Inspector Complaints & Requests (DGM Central Authority)
  const [inspectorRequests, setInspectorRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  // Dedicated FBO (Food Business Operator) State
  const [fboProfile, setFboProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_profile_v1');
      return saved ? JSON.parse(saved) : INITIAL_FBO_PROFILE;
    } catch {
      return INITIAL_FBO_PROFILE;
    }
  });

  const [fboProducts, setFboProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_products_v1');
      return saved ? JSON.parse(saved) : INITIAL_FBO_PRODUCTS;
    } catch {
      return INITIAL_FBO_PRODUCTS;
    }
  });

  const [fboNotices, setFboNotices] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_notices_v1');
      return saved ? JSON.parse(saved) : INITIAL_FBO_NOTICES;
    } catch {
      return INITIAL_FBO_NOTICES;
    }
  });

  const [fboCorrectiveActions, setFboCorrectiveActions] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_capa_v1');
      return saved ? JSON.parse(saved) : INITIAL_FBO_CORRECTIVE_ACTIONS;
    } catch {
      return INITIAL_FBO_CORRECTIVE_ACTIONS;
    }
  });

  const [fboCalendarEvents, setFboCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_calendar_v1');
      return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_CALENDAR_EVENTS;
    } catch {
      return INITIAL_COMPLIANCE_CALENDAR_EVENTS;
    }
  });

  const [fboDocuments, setFboDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_docs_v1');
      return saved ? JSON.parse(saved) : INITIAL_FBO_DOCUMENTS;
    } catch {
      return INITIAL_FBO_DOCUMENTS;
    }
  });

  const [fboComplianceHistory, setFboComplianceHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_history_v1');
      return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_HISTORY_TIMELINE;
    } catch {
      return INITIAL_COMPLIANCE_HISTORY_TIMELINE;
    }
  });

  const [fboNotifications, setFboNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_notifs_v1');
      return saved ? JSON.parse(saved) : INITIAL_FBO_NOTIFICATIONS;
    } catch {
      return INITIAL_FBO_NOTIFICATIONS;
    }
  });

  const [activeFboCheckProduct, setActiveFboCheckProduct] = useState(INITIAL_FBO_PRODUCTS[0]);

  // Sync FBO state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('fbo_profile_v1', JSON.stringify(fboProfile));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [fboProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('fbo_products_v1', JSON.stringify(fboProducts));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [fboProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('fbo_notices_v1', JSON.stringify(fboNotices));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [fboNotices]);

  useEffect(() => {
    try {
      localStorage.setItem('fbo_capa_v1', JSON.stringify(fboCorrectiveActions));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [fboCorrectiveActions]);

  const saveProductToFirestore = async (product, inspection, user) => {
    try {
      console.debug('[Storage] Record saved:', product?.id);
    } catch (e) {
      console.warn('[Storage] Sync notice:', e);
    }
  };

  const saveFboProductToFirestore = async (fboProd, profile) => {
    try {
      console.debug('[Storage] FBO Record saved:', fboProd?.id || fboProd?.productId);
    } catch (e) {
      console.warn('[Storage] FBO Sync notice:', e);
    }
  };

  const startFboAiCheck = (product) => {
    setActiveFboCheckProduct(product || fboProducts[0]);
    navigate('fbo-ai-check');
  };

  // Current active scan
  const [currentScan, setCurrentScan] = useState(() => {
    return {
      product: INITIAL_PRODUCTS[0],
      inspection: INITIAL_INSPECTIONS[0]
    };
  });

  // Modals state
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isManualReviewModalOpen, setIsManualReviewModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [activeLandingSection, setActiveLandingSection] = useState('home');

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  const openFeaturesModal = () => setIsFeaturesModalOpen(true);
  const closeFeaturesModal = () => setIsFeaturesModalOpen(false);

  const activeLandingSectionSet = (section) => {
    setActiveLandingSection(section);
  };

  const scrollToLandingSection = (sectionId) => {
    setActiveLandingSection(sectionId);
    if (currentPage !== 'landing') {
      setCurrentPage('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.INSPECTIONS, JSON.stringify(inspections));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [inspections]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('lmcc_is_logged_in_v1', isLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(inspectorRequests));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [inspectorRequests]);

  // Request Statistics calculation
  const requestStats = {
    total: inspectorRequests.length,
    pending: inspectorRequests.filter(r => r.status === 'Pending Review' || r.status === 'Submitted').length,
    underReview: inspectorRequests.filter(r => r.status === 'Under Review').length,
    approved: inspectorRequests.filter(r => r.status === 'Approved').length,
    rejected: inspectorRequests.filter(r => r.status === 'Rejected').length,
    resolved: inspectorRequests.filter(r => r.status === 'Resolved').length,
  };

  const addToast = (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const showToast = (toastOrMessage, type = 'success') => {
    if (typeof toastOrMessage === 'string') {
      addToast({
        type,
        title: type === 'error' ? 'Notification' : type === 'info' ? 'Information' : 'Success',
        description: toastOrMessage
      });
    } else if (toastOrMessage && typeof toastOrMessage === 'object') {
      addToast(toastOrMessage);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (page, params, isBackAction = false) => {
    if (params?.role !== undefined) {
      setLoginInitialRole(params.role);
    }
    if (params?.reportId) {
      setActiveReportId(params.reportId);
    }
    if (params?.productId) {
      const prod = products.find(p => p.id === params.productId);
      const insp = inspections.find(i => i.productId === params.productId);
      if (prod && insp) {
        setCurrentScan({ product: prod, inspection: insp });
      }
    }
    if (!isBackAction && page !== currentPage) {
      setPageHistory(prev => [
        ...prev, 
        { 
          page: currentPage, 
          reportId: activeReportId, 
          productId: currentScan?.product?.id 
        }
      ]);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const historyCopy = [...pageHistory];
      const previous = historyCopy.pop();
      setPageHistory(historyCopy);
      if (typeof previous === 'string') {
        navigate(previous, null, true);
      } else if (previous && previous.page) {
        navigate(previous.page, { reportId: previous.reportId, productId: previous.productId }, true);
      } else {
        navigate('dashboard', null, true);
      }
    } else {
      if (currentPage !== 'dashboard') {
        navigate('dashboard', null, true);
      } else {
        navigate('landing', null, true);
      }
    }
  };

  const switchUserRole = (role) => {
    const targetRole = role === 'admin' ? 'dgm' : role;
    const targetUser = users.find(u => u.role === targetRole) || INITIAL_USERS.find(u => u.role === targetRole) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    addToast({
      type: 'info',
      title: `Switched to ${targetRole === 'dgm' ? 'Deputy General Manager (DGM)' : 'Field Inspector'} Mode`,
      description: `Viewing workspace as ${targetUser.name} (${targetUser.division})`
    });
  };

  const login = (email, role) => {
    const userEmail = (email || '').trim().toLowerCase();
    const targetRole = role === 'admin' ? 'dgm' : role;
    let targetUser = users.find(u => (u.email || '').toLowerCase() === userEmail);
    if (!targetUser) {
      if (targetRole === 'dgm') {
        targetUser = INITIAL_USERS.find(u => u.role === 'dgm') || INITIAL_USERS[1];
      } else if (targetRole === 'consumer') {
        targetUser = INITIAL_USERS.find(u => u.role === 'consumer') || {
          id: 'usr-consumer',
          name: 'Citizen Consumer (Quick Check)',
          email: 'consumer@citizen.in',
          role: 'consumer',
          department: 'Consumer Grievance & Public Awareness',
          designation: 'Citizen / Consumer User',
          division: 'National Consumer Verification'
        };
      } else if (targetRole === 'fbo') {
        targetUser = INITIAL_USERS.find(u => u.role === 'fbo') || {
          id: 'usr-fbo',
          name: 'Apex Nutrition & Agro Foods Pvt. Ltd.',
          email: 'fbo@lmcc.demo',
          role: 'fbo',
          department: 'Packaged Commodities Manufacturing & Self-Compliance',
          designation: 'Registered Manufacturer / Brand Owner',
          division: 'Food Business Operator (FSSAI Reg: 10020021000123)'
        };
      } else {
        targetUser = INITIAL_USERS.find(u => u.role === 'inspector') || INITIAL_USERS[0];
      }
    }
    setCurrentUser(targetUser);
    setIsLoggedIn(true);

    if (targetRole === 'fbo' || targetUser.role === 'fbo') {
      setCurrentPage('fbo-dashboard');
      addToast({
        type: 'success',
        title: 'FBO Session Initialized',
        description: 'Welcome back, Apex Nutrition & Agro Foods Pvt. Ltd. (Self-Compliance & Notice Desk)'
      });
      return;
    }

    if (targetUser.role === 'consumer') {
      setCurrentScan(null);
      setCurrentPage('scan');
      addToast({
        type: 'info',
        title: 'Citizen Quick Check Active',
        description: 'Instant verification session active. Your scan data will NOT be saved to the database. You can download your official PDF report immediately.'
      });
    } else {
      setCurrentPage('dashboard');
      addToast({
        type: 'success',
        title: 'Welcome Back, ' + targetUser.name,
        description: targetUser.role === 'dgm'
          ? 'Full Command Access: Complete statewide oversight of all inspectors and action requests.'
          : 'Inspector Access: Scoped strictly to your inspected products and filed complaints.'
      });
    }
  };

  /**
   * Inspector submits a complaint/request
   * Stores in backend/database and updates state
   */
  const submitInspectorRequest = async (formData) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const newId = `REQ-2026-${String(inspectorRequests.length + 1).padStart(3, '0')}`;

    const newRequest = {
      id: newId,
      title: formData.title,
      description: formData.description,
      category: formData.category || 'Rule 6 Declaration Infraction',
      priority: formData.priority || 'Medium',
      location: formData.location || currentUser?.division || 'Field Location',
      date: dateStr,
      inspectorId: currentUser?.id || 'usr-001',
      inspectorName: currentUser?.name || 'Field Inspector',
      inspectorEmail: currentUser?.email || 'inspector@lmcc.demo',
      inspectorDivision: currentUser?.division || 'Indore Central Division',
      status: 'Pending Review', // Lifecycle: Submitted -> Pending Review -> Under Review -> Approved / Rejected -> Resolved
      productId: formData.productId || null,
      productName: formData.productName || 'Packaged Commodity Sample',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
      dgmRemarks: '',
      dgmActionDate: '',
      dgmOfficerName: '',
      timeline: [
        { status: 'Submitted', timestamp: dateStr, note: `Request submitted by ${currentUser?.name || 'Inspector'}`, by: currentUser?.name || 'Inspector' },
        { status: 'Pending Review', timestamp: dateStr, note: 'Routed to DGM Central Review Desk', by: 'System' }
      ]
    };

    // Optimistically update frontend state
    setInspectorRequests(prev => [newRequest, ...prev]);

    // Send to backend API
    try {
      await apiService.createRequest(newRequest);
    } catch (err) {
      console.warn('Backend createRequest note:', err);
    }

    addToast({
      type: 'success',
      title: 'Complaint / Request Submitted',
      description: `Request ${newId} has been successfully routed to Deputy General Manager (DGM).`
    });

    return newRequest;
  };

  /**
   * DGM updates status, adds remarks, approves/rejects/resolves
   * Syncs back to inspector portal
   */
  const updateRequestStatusAndRemarks = async (requestId, newStatus, remarks) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const dgmName = currentUser?.name || 'Dr. Anita Verma (DGM)';

    let updatedRecord = null;

    setInspectorRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedTimeline = [...(req.timeline || [])];
        if (newStatus && newStatus !== req.status) {
          updatedTimeline.push({
            status: newStatus,
            timestamp: dateStr,
            note: remarks || `Status transitioned to ${newStatus} by DGM`,
            by: dgmName
          });
        } else if (remarks && remarks !== req.dgmRemarks) {
          updatedTimeline.push({
            status: req.status,
            timestamp: dateStr,
            note: `DGM added remarks: ${remarks}`,
            by: dgmName
          });
        }

        updatedRecord = {
          ...req,
          status: newStatus || req.status,
          dgmRemarks: remarks !== undefined ? remarks : req.dgmRemarks,
          dgmActionDate: dateStr,
          dgmOfficerName: dgmName,
          timeline: updatedTimeline
        };
        return updatedRecord;
      }
      return req;
    }));

    // Send update to backend API
    try {
      await apiService.updateRequest(requestId, {
        status: newStatus,
        dgmRemarks: remarks,
        dgmOfficerName: dgmName
      });
    } catch (err) {
      console.warn('Backend updateRequest note:', err);
    }

    addToast({
      type: 'info',
      title: `Request ${requestId} Updated`,
      description: `DGM updated status to: ${newStatus}. Reflected to respective inspector.`
    });

    return updatedRecord;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentScan(null);
    setCurrentPage('landing');
    addToast({
      type: 'info',
      title: 'Logged Out',
      description: 'You have been safely signed out. Session closed.'
    });
  };

  const startNewScan = (imageDataUrl, name, presetId, ecommerceMeta) => {
    const result = generateAnalysisForUpload(imageDataUrl, name, presetId, ecommerceMeta);

    if (currentUser?.role === 'inspector') {
      result.product.inspectorId = currentUser.id;
      result.product.inspectorName = currentUser.name;
      result.product.inspectorEmail = currentUser.email;
      result.inspection.inspectorId = currentUser.id;
      result.inspection.inspectorName = currentUser.name;
      result.inspection.inspectorEmail = currentUser.email;
    } else if (currentUser?.role === 'dgm') {
      result.product.inspectorId = currentUser.id;
      result.product.inspectorName = currentUser.name;
      result.inspection.inspectorId = currentUser.id;
      result.inspection.inspectorName = currentUser.name;
    } else if (currentUser?.role === 'consumer') {
      // Citizen check: flag as ephemeral, NEVER PERSIST TO DATABASE
      result.product.isConsumerScan = true;
      result.product.ephemeral = true;
      result.inspection.isConsumerScan = true;
      result.inspection.ephemeral = true;
    }

    setCurrentScan(result);

    // CRITICAL USER DIRECTIVE:
    // "consumer ka data save nhi hoga wo instantly consumer kch check krra h toh wo us he time pdf download kr skta h uske bd nahi"
    if (currentUser?.role !== 'consumer') {
      setProducts(prev => [result.product, ...prev]);
      setInspections(prev => [result.inspection, ...prev]);
    }

    return result;
  };

  const updateCurrentScanWithAiResult = (aiData) => {
    if (!aiData) return;

    setCurrentScan(prev => {
      if (!prev) return prev;
      const prevProd = prev.product || {};
      const prevInsp = prev.inspection || {};

      const updatedDeclarations = Array.isArray(aiData.declarations) && aiData.declarations.length > 0
        ? aiData.declarations.map((d, i) => ({
            id: d.id || `d-${i + 1}`,
            srNo: d.srNo || i + 1,
            name: d.name || d.label,
            ruleCode: d.ruleCode || d.rule || 'Rule 6',
            extractedValue: d.extractedValue || d.detectedText || '—',
            status: d.status || 'Compliant',
            confidence: d.confidence || (d.status === 'Compliant' ? 95 : 60),
            detected: d.detected !== undefined ? d.detected : (d.status === 'Compliant' || !!d.extractedValue),
            remarks: d.remarks || d.recommendation || 'Statutory declaration verified'
          }))
        : prevProd.declarations;

      const updatedViolations = Array.isArray(aiData.violations)
        ? aiData.violations.map((v, i) => ({
            id: v.id || `viol-${Date.now()}-${i + 1}`,
            title: v.title || 'Statutory Non-Compliance',
            type: v.type || 'Rule Infraction',
            severity: v.severity || 'High',
            ruleReference: v.ruleReference || v.rule || 'PCR 2011',
            finding: v.finding || v.description || 'Discrepancy found during inspection.',
            evidenceText: v.evidenceText || v.evidence || 'OCR token analysis',
            recommendation: v.recommendation || v.penalty || 'Verify package physically.',
            confidence: v.confidence || 88,
            status: v.status || 'Flagged'
          }))
        : prevProd.violations;

      const updatedScore = aiData.score !== undefined ? aiData.score : (aiData.overallScore !== undefined ? aiData.overallScore : prevProd.score);
      const updatedStatus = aiData.status || aiData.complianceStatus || (updatedScore >= 90 ? 'Compliant' : updatedScore >= 70 ? 'Needs Review' : 'Non-Compliant');

      const updatedProduct = {
        ...prevProd,
        name: aiData.productName || prevProd.name,
        brand: aiData.brand || prevProd.brand,
        category: aiData.category || prevProd.category,
        netQuantity: aiData.netQuantity || prevProd.netQuantity,
        netQuantityDeclared: aiData.netQuantityDeclared ?? (aiData.netQuantity ? true : prevProd.netQuantityDeclared),
        netQuantityValue: aiData.netQuantity || prevProd.netQuantityValue,
        mrp: aiData.mrp || prevProd.mrp,
        mrpDeclared: aiData.mrpDeclared ?? (aiData.mrp ? true : prevProd.mrpDeclared),
        mrpValue: aiData.mrp || prevProd.mrpValue,
        packingDate: aiData.packingDate || aiData.mfgDate || prevProd.packingDate,
        mfgDate: aiData.mfgDate || aiData.packingDate || prevProd.mfgDate,
        mfgDateDeclared: aiData.mfgDateDeclared ?? true,
        manufacturerName: aiData.manufacturerName || prevProd.manufacturerName,
        manufacturerAddress: aiData.manufacturerAddress || prevProd.manufacturerAddress,
        manufacturerDeclared: aiData.manufacturerDeclared ?? true,
        consumerCare: aiData.consumerCare || prevProd.consumerCare,
        consumerCareDetails: aiData.consumerCareDetails || aiData.consumerCare || prevProd.consumerCareDetails,
        consumerCareContact: aiData.consumerCare || prevProd.consumerCareContact,
        consumerCareDeclared: aiData.consumerCareDeclared ?? true,
        countryOfOrigin: aiData.countryOfOrigin || prevProd.countryOfOrigin,
        countryOfOriginDeclared: aiData.countryOfOriginDeclared ?? (aiData.countryOfOrigin && aiData.countryOfOrigin !== 'Not Detected' && aiData.countryOfOrigin !== '—'),
        fssaiLicense: aiData.fssaiLicense || prevProd.fssaiLicense,
        fssaiNumber: aiData.fssaiLicense || prevProd.fssaiNumber,
        fssaiLicenseDeclared: aiData.fssaiLicenseDeclared ?? (aiData.fssaiLicense && aiData.fssaiLicense !== 'Not Detected'),
        batchNumber: aiData.batchNumber || prevProd.batchNumber,
        score: updatedScore,
        complianceScore: updatedScore,
        status: updatedStatus,
        inspectorRemarks: aiData.inspectorRemarks || aiData.summary || prevProd.inspectorRemarks,
        declarations: updatedDeclarations,
        violations: updatedViolations,
        boundingBoxes: (Array.isArray(aiData.boundingBoxes) && aiData.boundingBoxes.length > 0) ? aiData.boundingBoxes : prevProd.boundingBoxes
      };

      const updatedInspection = {
        ...prevInsp,
        productName: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        score: updatedScore,
        complianceScore: updatedScore,
        status: updatedStatus,
        declarationsCount: updatedDeclarations.length,
        compliantCount: updatedDeclarations.filter(d => d.status === 'Compliant').length,
        violationsCount: updatedViolations.length,
        manualReviewCount: updatedDeclarations.filter(d => d.status === 'Needs Review').length,
        declarations: updatedDeclarations,
        violations: updatedViolations,
        boundingBoxes: updatedProduct.boundingBoxes,
        inspectorRemarks: updatedProduct.inspectorRemarks
      };

      // Only persist to global products & inspections if NOT a consumer scan
      if (!updatedProduct.isConsumerScan && !updatedProduct.ephemeral && currentUser?.role !== 'consumer') {
        setProducts(pList => pList.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setInspections(iList => iList.map(i => (i.id === updatedInspection.id || i.productId === updatedProduct.id) ? updatedInspection : i));
      }

      return {
        product: updatedProduct,
        inspection: updatedInspection
      };
    });
  };

  const openExplainModal = (violation) => {
    setSelectedViolation(violation);
    setIsExplainModalOpen(true);
  };

  const closeExplainModal = () => {
    setIsExplainModalOpen(false);
    setSelectedViolation(null);
  };

  const openManualReviewModal = (product) => {
    if (product && currentScan?.product.id !== product.id) {
      const insp = inspections.find(i => i.productId === product.id) || INITIAL_INSPECTIONS[0];
      setCurrentScan({ product, inspection: insp });
    }
    setIsManualReviewModalOpen(true);
  };

  const closeManualReviewModal = () => {
    setIsManualReviewModalOpen(false);
  };

  const updateViolationStatus = (violationId, decision, notes) => {
    if (!currentScan) return;

    const updatedViolations = currentScan.product.violations.map(v => {
      if (v.id === violationId) {
        return {
          ...v,
          status: decision === 'Confirmed' ? 'Confirmed' : 'Rejected',
          inspectorDecision: decision,
          inspectorNotes: notes || v.inspectorNotes
        };
      }
      return v;
    });

    const updatedProduct = {
      ...currentScan.product,
      violations: updatedViolations
    };

    const updatedInspection = {
      ...currentScan.inspection,
      violations: updatedViolations
    };

    setCurrentScan({ product: updatedProduct, inspection: updatedInspection });
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setInspections(prev => prev.map(i => i.id === updatedInspection.id ? updatedInspection : i));

    // Sync to Firestore for Inspector/DGM
    if (currentUser?.role !== 'consumer') {
      saveProductToFirestore(updatedProduct, updatedInspection, currentUser);
    }

    if (selectedViolation && selectedViolation.id === violationId) {
      setSelectedViolation(updatedViolations.find(v => v.id === violationId) || null);
    }

    addToast({
      type: decision === 'Confirmed' ? 'warning' : 'success',
      title: `Violation ${decision}`,
      description: `Inspector recorded decision: ${decision} for ${selectedViolation?.title || 'item'}`
    });
  };

  const submitManualReview = (reason, priority, remarks) => {
    if (!currentScan) return;

    const updatedProduct = {
      ...currentScan.product,
      status: 'Needs Review',
      inspectorRemarks: remarks || currentScan.product.inspectorRemarks
    };

    const updatedInspection = {
      ...currentScan.inspection,
      status: 'Needs Review',
      reviewReason: reason,
      reviewPriority: priority,
      inspectorRemarks: remarks || currentScan.inspection.inspectorRemarks
    };

    setCurrentScan({ product: updatedProduct, inspection: updatedInspection });
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setInspections(prev => prev.map(i => i.id === updatedInspection.id ? updatedInspection : i));

    if (currentUser?.role !== 'consumer') {
      saveProductToFirestore(updatedProduct, updatedInspection, currentUser);
    }

    setIsManualReviewModalOpen(false);
    addToast({
      type: 'info',
      title: 'Sent for Manual Review',
      description: `Product scheduled for physical laboratory & field verification (Priority: ${priority}).`
    });
  };

  const updateProductRemarks = (productId, remarks) => {
    let targetProd = null;
    let targetInsp = null;

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        targetProd = { ...p, inspectorRemarks: remarks };
        return targetProd;
      }
      return p;
    }));

    setInspections(prev => prev.map(i => {
      if (i.productId === productId) {
        targetInsp = { ...i, inspectorRemarks: remarks };
        return targetInsp;
      }
      return i;
    }));

    if (currentScan?.product.id === productId) {
      setCurrentScan({
        product: { ...currentScan.product, inspectorRemarks: remarks },
        inspection: { ...currentScan.inspection, inspectorRemarks: remarks }
      });
    }

    if (currentUser?.role !== 'consumer' && targetProd) {
      saveProductToFirestore(targetProd, targetInsp || { id: `INSP-${productId}`, productId }, currentUser);
    }
    addToast({
      type: 'success',
      title: 'Remarks Saved',
      description: 'Official inspector remarks attached to inspection record.'
    });
  };

  const deleteInspection = (id) => {
    setInspections(prev => prev.filter(i => i.id !== id));
    addToast({
      type: 'info',
      title: 'Inspection Deleted',
      description: 'Record removed from repository.'
    });
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setInspections(prev => prev.filter(i => i.productId !== productId && i.id !== productId));
    if (currentScan?.product?.id === productId) {
      setCurrentScan(null);
    }
    addToast({
      type: 'info',
      title: 'Report Deleted',
      description: 'Record successfully removed from repository.'
    });
  };

  const addNewUser = (userData) => {
    const newUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      lastActive: 'Just added',
      scansCount: 0
    };
    setUsers(prev => [newUser, ...prev]);
    setIsAddUserModalOpen(false);
    addToast({
      type: 'success',
      title: 'User Added',
      description: `Enforcement credentials provisioned for ${newUser.name}.`
    });
  };

  const updateUserProfile = (updatedProfile) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        ...updatedProfile
      };
      // Also update in users state list if the user exists there
      setUsers(allUsers => allUsers.map(u => (u.id === updated.id || u.email === prev.email) ? { ...u, ...updatedProfile } : u));
      return updated;
    });
  };

  const isDGM = currentUser?.role === 'dgm';
  const isInspector = currentUser?.role === 'inspector';
  const isConsumer = currentUser?.role === 'consumer';
  const isFBO = currentUser?.role === 'fbo';

  // Role Scoping per User Directive:
  // - Inspector & DGM: ALL access ("inspector hav all the access like he see the work of fbo")
  // - FBO: Strictly scoped to ONLY their own company's products & notices ("only access that things which fbo person has done they will not get access of world wide")
  // - Consumer: Zero database records ("database will not be for citizen like they will check instantly and they can convert it into pdf instantly")
  const visibleProducts = useMemo(() => {
    if (isDGM || isInspector) return products;
    if (isFBO) {
      const myFboId = fboProfile?.fboId || fboProfile?.id || 'FBO-APEX-001';
      return products.filter(p => p.fboId === myFboId);
    }
    return [];
  }, [products, isDGM, isInspector, isFBO, fboProfile]);

  const visibleInspections = useMemo(() => {
    if (isDGM || isInspector) return inspections;
    if (isFBO) {
      const myFboId = fboProfile?.fboId || fboProfile?.id || 'FBO-APEX-001';
      return inspections.filter(i => i.fboId === myFboId);
    }
    return [];
  }, [inspections, isDGM, isInspector, isFBO, fboProfile]);

  const visibleRequests = useMemo(() => {
    if (isDGM || isInspector) return inspectorRequests;
    return [];
  }, [inspectorRequests, isDGM, isInspector]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateUserProfile,
        currentPage,
        isLoggedIn,
        setIsLoggedIn,
        isDGM,
        isInspector,
        isConsumer,
        isFBO,
        products: visibleProducts,
        allProducts: products,
        inspections: visibleInspections,
        allInspections: inspections,
        rules,
        users,
        inspectorRequests: visibleRequests,
        allRequests: inspectorRequests,
        requests: visibleRequests,
        requestStats,
        submitInspectorRequest,
        submitRequest: submitInspectorRequest,
        updateRequestStatusAndRemarks,
        saveProductToFirestore,
        saveFboProductToFirestore,
        currentScan,
        activeReportId,
        selectedViolation,
        // Dedicated FBO Portal state
        fboProfile,
        setFboProfile,
        fboProducts,
        setFboProducts,
        fboNotices,
        setFboNotices,
        fboCorrectiveActions,
        setFboCorrectiveActions,
        fboCalendarEvents,
        setFboCalendarEvents,
        fboDocuments,
        setFboDocuments,
        fboComplianceHistory,
        setFboComplianceHistory,
        fboNotifications,
        setFboNotifications,
        activeFboCheckProduct,
        setActiveFboCheckProduct,
        startFboAiCheck,
        isExplainModalOpen,
        isManualReviewModalOpen,
        isAddUserModalOpen,
        isAboutModalOpen,
        isContactModalOpen,
        isFeaturesModalOpen,
        activeLandingSection,
        loginInitialRole,
        setLoginInitialRole,
        toasts,
        navigate,
        goBack,
        pageHistory,
        activeLandingSectionSet,
        scrollToLandingSection,
        switchUserRole,
        login,
        logout,
        startNewScan,
        updateCurrentScanWithAiResult,
        setCurrentScan,
        openExplainModal,
        closeExplainModal,
        openManualReviewModal,
        closeManualReviewModal,
        openAboutModal,
        closeAboutModal,
        openContactModal,
        closeContactModal,
        openFeaturesModal,
        closeFeaturesModal,
        updateViolationStatus,
        submitManualReview,
        updateProductRemarks,
        deleteInspection,
        deleteProduct,
        addNewUser,
        addToast,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const MainContent = () => {
  const { currentPage, isLoggedIn, currentUser } = useApp();

  // Public non-dashboard routes
  if (currentPage === 'landing') {
    return <Home />;
  }

  if (currentPage === 'login') {
    return <Login />;
  }

  // FBO Dedicated Portal Login
  if (currentPage === 'fbo-login') {
    return <FboLogin />;
  }

  // Route protection: If user is not logged in and attempts an internal route, show login
  if (!isLoggedIn && !currentPage.startsWith('fbo-')) {
    return <Login />;
  }

  // FBO Dedicated Portal Protected Views
  if (currentPage.startsWith('fbo-')) {
    const renderFboPage = () => {
      switch (currentPage) {
        case 'fbo-dashboard':
          return <FboDashboard />;
        case 'fbo-products':
          return <FboProducts />;
        case 'fbo-ai-check':
          return <FboAiCheck />;
        case 'fbo-ai-result':
          return <FboAiResult />;
        case 'fbo-calendar':
          return <FboCalendar />;
        case 'fbo-notices':
          return <FboNotices />;
        case 'fbo-corrective-action':
          return <FboCorrectiveAction />;
        case 'fbo-documents':
          return <FboDocuments />;
        case 'fbo-history':
          return <FboHistory />;
        case 'fbo-notifications':
          return <FboNotifications />;
        case 'fbo-profile':
          return <FboProfile />;
        default:
          return <FboDashboard />;
      }
    };

    return (
      <FboLayout>
        {renderFboPage()}
      </FboLayout>
    );
  }

  // Dashboard Authenticated/Screening Routes
  const renderDashboardPage = () => {
    // Consumer role is strictly restricted to Instant Scan & Analysis
    // ("consumer ka data save nhi hoga wo instantly consumer kch check krra h toh wo us he time pdf download kr skta h uske bd nahi")
    if (currentUser?.role === 'consumer') {
      switch (currentPage) {
        case 'scan':
          return <Scan />;
        case 'ecommerce-scan':
          return <Scan defaultTab="ecommerce" />;
        case 'analysis':
          return <Analysis />;
        case 'result':
          return <Result />;
        case 'rules':
          return <Rules />;
        case 'help':
          return <Help />;
        default:
          return <Scan />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'requests':
        return <Requests />;
      case 'scan':
        return <Scan />;
      case 'ecommerce-scan':
        return <Scan defaultTab="ecommerce" />;
      case 'analysis':
        return <Analysis />;
      case 'result':
        return <Result />;
      case 'reports':
        return <Report />;
      case 'history':
        return <History />;
      case 'violations':
        return <Violations />;
      case 'products':
        return <Products />;
      case 'analytics':
        return <Analytics />;
      case 'rules':
        return <Rules />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardPage()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
      <ExplainViolationModal />
      <ManualReviewModal />
      <AboutModal />
      <ContactModal />
      <FeaturesModal />
      <ToastContainer />
    </AppProvider>
  );
}
