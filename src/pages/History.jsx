import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  Search, 
  ChevronDown, 
  Calendar, 
  SlidersHorizontal, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data.js';

export const History = () => {
  const { navigate, products, deleteProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);

  const displayProducts = products.length > 0 ? products : INITIAL_PRODUCTS;

  const filteredProducts = displayProducts.filter((p) => {
    const s = (searchTerm || '').toLowerCase();
    const matchSearch = (p.name || '').toLowerCase().includes(s) || 
                        (p.brand || '').toLowerCase().includes(s);
    const isCompliant = (p.complianceScore || 0) >= 90 && (p.violations || []).length === 0;
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'compliant' && isCompliant) ||
      (statusFilter === 'non-compliant' && !isCompliant);
    return matchSearch && matchStatus;
  });

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Input (5 cols) */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Product, Brand, or Batch No."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
            />
          </div>

          {/* Status Dropdown (3 cols) */}
          <div className="sm:col-span-3 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="non-compliant">Non-Compliant</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Range Picker (2 cols) */}
          <div className="sm:col-span-2 relative">
            <button className="w-full flex items-center justify-between text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <span>Date Range</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Filters Button (2 cols) */}
          <div className="sm:col-span-2">
            <button className="w-full flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>Filters</span>
            </button>
          </div>

        </div>
      </div>

      {/* Product Repository Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-24">Product Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Scan Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isCompliant = product.complianceScore >= 90 && product.violations.length === 0;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{product.name}</td>
                    <td className="py-3 px-4 text-slate-600">{product.brand}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{product.scanDate}</td>
                    <td className="py-3 px-4">
                      {isCompliant ? (
                        <span className="px-3 py-1 rounded-md bg-[#e6f7ef] text-[#0b8a4f] text-xs font-semibold inline-flex items-center gap-1">
                          Compliant
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-md bg-[#fdeeed] text-[#d93025] text-xs font-semibold inline-flex items-center gap-1">
                          Non-Compliant
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            navigate('result', { productId: product.id });
                          }}
                          title="View Analysis"
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigate('reports', { productId: product.id });
                          }}
                          title="Download Report"
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                          }}
                          title="Delete Report"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No inspection records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Delete Inspection Record?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">{productToDelete.name}</div>
                <div className="text-slate-500 flex justify-between font-mono text-[11px]">
                  <span>Brand: {productToDelete.brand}</span>
                  <span>Scan: {productToDelete.scanDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination matching Image 8 */}
        <div className="py-4 px-6 border-t border-slate-100 flex items-center justify-center gap-1 text-xs select-none">
          <button 
            disabled={currentPageNum === 1}
            onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPageNum(num)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                currentPageNum === num
                  ? 'bg-[#0d4734] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {num}
            </button>
          ))}

          <span className="px-2 text-slate-400">...</span>

          <button
            onClick={() => setCurrentPageNum(25)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold cursor-pointer ${
              currentPageNum === 25 ? 'bg-[#0d4734] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            25
          </button>

          <button 
            onClick={() => setCurrentPageNum(p => Math.min(25, p + 1))}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
