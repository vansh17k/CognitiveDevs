import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Plus,
  Globe,
  Building2,
  Database,
  Layers,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data.js';

export const Products = () => {
  const { products, fboProducts = [], currentUser, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('inspector-field'); // 'inspector-field' | 'fbo-submissions'
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const isInspectorOrDgm = currentUser?.role === 'inspector' || currentUser?.role === 'dgm';
  const displayProducts = products.length > 0 ? products : INITIAL_PRODUCTS;

  // Filtered Field Products
  const filteredProducts = displayProducts.filter(p => {
    const s = (search || '').toLowerCase();
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(s) ||
      (p.brand || '').toLowerCase().includes(s) ||
      (p.manufacturerName || '').toLowerCase().includes(s);
    const matchesCat = category === 'All' || p.category === category;
    const isCompliant = (p.complianceScore || 0) >= 90 && (p.violations || []).length === 0;
    const matchesStat = status === 'All' || 
      (status === 'Compliant' && isCompliant) ||
      (status === 'Non-Compliant' && !isCompliant);
    return matchesSearch && matchesCat && matchesStat;
  });

  // Filtered FBO Products
  const filteredFboProducts = fboProducts.filter(p => {
    const s = (search || '').toLowerCase();
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(s) ||
      (p.productId || '').toLowerCase().includes(s) ||
      (p.fboId || '').toLowerCase().includes(s);
    const matchesCat = category === 'All' || (p.category || '').includes(category);
    return matchesSearch && matchesCat;
  });

  const handleInspectProduct = (prod) => {
    navigate('result', { productId: prod.id });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
              <Database className="w-3 h-3 text-emerald-600" />
              Firebase Firestore Active
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              {isInspectorOrDgm ? 'Inspector Full Oversight (Field & FBO Submissions)' : 'Scoped Catalog'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Legal Metrology Product Repository</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cloud database tracking physical retail samples and digital pre-market audits submitted by Food Business Operators.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('scan')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0d4734] hover:bg-[#083325] text-white font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register & Scan Commodity</span>
          </button>

          <button
            onClick={() => navigate('ecommerce-scan')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-[#0d4734] border border-emerald-300 font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Scan e-commerce link (Rule 6(10))"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>E-Com Link Scan</span>
          </button>
        </div>
      </div>

      {/* Role Scoped Segmented Switcher for Inspector */}
      {isInspectorOrDgm && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('inspector-field')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inspector-field'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              <span>Field Inspections & Retail Samples ({filteredProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('fbo-submissions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'fbo-submissions'
                  ? 'bg-[#0d4734] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>FBO Self-Compliance Submissions ({filteredFboProducts.length})</span>
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-800 text-emerald-100 rounded text-[10px] font-mono">
                Work of FBO
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono px-2 hidden md:block">
            {activeTab === 'inspector-field' ? 'Statewide retail seizures & field inspections' : 'Pre-market packaging audits submitted by FBOs'}
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'inspector-field' ? "Search products by brand, commodity name, manufacturer..." : "Search FBO submissions by product name, batch, or FBO ID..."}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Food & Beverages">Food & Beverages</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Household">Household</option>
          <option value="Snacks">Snacks & Savoury</option>
        </select>

        {activeTab === 'inspector-field' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Compliant">✓ Compliant</option>
            <option value="Non-Compliant">✕ Non-Compliant</option>
          </select>
        )}
      </div>

      {/* TAB 1: FIELD INSPECTION PRODUCTS */}
      {activeTab === 'inspector-field' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isCompliant = (p.complianceScore || 0) >= 90 && (!p.violations || p.violations.length === 0);
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Status Badge */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold shadow-2xs ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {isCompliant ? 'Compliant' : 'Non-Compliant'}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-800 shadow-2xs">
                      {p.complianceScore || 85}/100
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">{p.category}</span>
                      <span className="text-[10px] font-mono text-slate-500">{p.batchNo || 'LOT-2026'}</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-800 leading-snug truncate">{p.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 pt-0.5 font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">Net Quantity</span>
                        <span className="font-bold text-slate-800 text-xs">{p.netQuantityDeclared || p.netQuantity || '500 ml'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">MRP</span>
                        <span className="font-bold text-slate-800 text-xs">{p.mrpDeclared || p.mrp || '₹30.00'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-400 block font-semibold">Manufacturer / Packer</span>
                        <span className="font-medium text-slate-700 text-[11px] truncate block font-sans">{p.manufacturerName || 'Licensed Packaged Commodity'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {(p.violations || []).length} {p.violations?.length === 1 ? 'infraction' : 'infractions'}
                  </span>

                  <button
                    onClick={() => handleInspectProduct(p)}
                    className="px-2.5 py-1 bg-[#0d4734] hover:bg-[#083325] text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Analysis</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: FBO SUBMISSIONS (INSPECTOR SEES THE WORK OF FBO!) */}
      {activeTab === 'fbo-submissions' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <p className="font-bold">FBO Regulatory Oversight Station</p>
              <p className="text-emerald-800 mt-0.5">
                Inspectors have supervisory access to all packaging designs, OCR checks, and pre-release audits submitted by Food Business Operators (FBOs) to the cloud database before printing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFboProducts.map((p) => {
              const isCompliant = (p.complianceScore || 0) >= 80;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Image */}
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={p.currentLabel || p.imageUrl || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold shadow-2xs ${
                          isCompliant
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {p.complianceStatus || (isCompliant ? 'Ready for Market' : 'Requires Revision')}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-800 shadow-2xs">
                        Score: {p.complianceScore || 85}/100
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {p.fboId || 'FBO-APEX-001'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">SKU: {p.productId}</span>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">{p.name}</h3>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">{p.category}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 block">Declared Net Qty</span>
                          <span className="font-bold text-slate-800">{p.netQuantity || '250 g'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Declared MRP</span>
                          <span className="font-bold text-slate-800">{p.mrp || '₹ 120.00'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] text-slate-400 block">FSSAI License</span>
                          <span className="text-slate-700 text-[11px] font-semibold">10020022001948</span>
                        </div>
                      </div>

                      {p.issues && p.issues.length > 0 && (
                        <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                          <span className="font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {p.issues.length} Discrepancy Found in Self-Audit:
                          </span>
                          <p className="truncate mt-0.5 text-[10px] text-amber-800">
                            {p.issues[0]?.rule || p.issues[0]?.title || 'Check Rule 6 declaration height'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      FBO Pre-Check
                    </span>

                    <button
                      onClick={() => navigate('scan')}
                      className="px-2.5 py-1 bg-[#0d4734] hover:bg-[#083325] text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Audit FBO Label</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
