import React, { useEffect, useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  Scan, 
  CheckSquare, 
  AlertTriangle, 
  FileText, 
  Shield, 
  ShieldCheck, 
  Sparkles, 
  Scale,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Zap,
  Menu,
  ScanLine,
  QrCode,
  Target,
  Award,
  Building2,
  UserCheck,
  ShoppingBag,
  Globe,
  Link2
} from 'lucide-react';
import { Emblem, TopNavGlider } from '../components.jsx';
import { motion } from 'motion/react';

export const Home = () => {
  const { 
    navigate, 
    login,
    activeLandingSection, 
    activeLandingSectionSet, 
    scrollToLandingSection,
    addToast 
  } = useApp();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Inspector',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Feature Card Highlight on click (without page redirection)
  const [highlightedCard, setHighlightedCard] = useState(null);

  // Active Section Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      
      const homeEl = document.getElementById('home');
      const featuresEl = document.getElementById('features');
      const aboutEl = document.getElementById('about');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollPos >= contactEl.offsetTop - 100) {
        activeLandingSectionSet('contact');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop - 100) {
        activeLandingSectionSet('about');
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop - 100) {
        activeLandingSectionSet('features');
      } else {
        activeLandingSectionSet('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeLandingSectionSet]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        description: 'Please provide your name, email, and query message.'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addToast({
        type: 'success',
        title: 'Inquiry Submitted',
        description: 'Your inquiry #SURAKSHA1-' + Math.floor(100000 + Math.random() * 900000) + ' has been registered with the Legal Metrology Desk.'
      });
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          category: 'Inspector',
          subject: '',
          message: ''
        });
      }, 3500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-slate-900 flex flex-col font-sans scroll-smooth">
      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Left: Logo & Emblem */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" 
              onClick={() => scrollToLandingSection('home')}
            >
              <img 
                src="/images/logo.png" 
                alt="SURAKSHA1 Logo" 
                className="w-15 h-15 object-contain shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-800 tracking-tight leading-none">SURAKSHA1</span>
                <span className="text-[10px] text-slate-500 font-medium">Govt. of India</span>
              </div>
            </div>
          </div>

          {/* Right Action & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center">
              <TopNavGlider activeSection={activeLandingSection} onSelect={scrollToLandingSection} />
            </div>

            <button
              onClick={() => navigate('login')}
              className="px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0d4734] hover:bg-[#083325] rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Login Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= SECTION 1: HOME / HERO ================= */}
      <section id="home" className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-[#ebf5ef] via-[#f2f8f4] to-[#f7faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            
            {/* Content */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 border border-emerald-300/80 rounded-full text-[11px] font-bold text-[#0d4734]">
              <Scale className="w-3.5 h-3.5" />
              <span>Statutory Enforcement & Consumer Protection</span>
            </div>

            <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d4734] tracking-tight leading-tight">
              SURAKSHA1
            </h1>
            
            <h2 className="text-base sm:text-lg font-bold text-slate-700">
              Packaged Commodities Rules (PCR), 2011
            </h2>

            <div className="pt-2">
              <p className="text-base sm:text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Scan. Detect. Comply.</span>
              </p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1.5 max-w-2xl">
                Automated AI-assisted platform engineered to inspect, extract, and validate mandatory consumer declarations on pre-packaged goods as per the Legal Metrology Act, 2009.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => navigate('scan')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Scan Product Label</span>
              </button>
              <button
                onClick={() => scrollToLandingSection('features')}
                className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Officer Stats strip */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-600 border-t border-slate-200/80 max-w-lg">
              <div>
                <span className="font-extrabold text-slate-900 text-base">99.4%</span>
                <p className="text-[11px] text-slate-500">OCR Label Accuracy</p>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="font-extrabold text-slate-900 text-base">8 / 8</span>
                <p className="text-[11px] text-slate-500">Rule 6 Declarations</p>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="font-extrabold text-slate-900 text-base">&lt; 5 sec</span>
                <p className="text-[11px] text-slate-500">Automated Audit</p>
              </div>
            </div>

          </div>


          {/* 4 Feature Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {/* Card 1: Scan & Extract */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setHighlightedCard(prev => prev === 'scan' ? null : 'scan')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHighlightedCard(prev => prev === 'scan' ? null : 'scan');
                }
              }}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex items-start gap-3.5 ${
                highlightedCard === 'scan'
                  ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 border-emerald-500 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/40 -translate-y-1 scale-[1.02]'
                  : 'bg-white/90 backdrop-blur-xs border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-50/80'
              }`}
            >
              {highlightedCard === 'scan' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-400/20 via-teal-300/10 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className={`p-2.5 rounded-xl shrink-0 border transition-all duration-300 ${
                highlightedCard === 'scan'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-md shadow-emerald-600/30 scale-105'
                  : 'bg-emerald-50 text-[#0d4734] border-emerald-100/80'
              }`}>
                <Scan className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className={`text-xs font-bold transition-colors ${
                    highlightedCard === 'scan' ? 'text-emerald-950' : 'text-slate-900'
                  }`}>
                    Scan & Extract
                  </h3>
                  {highlightedCard === 'scan' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300/60 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-snug mt-0.5 transition-colors ${
                  highlightedCard === 'scan' ? 'text-emerald-900/80 font-medium' : 'text-slate-500'
                }`}>
                  Upload package image or use camera to extract text in real time
                </p>
              </div>
            </div>

            {/* Card 2: Validate Compliance */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setHighlightedCard(prev => prev === 'validate' ? null : 'validate')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHighlightedCard(prev => prev === 'validate' ? null : 'validate');
                }
              }}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex items-start gap-3.5 ${
                highlightedCard === 'validate'
                  ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 border-emerald-500 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/40 -translate-y-1 scale-[1.02]'
                  : 'bg-white/90 backdrop-blur-xs border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-50/80'
              }`}
            >
              {highlightedCard === 'validate' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-400/20 via-teal-300/10 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className={`p-2.5 rounded-xl shrink-0 border transition-all duration-300 ${
                highlightedCard === 'validate'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-md shadow-emerald-600/30 scale-105'
                  : 'bg-emerald-50 text-[#0d4734] border-emerald-100/80'
              }`}>
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className={`text-xs font-bold transition-colors ${
                    highlightedCard === 'validate' ? 'text-emerald-950' : 'text-slate-900'
                  }`}>
                    Validate Compliance
                  </h3>
                  {highlightedCard === 'validate' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300/60 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-snug mt-0.5 transition-colors ${
                  highlightedCard === 'validate' ? 'text-emerald-900/80 font-medium' : 'text-slate-500'
                }`}>
                  AI verifies 8 mandatory declarations and font height rules
                </p>
              </div>
            </div>

            {/* Card 3: Identify Violations */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setHighlightedCard(prev => prev === 'violations' ? null : 'violations')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHighlightedCard(prev => prev === 'violations' ? null : 'violations');
                }
              }}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex items-start gap-3.5 ${
                highlightedCard === 'violations'
                  ? 'bg-gradient-to-br from-red-50 via-white to-rose-50/70 border-red-500 shadow-lg shadow-red-500/15 ring-2 ring-red-500/40 -translate-y-1 scale-[1.02]'
                  : 'bg-white/90 backdrop-blur-xs border-slate-200/90 shadow-2xs hover:border-red-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-50/80'
              }`}
            >
              {highlightedCard === 'violations' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-400/20 via-rose-300/10 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className={`p-2.5 rounded-xl shrink-0 border transition-all duration-300 ${
                highlightedCard === 'violations'
                  ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-500 shadow-md shadow-red-600/30 scale-105'
                  : 'bg-red-50 text-red-600 border-red-100/80'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className={`text-xs font-bold transition-colors ${
                    highlightedCard === 'violations' ? 'text-red-950' : 'text-slate-900'
                  }`}>
                    Identify Violations
                  </h3>
                  {highlightedCard === 'violations' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-red-100 text-red-800 border border-red-300/60 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-snug mt-0.5 transition-colors ${
                  highlightedCard === 'violations' ? 'text-red-900/80 font-medium' : 'text-slate-500'
                }`}>
                  Auto-detect missing labels, misleading prices, and illegibility
                </p>
              </div>
            </div>

            {/* Card 4: Generate Reports */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setHighlightedCard(prev => prev === 'reports' ? null : 'reports')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHighlightedCard(prev => prev === 'reports' ? null : 'reports');
                }
              }}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex items-start gap-3.5 ${
                highlightedCard === 'reports'
                  ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 border-emerald-500 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/40 -translate-y-1 scale-[1.02]'
                  : 'bg-white/90 backdrop-blur-xs border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-50/80'
              }`}
            >
              {highlightedCard === 'reports' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-400/20 via-teal-300/10 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className={`p-2.5 rounded-xl shrink-0 border transition-all duration-300 ${
                highlightedCard === 'reports'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-md shadow-emerald-600/30 scale-105'
                  : 'bg-emerald-50 text-[#0d4734] border-emerald-100/80'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className={`text-xs font-bold transition-colors ${
                    highlightedCard === 'reports' ? 'text-emerald-950' : 'text-slate-900'
                  }`}>
                    Generate Reports
                  </h3>
                  {highlightedCard === 'reports' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300/60 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-snug mt-0.5 transition-colors ${
                  highlightedCard === 'reports' ? 'text-emerald-900/80 font-medium' : 'text-slate-500'
                }`}>
                  Export legally admissible PDF / Excel statutory audit memos
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-10 pb-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0d4734]" />
              <span>Ministry Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0d4734]" />
              <span>Legally Admissible</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0d4734]" />
              <span>AI OCR Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0d4734]" />
              <span>Rule 6 PCR 2011</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: FEATURES ================= */}
      <section id="features" className="py-20 bg-white border-t border-slate-200 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-[#0d4734] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Comprehensive System Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for Modern Legal Metrology Enforcement
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Designed specifically for field inspectors, regional enforcement directorates, and packaging compliance auditors to eliminate manual screening bottlenecks.
            </p>
          </div>

          {/* Feature Cards Grid (6 Main Modules) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: AI OCR */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d4734] flex items-center justify-center group-hover:bg-[#0d4734] group-hover:text-white transition-colors shadow-2xs">
                    <Scan className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    99.4% Accuracy
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors">
                  AI OCR & Label Extraction
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  High-speed OCR scanner extracting text from complex curved packaging, foil packaging, multi-color surfaces, and multi-language declarations (English & Hindi).
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Curved bottle & foil glare compensation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Multilingual Devanagari & Latin script OCR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Live bounding-box visual highlights</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <button
                  onClick={() => navigate('scan')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#0d4734] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Launch AI Label Scanner</span>
                </button>
              </div>
            </div>

            {/* Feature 2: Rule 6 Mandatory Checklist */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d4734] flex items-center justify-center group-hover:bg-[#0d4734] group-hover:text-white transition-colors shadow-2xs">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    8 Statutory Clauses
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors">
                  Rule 6 Mandatory Checklist
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Automated verification of Manufacturer info, Net Quantity with metric SI units, MRP (inclusive of all taxes), Date of packing, Country of Origin & Consumer care.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>SI unit validation (g, kg, ml, L)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unit Sale Price (USP) calculation check</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Font size vs. display area ratio check</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <button
                  onClick={() => scrollToLandingSection('about')}
                  className="w-full py-2.5 text-xs font-semibold text-[#0d4734] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>View 8 Clauses Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 3: Violation Engine */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-red-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors shadow-2xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200/80">
                    Real-time Flagging
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Violation & Severity Matrix
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Categorizes non-compliance into Critical, Moderate, and Minor violations mapped directly to Section 36 & 38 compounding penalties under The Act.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Misleading packaging & dual MRP detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Statutory compounding fee estimation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Inspector override & manual review modal</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <button
                  onClick={() => navigate('violations')}
                  className="w-full py-2.5 text-xs font-semibold text-red-700 bg-white hover:bg-red-50 border border-red-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Explore Violation Logs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 4: Statutory Reports */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d4734] flex items-center justify-center group-hover:bg-[#0d4734] group-hover:text-white transition-colors shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    PDF / Excel Export
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors">
                  Statutory Audit Reports
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Generate legally admissible inspection certificates and seizure notices with timestamped officer signatures, divisional barcodes, and photo evidence.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Official Ministry format compliance notices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Seizure register & compounding receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Permanent tamper-proof audit trails</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <button
                  onClick={() => navigate('reports')}
                  className="w-full py-2.5 text-xs font-semibold text-[#0d4734] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>View Sample Reports</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 5: Divisional Analytics */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d4734] flex items-center justify-center group-hover:bg-[#0d4734] group-hover:text-white transition-colors shadow-2xs">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    Zonal Trends
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors">
                  Enforcement Analytics
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Visual dashboards on compliance rates by product category (Beverages, Snacks, Cosmetics), repeat offender identification, and regional heatmaps.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Category-wise non-compliance distribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zonal inspection rate comparisons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manufacturer repeat violation tracking</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <button
                  onClick={() => navigate('analytics')}
                  className="w-full py-2.5 text-xs font-semibold text-[#0d4734] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Open Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 6: Digital Rulebook */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d4734] flex items-center justify-center group-hover:bg-[#0d4734] group-hover:text-white transition-colors shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    Act & Rules Manual
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors">
                  Digital Legal Repository
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Searchable in-app repository of The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011 with clause-by-clause commentary for quick field reference.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Searchable Rule 6, 9, 18 & Schedules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Penal provisions Sections 36 & 38</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Standard font-size lookup matrix</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <button
                  onClick={() => navigate('rules')}
                  className="w-full py-2.5 text-xs font-semibold text-[#0d4734] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Search Rulebook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Live Scanner CTA Bar */}
          <div className="mt-14 p-8 rounded-3xl bg-[#0d4734] text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 relative z-10 text-center md:text-left">
              <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
                Instant Verification
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Have a pre-packaged commodity ready to test?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
                Upload a packaging photo or use standard preset sample packs to inspect declarations within 3 seconds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
              <button
                onClick={() => navigate('scan')}
                className="px-6 py-3 bg-white text-[#0d4734] hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Test Live Sample</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 3: ABOUT ================= */}
      <section id="about" className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 border border-emerald-300 rounded-full text-xs font-bold text-[#0d4734] uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Statutory Framework & Mission</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              About Legal Metrology Enforcement
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Empowering consumers and enforcement officers under the Ministry of Consumer Affairs, Food & Public Distribution with transparent, standard, and legible packaging declarations.
            </p>
          </div>

          {/* Core Objectives & Legal Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-14">
            
            {/* Left Pillar: The Legal Metrology Act, 2009 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-[#0d4734] rounded-xl border border-emerald-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">The Legal Metrology Act, 2009</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Act No. 1 of 2010</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                An Act to establish and enforce standards of weights and measures, regulate trade and commerce in weights, measures and other goods which are sold or distributed by weight, measure or number and for matters connected therewith.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
                  <span><strong>Section 18:</strong> Mandatory declaration on pre-packaged commodities.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
                  <span><strong>Section 36:</strong> Penalty for manufacturing, packing, or selling non-standard packages.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
                  <span><strong>Section 48:</strong> Compounding of statutory offenses by authorized officers.</span>
                </div>
              </div>
            </div>

            {/* Right Pillar: Packaged Commodities Rules, 2011 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-[#0d4734] rounded-xl border border-emerald-100">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Packaged Commodities Rules, 2011</h3>
                  <span className="text-[11px] text-slate-500 font-mono">G.S.R. 202(E) (PCR 2011)</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Framed under Section 52(2)(j) of the Act, laying down detailed specifications for mandatory declarations on every pre-packed commodity meant for retail sale in India.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
                  <span><strong>Rule 6:</strong> Comprehensive 8-point mandatory declaration requirements.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
                  <span><strong>Rule 9:</strong> Language, prominence, and background contrast mandates.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4734] shrink-0 mt-0.5" />
                  <span><strong>Schedule I & II:</strong> Minimum font size specifications based on package area.</span>
                </div>
              </div>
            </div>

          </div>

          {/* 8 Mandatory Declarations Detailed Grid (Rule 6) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Rule 6, PCR 2011
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  The 8 Mandatory Declarations on Pre-Packed Goods
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Every package must carry these 8 declarations legibly, unambiguously, and with proper font height.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  num: '01',
                  title: 'Name & Address',
                  rule: 'Rule 6(1)(a)',
                  desc: 'Complete name & address of manufacturer, packer, or importer.'
                },
                {
                  num: '02',
                  title: 'Generic Name',
                  rule: 'Rule 6(1)(b)',
                  desc: 'Common or generic name of commodity contained in the package.'
                },
                {
                  num: '03',
                  title: 'Net Quantity',
                  rule: 'Rule 6(1)(c)',
                  desc: 'Net weight, measure or number in standard SI metric units (g, kg, ml, L).'
                },
                {
                  num: '04',
                  title: 'Month & Year',
                  rule: 'Rule 6(1)(d)',
                  desc: 'Month and year of manufacture, packing or import.'
                },
                {
                  num: '05',
                  title: 'Retail Sale Price (MRP)',
                  rule: 'Rule 6(1)(e)',
                  desc: 'MRP in Indian Rupees (₹) inclusive of all taxes & Unit Sale Price.'
                },
                {
                  num: '06',
                  title: 'Country of Origin',
                  rule: 'Rule 6(1)(ab)',
                  desc: 'Mandatory country of origin declaration for domestic & imported packages.'
                },
                {
                  num: '07',
                  title: 'Consumer Care Contact',
                  rule: 'Rule 6(1)(n)',
                  desc: 'Name, address, telephone number, and email address for consumer grievances.'
                },
                {
                  num: '08',
                  title: 'Statutory Licences',
                  rule: 'Rule 6(1)(g)',
                  desc: 'Valid 14-digit FSSAI number, BIS ISI standard mark where applicable.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0d4734] font-mono">{item.num}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{item.rule}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 4: CONTACT ================= */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-[#0d4734] uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" />
              <span>Departmental Directory & Grievance Desk</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact & Enforcement Support
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Connect directly with National Consumer Helplines, central directorate desks, or submit a packaging verification query.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Helplines & Headquarters Cards */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Toll-free Helpline */}
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#0d4734] text-white flex items-center justify-center shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  National Consumer Helpline (NCH)
                </span>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
                  1915 / 1800-11-4000
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  24x7 Toll-Free national consumer grievance number for reporting non-compliant packaging or overcharging above MRP.
                </p>
              </div>

              {/* Central Directorate Headquarters */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-[#0d4734]" />
                  <span>Directorate of Legal Metrology (HQ)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution,<br />
                  Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi – 110001
                </p>
              </div>

              {/* Email & Officer Working Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>Official Email</span>
                  </div>
                  <span className="text-xs font-mono text-slate-700 block truncate">lmcc-support@nic.in</span>
                  <span className="text-[10px] text-slate-500">Nodal Directorate Desk</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Working Hours</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 block">09:30 AM – 06:00 PM</span>
                  <span className="text-[10px] text-slate-500">Mon – Fri (Govt. Days)</span>
                </div>
              </div>

            </div>

            {/* Right Column: Direct Query / Grievance Form */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-200 pb-4 mb-5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Submit Officer Query or Inspection Grievance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Have questions regarding Rule 6 interpretations, compounding rates, or technical integration?
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-base">Inquiry Submitted Successfully</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your query has been assigned ticket ID #LEXISCAN-{Math.floor(100000 + Math.random() * 900000)}. Our legal metrology desk officer will respond to your official email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="R. Kumar"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official / Personal Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@gov.in or email"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Stakeholder Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent transition-all text-slate-700"
                      >
                        <option value="Inspector">Field Legal Metrology Inspector</option>
                        <option value="Manufacturer">Manufacturer / Pre-Packer</option>
                        <option value="Importer">Commodity Importer / Distributor</option>
                        <option value="Consumer">Consumer Grievance</option>
                        <option value="Legal">Legal Counsel / Auditor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject / Topic
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Net Qty font height clarification"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Query Details / Remarks *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your inquiry, packaging rule ambiguity, or system enhancement suggestion..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0d4734] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-500">
                      All official communications are logged for audit compliance.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Submitting...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 py-10 px-4 sm:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <img 
                src="/images/logo.png" 
                alt="Suraksha1 Logo" 
                className="w-8 h-8 object-contain shrink-0 bg-white rounded p-0.5" 
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-base tracking-tight">Suraksha1 Portal</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Suraksha1 — Automated detection & validation of mandatory declarations under PCR 2011.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => scrollToLandingSection('home')} className="hover:text-white transition-colors cursor-pointer">Home Portal</button></li>
              <li><button onClick={() => scrollToLandingSection('features')} className="hover:text-white transition-colors cursor-pointer">System Features</button></li>
              <li><button onClick={() => scrollToLandingSection('about')} className="hover:text-white transition-colors cursor-pointer">Statutory Framework</button></li>
              <li><button onClick={() => scrollToLandingSection('contact')} className="hover:text-white transition-colors cursor-pointer">Helpline & Directory</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Enforcement Modules</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => navigate('scan')} className="hover:text-white transition-colors cursor-pointer">AI Label Scanner</button></li>
              <li><button onClick={() => navigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">Inspection Dashboard</button></li>
              <li><button onClick={() => navigate('reports')} className="hover:text-white transition-colors cursor-pointer">Compliance Reports</button></li>
              <li><button onClick={() => navigate('rules')} className="hover:text-white transition-colors cursor-pointer">Rule 6 Compendium</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">National Helpline</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              National Consumer Helpline: <strong className="text-white font-mono">1915</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Department of Consumer Affairs, Krishi Bhawan, New Delhi.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2025 Directorate of Legal Metrology. Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('rules')} className="hover:text-slate-400 transition-colors cursor-pointer">Rule Library</button>
            <button onClick={() => scrollToLandingSection('contact')} className="hover:text-slate-400 transition-colors cursor-pointer">Grievance Cell</button>
            <button onClick={() => navigate('login')} className="hover:text-slate-400 transition-colors cursor-pointer">Officer Access</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
