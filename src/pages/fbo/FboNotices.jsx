import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Upload, 
  Eye, 
  Lock, 
  ExternalLink,
  Info,
  X
} from 'lucide-react';

export const FboNotices = () => {
  const { 
    fboNotices = [], 
    navigate, 
    addToast 
  } = useApp();

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseFile, setResponseFile] = useState(null);

  const handleOpenResponse = (notice) => {
    setSelectedNotice(notice);
    setShowResponseModal(true);
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!responseText) return;

    addToast({
      type: 'success',
      title: 'Formal Response Submitted',
      description: `Response to Notice #${selectedNotice.noticeNumber} has been transmitted to ${selectedNotice.issuedBy}. Status: Awaiting Officer Review.`
    });

    setShowResponseModal(false);
    navigate('fbo-corrective-action');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Official Enforcement Notices
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statutory non-conformance notices, inspection findings, and improvement directions issued by Food Safety Officers & Metrology Authorities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>1 Response Pending</span>
          </span>
        </div>
      </div>

      {/* Official Enforcement Notice Integrity Banner */}
      <div className="p-4 bg-[#083325] text-emerald-100 rounded-2xl text-xs flex items-start gap-3 shadow-2xs border border-emerald-900/50">
        <Lock className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-white">
            Immutable Regulatory Record:
          </p>
          <p className="text-emerald-100/90 leading-relaxed">
            Statutory notices are digitally sealed by designated Food Safety Officers & DGM authorities. Food Business Operators cannot modify inspector findings or close violations unilaterally without officer re-assessment.
          </p>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {fboNotices.map((notice) => {
          const isPending = notice.status === 'Response Pending';
          return (
            <div 
              key={notice.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs transition-all space-y-4 ${
                isPending 
                  ? 'border-amber-300 bg-gradient-to-r from-white via-white to-amber-50/20' 
                  : 'border-slate-200'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {notice.noticeNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        isPending 
                          ? 'bg-rose-100 text-rose-800 border-rose-200' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {notice.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-1">
                      {notice.productName}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Response Deadline</span>
                  <span className={`font-bold ${isPending ? 'text-rose-600 font-mono text-sm' : 'text-slate-700'}`}>
                    {notice.deadline}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issued By</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{notice.issuedBy}</span>
                  <span className="text-[10px] text-slate-500">{notice.division}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl md:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statutory Non-Conformance</span>
                  <p className="text-slate-700 font-medium mt-0.5 leading-relaxed">{notice.issue}</p>
                </div>
              </div>

              {/* Required Action Box */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#0d4734] flex items-center gap-1.5 text-xs">
                  <Info className="w-3.5 h-3.5 text-[#0d4734]" />
                  <span>Mandatory Action Required from FBO:</span>
                </span>
                <p className="text-[#083325] font-medium leading-relaxed">
                  {notice.requiredAction}
                </p>
              </div>

              {/* Submitted Response If already closed */}
              {notice.submittedResponse && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FBO Response Verified & Closed:</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {notice.submittedResponse.responseStatement}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                    {notice.submittedResponse.officerRemarks}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Full Notice</span>
                </button>

                {isPending && (
                  <button
                    onClick={() => handleOpenResponse(notice)}
                    className="px-5 py-2 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Submit Response & Evidence</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Notice View Modal */}
      {selectedNotice && !showResponseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedNotice.noticeNumber}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  Notice of Direction under Section 38(1) FSS Act
                </h3>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Issuance</span>
                  <span className="font-bold text-slate-800">{selectedNotice.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Inspection Ref</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedNotice.inspectionReportRef}</span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-white">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Statement of Finding:</h4>
                <p className="text-xs text-slate-700">{selectedNotice.issue}</p>
              </div>

              <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl space-y-2">
                <h4 className="font-bold text-[#0d4734] text-xs uppercase tracking-wider">Required Corrective Action:</h4>
                <p className="text-xs text-emerald-950 font-medium">{selectedNotice.requiredAction}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
              >
                Close
              </button>
              {selectedNotice.status === 'Response Pending' && (
                <button
                  onClick={() => setShowResponseModal(true)}
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs"
                >
                  Respond to Notice
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Response Submission Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Submit Statutory Notice Response</h3>
                <p className="text-[11px] text-slate-500 font-mono">{selectedNotice?.noticeNumber}</p>
              </div>
              <button onClick={() => setShowResponseModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleResponseSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  FBO Explanatory Statement & Corrective Undertaking *
                </label>
                <textarea
                  required
                  rows={4}
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  placeholder="Detail the root cause, immediate correction made to artwork/labels, and preventive controls implemented on the packaging lines..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Revised Label Proof / NABL Lab Report / CAPA PDF
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center bg-emerald-50/40">
                  <Upload className="w-6 h-6 text-[#0d4734] mx-auto mb-1" />
                  <span className="text-slate-700 font-medium block">Apex_MustardOil_Revised_Artwork_Proof_v2.pdf</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, or PNG (Max 15MB)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs"
                >
                  Submit Formal Response
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
