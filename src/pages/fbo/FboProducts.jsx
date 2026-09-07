import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Package, 
  Sparkles, 
  Upload, 
  Eye, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileCheck,
  ShieldCheck,
  X
} from 'lucide-react';

export const FboProducts = () => {
  const { 
    fboProducts = [], 
    setFboProducts,
    startFboAiCheck, 
    navigate,
    addToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadLabelModalOpen, setIsUploadLabelModalOpen] = useState(false);
  const [targetProductForLabel, setTargetProductForLabel] = useState(null);

  // New Product State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Savory Snacks & Ready-to-Eat',
    fssaiCategory: 'Category 15.1 - Snacks & Savoury Foods',
    productId: '',
    netQuantity: '',
    mrp: '',
    labelUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80'
  });

  const filteredProducts = fboProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.productId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'All' || p.category.includes(categoryFilter);
    return matchSearch && matchCategory;
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.productId) return;

    const created = {
      id: `fbo-prod-${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      fssaiCategory: newProd.fssaiCategory,
      productId: newProd.productId,
      netQuantity: newProd.netQuantity || '250 g',
      mrp: newProd.mrp || '₹ 120.00',
      currentLabel: newProd.labelUrl,
      complianceStatus: 'Needs AI Check',
      complianceScore: 75,
      lastAiCheck: 'Pending initial scan',
      openIssuesCount: 0,
      issues: [],
      goodPoints: ['Product metadata registered under FBO portfolio.']
    };

    setFboProducts(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    addToast({
      type: 'success',
      title: 'Product Registered',
      description: `${created.name} (${created.productId}) added to FBO catalog.`
    });
  };

  const handleUploadNewLabelSubmit = (e) => {
    e.preventDefault();
    if (!targetProductForLabel) return;

    setFboProducts(prev => prev.map(p => {
      if (p.id === targetProductForLabel.id) {
        return {
          ...p,
          lastAiCheck: 'Just now',
          complianceStatus: 'Under Review'
        };
      }
      return p;
    }));

    setIsUploadLabelModalOpen(false);
    addToast({
      type: 'info',
      title: 'New Label Uploaded',
      description: `New artwork version uploaded for ${targetProductForLabel.name}. Starting AI Pre-Compliance check...`
    });

    startFboAiCheck(targetProductForLabel);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Food Products & Labels
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your registered food commodities, packaging artwork versions, and label compliance records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-semibold shrink-0">Category:</span>
          {['All', 'Honey', 'Snacks', 'Oils', 'Cereals'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-[#0d4734] text-white shadow-2xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((prod) => (
          <div 
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative group cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                    <img 
                      src={prod.currentLabel} 
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0 group-hover:opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prod.productId}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        prod.complianceScore >= 90
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : prod.complianceScore >= 75
                          ? 'bg-emerald-50/70 text-[#0d4734] border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {prod.complianceStatus}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{prod.category}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-slate-900">{prod.complianceScore}/100</div>
                  <span className="text-[10px] text-slate-400 font-medium">Health Score</span>
                </div>
              </div>

              {/* Product Key Metadata */}
              <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Declared Net Qty</span>
                  <span className="font-bold text-slate-800">{prod.netQuantity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Max Retail Price (MRP)</span>
                  <span className="font-bold text-slate-800 truncate block">{prod.mrp}</span>
                </div>
              </div>

              {/* Issues/Status preview */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last AI Check: <strong>{prod.lastAiCheck}</strong></span>
                  <span>{prod.issues?.length || 0} Open Flags</span>
                </div>

                {prod.issues?.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs">
                    <p className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{prod.issues[0].title}</span>
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All mandatory FSSAI Rule 6 declarations verified.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProduct(prod)}
                className="py-2 px-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Product</span>
              </button>

              <button
                onClick={() => {
                  setTargetProductForLabel(prod);
                  setIsUploadLabelModalOpen(true);
                }}
                className="py-2 px-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload New Label</span>
              </button>

              <button
                onClick={() => startFboAiCheck(prod)}
                className="py-2 px-2.5 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Run AI Check</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.currentLabel}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedProduct.productId}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedProduct.name}</h3>
                  <p className="text-xs text-slate-500">{selectedProduct.fssaiCategory}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Status */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Compliance Score</span>
                <span className="text-lg font-bold text-[#0d4734]">{selectedProduct.complianceScore} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className="font-bold text-slate-800">{selectedProduct.complianceStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Last Inspection Check</span>
                <span className="font-bold text-slate-800">{selectedProduct.lastAiCheck}</span>
              </div>
            </div>

            {/* Issues Breakdown */}
            {selectedProduct.issues?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Open Advisory Flags ({selectedProduct.issues.length})
                </h4>
                {selectedProduct.issues.map((iss, i) => (
                  <div key={i} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">{iss.title}</span>
                      <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 font-bold rounded text-[10px] uppercase">
                        {iss.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{iss.description}</p>
                    <p className="text-[11px] text-amber-800 font-medium pt-1">
                      <strong>Recommended:</strong> {iss.recommendedCorrection}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Good points */}
            {selectedProduct.goodPoints?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verified Declarations (PCR Rule 6)
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {selectedProduct.goodPoints.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50/50 border border-emerald-200/60 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const prod = selectedProduct;
                  setSelectedProduct(null);
                  startFboAiCheck(prod);
                }}
                className="px-5 py-2 bg-[#0d4734] text-white text-xs font-semibold rounded-xl hover:bg-[#083325] shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Run AI Pre-Compliance Check</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Register Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Register Food Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Commercial Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Premium Roasted Makhana (100g)"
                  value={newProd.name}
                  onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product SKU / Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. APX-MKH-100G"
                    value={newProd.productId}
                    onChange={e => setNewProd({ ...newProd, productId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Declared Net Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 100 g"
                    value={newProd.netQuantity}
                    onChange={e => setNewProd({ ...newProd, netQuantity: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">FSSAI Category</label>
                <select
                  value={newProd.category}
                  onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>Savory Snacks & Ready-to-Eat</option>
                  <option>Honey & Natural Sweeteners</option>
                  <option>Edible Oils & Fats</option>
                  <option>Breakfast Cereals</option>
                  <option>Dairy & Fermented Milk Products</option>
                  <option>Spices & Condiments</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Packaging Label Image URL</label>
                <input
                  type="url"
                  value={newProd.labelUrl}
                  onChange={e => setNewProd({ ...newProd, labelUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload New Label Modal */}
      {isUploadLabelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Upload New Packaging Label</h3>
              <button onClick={() => setIsUploadLabelModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadNewLabelSubmit} className="mt-4 space-y-3">
              <p className="text-slate-600">
                Uploading new artwork version for: <strong>{targetProductForLabel?.name}</strong>
              </p>

              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-6 text-center">
                <Upload className="w-8 h-8 text-[#0d4734] mx-auto mb-2" />
                <p className="font-bold text-slate-900">Drag & drop high-resolution label proof</p>
                <p className="text-[11px] text-slate-500 mt-1">PDF, JPG, or PNG (Up to 25 MB)</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadLabelModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325]"
                >
                  Confirm & Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
