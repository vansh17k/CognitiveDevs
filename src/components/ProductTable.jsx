/**
 * ============================================================================
 * PRODUCT TABLE COMPONENT
 * ============================================================================
 * 
 * Tabular layout for large datasets of pre-packaged commodities with sorting,
 * quick status flags, and review actions.
 */

import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { formatINR } from '../utils/helpers.js';

export const ProductTable = ({ products = [], onViewDetails, onInspect }) => {
  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-sm font-medium">No commodities found matching current filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3 px-4">Commodity / Brand</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Net Quantity</th>
            <th className="py-3 px-3">MRP (INR)</th>
            <th className="py-3 px-3">Compliance Score</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => {
            const isCompliant = (p.complianceScore || 0) >= 90 && (!p.violations || p.violations.length === 0);
            return (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">Brand: {p.brand}</div>
                </td>
                <td className="py-3.5 px-3 text-slate-600 font-medium">
                  {p.category}
                </td>
                <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                  {p.netQuantityValue || 'Declared'}
                </td>
                <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                  {formatINR(p.mrpValue)}
                </td>
                <td className="py-3.5 px-3">
                  <span className={`font-mono font-bold ${isCompliant ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {p.complianceScore || 0}%
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <StatusBadge status={p.status || (isCompliant ? 'Compliant' : 'Non-Compliant')} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onViewDetails(p)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0d4734] hover:text-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
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
