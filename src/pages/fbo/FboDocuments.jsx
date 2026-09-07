import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  FolderOpen, 
  Upload, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Filter, 
  Search, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';

export const FboDocuments = () => {
  const { 
    fboDocuments = [], 
    setFboDocuments, 
    fboProducts = [], 
    addToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // New Document State
  const [newDoc, setNewDoc] = useState({
    name: '',
    category: 'Corrected Labels',
    product: 'Apex Pure Honey with Natural Honeycomb',
    version: 'v1.0'
  });

  const categories = [
    'All',
    'Corrected Labels',
    'Certificates',
    'Supporting Documents',
    'Corrective Action Reports',
    'Other Compliance Evidence'
  ];

  const filteredDocs = fboDocuments.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        d.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'All' || d.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Submitted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Correction Required':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Rejected':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.name) return;

    const created = {
      id: `doc-${Date.now()}`,
      name: newDoc.name.endsWith('.pdf') ? newDoc.name : `${newDoc.name}.pdf`,
      category: newDoc.category,
      product: newDoc.product,
      version: newDoc.version,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '2.1 MB',
      status: 'Submitted',
      statusNote: 'Document submitted via FBO self-service repository. Queued for validation.'
    };

    setFboDocuments(prev => [created, ...prev]);
    setIsUploadModalOpen(false);
    addToast({
      type: 'success',
      title: 'Document Uploaded',
      description: `${created.name} added to Compliance Repository.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Compliance Document Repository
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store and submit statutory certificates, NABL test certificates, corrected artwork proofs, and CAPA filings.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search documents by title, product or version..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-semibold shrink-0">Category:</span>
          {categories.map(cat => (
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

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3.5">Document Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Associated Product</th>
                <th className="px-6 py-3.5">Upload Date</th>
                <th className="px-6 py-3.5">Review Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0d4734] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{doc.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{doc.version} • {doc.fileSize}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">
                    {doc.product}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                    {doc.uploadDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0d4734] text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedDoc.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedDoc.version}</span>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-800">{selectedDoc.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border inline-block mt-0.5 ${getStatusBadge(selectedDoc.status)}`}>
                    {selectedDoc.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Status Note</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedDoc.statusNote}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Downloading File',
                    description: `Initiating download of ${selectedDoc.name}...`
                  });
                }}
                className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Upload Compliance Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex_Honey_NABL_Purity_Certificate_2026.pdf"
                  value={newDoc.name}
                  onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Corrected Labels</option>
                    <option>Certificates</option>
                    <option>Supporting Documents</option>
                    <option>Corrective Action Reports</option>
                    <option>Other Compliance Evidence</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Version Number</label>
                  <input
                    type="text"
                    placeholder="v1.0"
                    value={newDoc.version}
                    onChange={e => setNewDoc({ ...newDoc, version: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Associated Product SKU</label>
                <select
                  value={newDoc.product}
                  onChange={e => setNewDoc({ ...newDoc, product: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>Company-wide (All Products)</option>
                  {fboProducts.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
                <Upload className="w-8 h-8 text-[#0d4734] mx-auto mb-2" />
                <p className="font-bold text-slate-900">Drag and drop file here or click to browse</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, JPG, PNG (Max 25MB)</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
