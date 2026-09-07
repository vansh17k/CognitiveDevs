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
  Plus
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data.js';

export const Products = () => {
  const { products, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const displayProducts = products.length > 0 ? products : INITIAL_PRODUCTS;

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

  const handleInspectProduct = (prod) => {
    navigate('result', { productId: prod.id });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Packaged Commodities Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered and screened consumer packaged goods across regional retail networks.
          </p>
        </div>

        <button
          onClick={() => navigate('scan')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0d4734] hover:bg-[#083325] text-white font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register & Scan Commodity</span>
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by brand, commodity name, manufacturer..."
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
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Compliant">✓ Compliant</option>
          <option value="Non-Compliant">✕ Non-Compliant</option>
        </select>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => {
          const isCompliant = p.complianceScore >= 90 && p.violations.length === 0;
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
                    {p.complianceScore}/100
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">{p.category}</span>
                    <span className="text-[10px] font-mono text-slate-500">{p.batchNo}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 leading-snug truncate">{p.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 pt-0.5 font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">Net Quantity</span>
                      <span className="font-bold text-slate-800 text-xs">{p.netQuantityDeclared || '500 ml'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">MRP</span>
                      <span className="font-bold text-slate-800 text-xs">{p.mrpDeclared || '₹30.00'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 block font-semibold">Manufacturer</span>
                      <span className="font-medium text-slate-700 text-[11px] truncate block font-sans">{p.manufacturerName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {p.violations.length} {p.violations.length === 1 ? 'infraction' : 'infractions'}
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
    </div>
  );
};
