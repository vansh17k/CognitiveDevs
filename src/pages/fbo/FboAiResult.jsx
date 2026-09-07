import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Upload, 
  FileText, 
  Info, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { exportReportToPDF, getProductReportItems } from '../../utils/exportReport.js';

export const FboAiResult = () => {
  const { 
    activeFboCheckProduct, 
    fboProducts = [], 
    navigate, 
    addToast 
  } = useApp();

  const product = activeFboCheckProduct || fboProducts[0];
  const score = product?.complianceScore || 84;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'high' | 'medium' | 'good'
  const [selectedIssueForDrawer, setSelectedIssueForDrawer] = useState(null);

  const issuesList = [
    {
      id: 'iss-high-1',
      severity: 'high',
      title: 'Nutrition declaration requires review',
      regulatoryReference: 'FSSAI (Packaging & Labelling) Amendment 2020 & Rule 6 PCR 2011',
      whatIsWrong: 'Label displays "Total Carbohydrates: 82g, Sugars: 80g" but lacks the mandatory separate line item for "Added Sugars" and % RDA contribution per serving.',
      whyItMatters: 'Mandatory statutory requirement under FSSAI Gazette Notification 2020. Non-declaration attracts misbranding compounding penalty under Section 52 of Food Safety & Standards Act 2006 (up to ₹3,00,000).',
      recommendedCorrection: 'Update nutrition facts panel on back packaging artwork to explicitly list: "Added Sugars: 0g (0% RDA)" directly below Total Sugars.',
      evidenceSnippet: 'Extracted OCR text: "Nutrition Info: Energy 320kcal, Carbohydrates 82g, Sugars 80g, Protein 0.3g". Missing sub-row: Added Sugars.',
      priority: 'High Priority (Pre-Release Blocker)'
    },
    {
      id: 'iss-med-1',
      severity: 'medium',
      title: 'Allergen information may need clarification',
      regulatoryReference: 'Food Safety and Standards (Labelling and Display) Regulations 2020 Reg 5(3)',
      whatIsWrong: 'Facility handles mustard seed processing on shared lines. Advisory declaration is present but set in 4.5pt non-bold gray font.',
      whyItMatters: 'Regulations require cross-contamination cautionary statements to be presented in high-contrast bold font to protect sensitized consumers.',
      recommendedCorrection: 'Format advisory declaration in prominent bold typeface: "Allergen Advisory: Made in a facility that also processes Mustard and Sesame."',
      evidenceSnippet: 'Detected cautionary text at bottom left corner: "May contain traces of mustard seeds" in low contrast typography.',
      priority: 'Medium Priority'
    }
  ];

  const goodPointsList = [
    {
      title: 'Manufacturer Address & Pincode Verified',
      rule: 'Rule 6(1)(a) Legal Metrology & FSSAI',
      detail: 'Registered office and processing plant address in Indore, MP detected with valid 6-digit PIN code (452010).'
    },
    {
      title: '14-Digit FSSAI License Number Displayed',
      rule: 'FSSAI License Display Order 2021',
      detail: 'License #10020022001948 displayed alongside FSSAI logotype with minimum 1.5mm numeral height.'
    },
    {
      title: 'Green Vegetarian Emblem Compliant',
      rule: 'FSSAI Food Labelling & Display 2020',
      detail: 'Green filled circle in square frame measured at 8.2mm x 8.2mm (exceeds 6mm minimum for 500g pack).'
    },
    {
      title: 'Customer Care & Grievance Contact Complete',
      rule: 'Rule 6(1)(e) Legal Metrology Act',
      detail: 'Consumer support email, 1800 toll-free number, and grievance officer designation clearly listed.'
    }
  ];

  const handleDownloadReport = () => {
    const items = getProductReportItems(product);
    const ok = exportReportToPDF(product, null, items, 'FBO pre-compliance self-assessment inspection record under Legal Metrology & FSSAI rules.');
    if (ok) {
      addToast({
        type: 'success',
        title: 'Pre-Audit Report Downloaded',
        description: `Pre-compliance summary for ${product.name} exported as PDF.`
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <button
            onClick={() => navigate('fbo-ai-check')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Scanner</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#0d4734] font-bold text-[10px] uppercase tracking-wider border border-emerald-200">
              AI ASSESSMENT REPORT
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-600 font-mono">{product?.productId || 'APX-HNY-500G'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {product?.name || 'Apex Pure Honey with Natural Honeycomb (500g)'}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Pre-Audit PDF</span>
          </button>

          <button
            onClick={() => navigate('fbo-corrective-action')}
            className="px-4 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Start Corrective Action (CAPA)</span>
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-[#083325] flex items-start gap-3 shadow-2xs">
        <Shield className="w-5 h-5 text-[#0d4734] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#0d4734]">
            Pre-Compliance Disclaimer:
          </p>
          <p className="text-emerald-950 leading-relaxed mt-0.5">
            <strong>"This is an AI-assisted pre-compliance assessment and does not constitute official FSSAI approval or certification."</strong> Use these findings to proactively align packaging proofs before commercial production.
          </p>
        </div>
      </div>

      {/* Score Summary Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        
        {/* Score Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pre-Compliance Score
          </span>
          <div className="text-5xl font-black text-slate-900 my-2">
            {score}<span className="text-2xl text-slate-400 font-semibold">/100</span>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-[#0d4734] font-bold text-xs rounded-full border border-emerald-300">
            Mostly Compliant
          </span>
          <p className="text-[11px] text-slate-500 mt-3 max-w-[200px]">
            2 non-critical advisory improvements identified. Ready after minor layout adjustments.
          </p>
        </div>

        {/* Breakdown Stats */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Summary Findings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated optical evaluation against FSSAI Labelling 2020 & Legal Metrology PCR 2011.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-amber-800 font-semibold block text-[11px]">🟠 High Priority</span>
              <span className="text-xl font-bold text-amber-900">1 Item</span>
              <p className="text-[10px] text-amber-700 mt-0.5">Added Sugars Breakout</p>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <span className="text-yellow-800 font-semibold block text-[11px]">🟡 Medium Priority</span>
              <span className="text-xl font-bold text-yellow-900">1 Item</span>
              <p className="text-[10px] text-yellow-700 mt-0.5">Allergen Font Weight</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-emerald-800 font-semibold block text-[11px]">🟢 Compliant Checks</span>
              <span className="text-xl font-bold text-emerald-900">4 Points</span>
              <p className="text-[10px] text-emerald-700 mt-0.5">FSSAI, Address, Veg Mark</p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate('fbo-products')}
              className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Fix & Re-upload Label</span>
            </button>
            <button
              onClick={() => navigate('fbo-ai-check')}
              className="py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Scan Another SKU
            </button>
          </div>
        </div>

      </div>

      {/* Categorized Issues & Deep Analysis */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Detailed Issue Breakdown & Recommended Actions
          </h3>
          <span className="text-xs text-slate-500 font-medium">Click any issue for regulatory details</span>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {issuesList.map((issue) => (
            <div 
              key={issue.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-4 ${
                issue.severity === 'high' 
                  ? 'border-amber-300 ring-1 ring-amber-100' 
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                    issue.severity === 'high' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                  }`}>
                    {issue.severity === 'high' ? '🟠 High' : '🟡 Medium'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {issue.title}
                  </h4>
                </div>

                <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-center">
                  Ref: {issue.regulatoryReference}
                </span>
              </div>

              {/* 4-Part Deep Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* 1. What is wrong? */}
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>What is wrong?</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {issue.whatIsWrong}
                  </p>
                </div>

                {/* 2. Why it matters */}
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Info className="w-3.5 h-3.5 text-[#0d4734]" />
                    <span>Why it matters (Statutory Risk)</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {issue.whyItMatters}
                  </p>
                </div>

                {/* 3. Recommended correction */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1 md:col-span-2">
                  <span className="font-bold text-[#0d4734] flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0d4734]" />
                    <span>Recommended Correction</span>
                  </span>
                  <p className="text-emerald-950 font-medium leading-relaxed">
                    {issue.recommendedCorrection}
                  </p>
                </div>

                {/* 4. Evidence Snippet */}
                <div className="p-3 bg-[#083325] text-emerald-100/90 rounded-xl font-mono text-[11px] md:col-span-2 space-y-1">
                  <span className="text-emerald-400 uppercase tracking-wider text-[10px] font-bold block">
                    OCR Extracted Evidence:
                  </span>
                  <p className="text-emerald-100">
                    {issue.evidenceSnippet}
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => navigate('fbo-products')}
                  className="px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Fix & Re-upload Label</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Compliant / Good Points Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Verified Compliant Declarations (🟢 Good Points)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {goodPointsList.map((good, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/40 border border-emerald-200/70 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{good.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                    {good.rule}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                  {good.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
