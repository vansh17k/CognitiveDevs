import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  Check, 
  X, 
  Download, 
  FileSpreadsheet, 
  MessageSquarePlus,
  ArrowLeft,
  Printer,
  FileCheck
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_INSPECTIONS } from '../data.js';
import { 
  exportReportToPDF, 
  exportReportToExcel, 
  printReportDocument, 
  getProductReportItems 
} from '../utils/exportReport.js';

export const Report = () => {
  const { currentScan, navigate, updateProductRemarks, addToast } = useApp();
  const [remarks, setRemarks] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const product = currentScan?.product || INITIAL_PRODUCTS[0];
  const inspection = currentScan?.inspection || INITIAL_INSPECTIONS[0];

  const reportItems = getProductReportItems(product);

  const compliantCount = reportItems.filter(i => i.status === 'Compliant').length;
  const nonCompliantCount = reportItems.filter(i => i.status === 'Non-Compliant').length;

  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      const ok = exportReportToPDF(product, inspection, reportItems, remarks || product.inspectorRemarks);
      setIsExportingPDF(false);
      if (ok) {
        addToast({
          type: 'success',
          title: 'PDF Report Generated & Downloaded',
          description: `Official statutory report saved for ${product.name}.`
        });
      }
    }, 150);
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    setTimeout(() => {
      const ok = exportReportToExcel(product, inspection, reportItems, remarks || product.inspectorRemarks);
      setIsExportingExcel(false);
      if (ok) {
        addToast({
          type: 'success',
          title: 'Excel / CSV Spreadsheet Exported',
          description: `Compliance inspection dataset saved for ${product.name}.`
        });
      }
    }, 150);
  };

  const handlePrint = () => {
    printReportDocument(product, inspection, reportItems, remarks || product.inspectorRemarks);
  };

  const handleSaveRemarks = () => {
    updateProductRemarks(product.id, remarks);
    setShowRemarksModal(false);
    addToast({
      type: 'success',
      title: 'Officer Remarks Saved',
      description: 'Updated inspection record with officer notes.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => navigate('result')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0d4734] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Result</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-3.5 py-2 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>{isExportingExcel ? 'Exporting...' : 'Export (Excel)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Top Row: Product Details & Compliance Summary (2 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Product Details (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Product Details
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Product Name:</span>
              <span className="font-bold text-slate-900">{product.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Brand:</span>
              <span className="font-medium text-slate-800">{product.brand}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Net Quantity:</span>
              <span className="font-medium text-slate-800">{product.netQuantityDeclared || '500 ml'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">MRP:</span>
              <span className="font-medium text-slate-800">{product.mrpDeclared || '₹30.00'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Manufacture Date:</span>
              <span className="font-medium text-slate-800">{product.mfgDate || '05/2025'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Scan Date:</span>
              <span className="font-medium text-slate-800">{product.scanDate}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="font-semibold text-slate-500">Inspector:</span>
              <span className="font-medium text-slate-800">{inspection.inspectorName}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Compliance Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Compliance Summary
          </h3>

          <div className="my-auto py-4 text-center">
            <h2 className={`text-2xl font-black tracking-wider uppercase ${nonCompliantCount > 0 ? 'text-[#d93025]' : 'text-[#0b8a4f]'}`}>
              {nonCompliantCount > 0 ? 'NON-COMPLIANT' : 'COMPLIANT'}
            </h2>
          </div>

          <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Declarations Checked:</span>
              <span className="font-bold text-slate-900">{reportItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Compliant:</span>
              <span className="font-bold text-emerald-600">{compliantCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Non-Compliant:</span>
              <span className="font-bold text-red-600">{nonCompliantCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Card: Declaration-wise Status Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Declaration-wise Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3 w-16">Sr. No.</th>
                <th className="py-2.5 px-3">Declaration</th>
                <th className="py-2.5 px-3 w-36">Status</th>
                <th className="py-2.5 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportItems.map((row) => (
                <tr key={row.sr} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500">{row.sr}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{row.name}</td>
                  <td className="py-3 px-3">
                    {row.status === 'Compliant' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Compliant</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Non-Compliant</span>
                      </span>
                    )}
                  </td>
                  <td className={`py-3 px-3 ${row.remarks !== '-' ? 'text-red-600 font-medium' : 'text-slate-400'}`}>
                    {row.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowRemarksModal(true)}
            className="px-5 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Add Remarks</span>
          </button>

          {(remarks || product.inspectorRemarks) && (
            <p className="text-xs text-slate-600 italic truncate max-w-md">
              Officer Remark: "{remarks || product.inspectorRemarks}"
            </p>
          )}
        </div>
      </div>

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-slate-900">Add Officer Inspection Remarks</h4>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter statutory inspection notes, notice issued under Rule 6, or compliance remarks..."
              rows={4}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRemarksModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRemarks}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#083325] rounded-lg cursor-pointer"
              >
                Save Remarks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
