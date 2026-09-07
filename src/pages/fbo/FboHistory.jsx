import React, { useState, useEffect } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  Search,
  ExternalLink,
  ChevronRight,
  Package,
  Download,
  FileSpreadsheet,
  RefreshCw,
  X
} from 'lucide-react';
import { 
  INITIAL_FBO_AUDIT_HISTORY, 
  exportFboPreAuditPDF, 
  exportFboPreAuditCSV 
} from '../../utils/fboOcrEngine.js';

export const FboHistory = () => {
  const { navigate, addToast } = useApp();

  const [auditHistory, setAuditHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('fbo_audit_history_v2');
      return saved ? JSON.parse(saved) : INITIAL_FBO_AUDIT_HISTORY;
    } catch {
      return INITIAL_FBO_AUDIT_HISTORY;
    }
  });

  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAuditModal, setSelectedAuditModal] = useState(null);

  const filteredHistory = auditHistory.filter(item => {
    const matchesSearch = (item.productName || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                          (item.batchNumber || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                          (item.id || '').toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'ready' && item.status === 'Ready for Market') ||
                          (statusFilter === 'revision' && item.status === 'Requires Revision');
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDownloadPDF = (record) => {
    const ok = exportFboPreAuditPDF(record);
    if (ok) {
      addToast({
        type: 'success',
        title: 'PDF Audit Report Exported',
        description: `Exported official compliance record for ${record.productName}.`
      });
    }
  };

  const handleDownloadCSV = (record) => {
    const ok = exportFboPreAuditCSV(record);
    if (ok) {
      addToast({
        type: 'success',
        title: 'CSV Data Exported',
        description: `Exported spreadsheet for ${record.productName}.`
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-[#5338E8] font-mono font-bold text-[11px] uppercase tracking-wider border border-indigo-200/70">
              AUDIT ARCHIVES
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">PCR-2011 Verification History</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Packaging Compliance & Pre-Release History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View full historical audit sheets, rule violation citations, and download statutory PDF evidence dossiers.
          </p>
        </div>

        <button
          onClick={() => navigate('fbo-dashboard')}
          className="px-4 py-2.5 bg-[#5338E8] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>New Label Screening</span>
        </button>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search by Product Name, Batch ID, or Audit ID..."
              className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5338E8] focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5338E8] focus:outline-hidden text-slate-900"
            >
              <option value="all">All Product Categories</option>
              <option value="Beverage">Beverage</option>
              <option value="Packaged Food">Packaged Food</option>
              <option value="Confectionery">Confectionery</option>
              <option value="Dairy Product">Dairy Product</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5338E8] focus:outline-hidden text-slate-900"
            >
              <option value="all">All Audit Statuses</option>
              <option value="ready">Approved / Market Ready</option>
              <option value="revision">Revision Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Label Preview</th>
                <th className="py-3.5 px-4">Product Name & Batch</th>
                <th className="py-3.5 px-4">Scan Date & Ref</th>
                <th className="py-3.5 px-4">Rules Triggered</th>
                <th className="py-3.5 px-4">Compliance Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No compliance audit records found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isReady = item.status === 'Ready for Market';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <img 
                          src={item.labelImageUrl} 
                          alt={item.productName} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                        />
                      </td>

                      {/* Product Info */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs">{item.productName}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Batch: {item.batchNumber} • {item.netQuantity || item.category}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-800 text-[11px]">{item.timestamp}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Ref: #{item.id}</div>
                      </td>

                      {/* Rules Triggered */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(item.rulesTriggered || ['Rule 6', 'Rule 9']).map((rule, ri) => (
                            <span 
                              key={ri}
                              className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-indigo-50 text-[#5338E8] border border-indigo-200"
                            >
                              {rule}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {isReady ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                            <span>{isReady ? 'Market Ready' : 'Revision Required'}</span>
                          </span>
                          <span className="font-mono font-bold text-slate-700 text-xs">
                            {item.complianceScore}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAuditModal(item)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => handleDownloadPDF(item)}
                            title="Download PDF Evidence Dossier"
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#5338E8] rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => navigate('fbo-dashboard')}
                            title="Re-Scan Updated Label"
                            className="px-2.5 py-1.5 bg-[#5338E8] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-Scan</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5338E8] bg-indigo-50 px-2 py-0.5 rounded font-mono">
                    AUDIT REF #{selectedAuditModal.id}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-mono">{selectedAuditModal.timestamp}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedAuditModal.productName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedAuditModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-5 bg-slate-900 rounded-2xl p-3 flex items-center justify-center">
                <img 
                  src={selectedAuditModal.labelImageUrl} 
                  alt={selectedAuditModal.productName} 
                  className="max-h-64 rounded-xl object-contain shadow-lg"
                />
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Number:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared Net Qty:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.netQuantity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared MRP:</span>
                    <span className="font-bold text-slate-900">{selectedAuditModal.mrp || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Score:</span>
                    <span className={`font-bold ${selectedAuditModal.complianceScore >= 90 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {selectedAuditModal.complianceScore}% ({selectedAuditModal.status})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Statutory Rule Infractions:
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(selectedAuditModal.violationsList || []).map((v, i) => (
                      <div key={i} className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-rose-900 font-mono">{v.ruleCited}</div>
                        <div className="text-slate-700">{v.observed}</div>
                        {v.penalty && <div className="text-[11px] text-rose-700 font-mono">⚖️ {v.penalty}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedAuditModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(selectedAuditModal)}
                  className="px-4 py-2 bg-[#5338E8] text-white rounded-xl text-xs font-bold hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Download PDF Audit Dossier</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
