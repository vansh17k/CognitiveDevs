/**
 * ============================================================================
 * INSPECTION AUDIT LOGS / HISTORY (src/app/history/page.jsx)
 * ============================================================================
 * 
 * Master record of all field scans, compliance verifications, and notice issues.
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Eye, 
  Search, 
  Calendar, 
  Scale, 
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { SearchBar } from '../../components/SearchBar.jsx';
import { FilterBar } from '../../components/FilterBar.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';

export default function HistoryPage() {
  const { 
    inspections, 
    products, 
    setSelectedProduct, 
    setActiveInspection, 
    navigate, 
    deleteInspection,
    showToast 
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredInspections = inspections.filter((i) => {
    const matchesSearch = 
      (i.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.inspectorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || i.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    showToast('Inspection audit trail exported as CSV archive.');
  };

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Metrological Inspection Audit Trail
              </h2>
              <p className="text-xs text-slate-500">
                Official chronological log of packaged commodity verifications under Legal Metrology Act, 2009
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Records (CSV)</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Notice ID, commodity, inspector, or location..."
            />
            <FilterBar
              statuses={['All', 'Compliant', 'Non-Compliant']}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
            />
          </div>

          {/* Audit Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Notice Ref / Date</th>
                    <th className="py-3 px-3">Commodity & Location</th>
                    <th className="py-3 px-3">Inspecting Officer</th>
                    <th className="py-3 px-3">Compliance</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInspections.map((insp) => {
                    const matchedProd = products.find(p => p.id === insp.productId) || products[0];
                    return (
                      <tr key={insp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900">{insp.id}</div>
                          <div className="text-[11px] text-slate-500">{insp.inspectionDate}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{insp.productName}</div>
                          <div className="text-[11px] text-slate-500">{insp.location}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 font-medium">
                          {insp.inspectorName}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`font-mono font-bold ${insp.complianceScore >= 90 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {insp.complianceScore}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <StatusBadge status={insp.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              setSelectedProduct(matchedProd);
                              setActiveInspection(insp);
                              navigate('result');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0d4734] hover:text-white text-slate-700 transition-colors cursor-pointer"
                            title="Inspect result"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(matchedProd);
                              setActiveInspection(insp);
                              navigate('reports');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0d4734] hover:text-white text-slate-700 transition-colors cursor-pointer"
                            title="View Form-V notice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteInspection(insp.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
