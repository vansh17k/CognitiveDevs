/**
 * ============================================================================
 * PRODUCT CARD & PRODUCT TABLE COMPONENTS
 * ============================================================================
 * 
 * Interactive presentations for commodity listings, with score indicators,
 * violation chips, quick audit inspection view, and verification triggers.
 */

import React from 'react';
import { Eye, AlertTriangle, CheckCircle, Package, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { formatINR } from '../utils/helpers.js';

export const ProductCard = ({ product, onViewDetails, onInspect }) => {
  const isCompliant = product.complianceScore >= 90 && (!product.violations || product.violations.length === 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar with Brand and Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
            {product.category || 'Commodity'}
          </span>
          <StatusBadge status={product.status || (isCompliant ? 'Compliant' : 'Non-Compliant')} />
        </div>

        {/* Product image and title */}
        <div className="flex gap-3 items-start">
          <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }} 
              />
            ) : null}
            <div className="w-full h-full hidden items-center justify-center text-slate-400">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0d4734] transition-colors line-clamp-2">
              {product.name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Brand: <span className="font-semibold text-slate-700">{product.brand}</span></p>
            <p className="text-xs text-slate-500">Net Qty: <span className="font-mono font-semibold text-slate-700">{product.netQuantityValue || 'Declared'}</span></p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block">Maximum Retail Price</span>
            <span className="font-mono font-bold text-slate-800">{formatINR(product.mrpValue)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Compliance Score</span>
            <span className={`font-mono font-bold ${isCompliant ? 'text-emerald-700' : 'text-rose-600'}`}>
              {product.complianceScore || 0}%
            </span>
          </div>
        </div>

        {/* Violations notice */}
        {product.violations && product.violations.length > 0 && (
          <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-1.5 text-rose-800 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span className="truncate">{product.violations.length} legal infraction(s) detected</span>
          </div>
        )}
      </div>

      {/* Action triggers */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onViewDetails(product)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Audit Details</span>
        </button>
        {onInspect && (
          <button
            onClick={() => onInspect(product)}
            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-50 hover:bg-[#0d4734] text-[#0d4734] hover:text-white transition-colors cursor-pointer"
            title="Re-verify against PCR 2011"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const ProductTable = ({ products = [], onViewDetails, onInspect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3 px-4">Commodity / Brand</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Net Quantity</th>
            <th className="py-3 px-3">MRP (INR)</th>
            <th className="py-3 px-3">Score</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => {
            const isCompliant = (p.complianceScore || 0) >= 90 && (!p.violations || p.violations.length === 0);
            return (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">Brand: {p.brand}</div>
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">
                  {p.category}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                  {p.netQuantityValue || 'Declared'}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                  {formatINR(p.mrpValue)}
                </td>
                <td className="py-3 px-3">
                  <span className={`font-mono font-bold ${isCompliant ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {p.complianceScore || 0}%
                  </span>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={p.status || (isCompliant ? 'Compliant' : 'Non-Compliant')} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onViewDetails(p)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-[#0d4734] hover:text-white text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Review</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
