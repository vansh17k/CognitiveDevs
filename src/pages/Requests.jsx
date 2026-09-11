import React, { useState, useMemo } from 'react';
import { useApp } from '../App.jsx';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Send,
  User,
  MapPin,
  Calendar,
  Eye,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Camera,
  RefreshCw,
  ExternalLink,
  Tag,
  CheckCircle
} from 'lucide-react';

export const Requests = () => {
  const { 
    currentUser, 
    requests = [], 
    submitRequest, 
    updateRequestStatusAndRemarks, 
    users = [],
    products = [],
    navigate,
    addToast
  } = useApp();

  const isDGM = currentUser?.role === 'dgm';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [inspectorFilter, setInspectorFilter] = useState('all');

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New Request Form State (Inspector)
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Rule 6 Declaration Infraction');
  const [newPriority, setNewPriority] = useState('High');
  const [newLocation, setNewLocation] = useState(currentUser?.division || 'Indore Central Market');
  const [newProductName, setNewProductName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  // DGM Review Action State
  const [dgmRemarksInput, setDgmRemarksInput] = useState('');
  const [dgmStatusInput, setDgmStatusInput] = useState('Under Review');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Filtered requests based on Role-Based Access & Search
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      // 1. Role-based isolation: Inspector sees only their own requests; DGM sees all.
      if (!isDGM && r.inspectorId !== currentUser?.id && r.inspectorEmail !== currentUser?.email) {
        return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all' && r.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // 3. Priority filter
      if (priorityFilter !== 'all' && r.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      // 4. Category filter
      if (categoryFilter !== 'all' && r.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // 5. Inspector filter (DGM only)
      if (isDGM && inspectorFilter !== 'all' && r.inspectorId !== inspectorFilter && r.inspectorName !== inspectorFilter) {
        return false;
      }

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q) ||
          r.inspectorName?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q) ||
          r.productName?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [requests, isDGM, currentUser, statusFilter, priorityFilter, categoryFilter, inspectorFilter, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const targetPool = isDGM 
      ? requests 
      : requests.filter(r => r.inspectorId === currentUser?.id || r.inspectorEmail === currentUser?.email);

    return {
      total: targetPool.length,
      pending: targetPool.filter(r => r.status === 'Pending Review' || r.status === 'Submitted').length,
      underReview: targetPool.filter(r => r.status === 'Under Review').length,
      approved: targetPool.filter(r => r.status === 'Approved').length,
      rejected: targetPool.filter(r => r.status === 'Rejected').length,
      resolved: targetPool.filter(r => r.status === 'Resolved').length,
    };
  }, [requests, isDGM, currentUser]);

  // Newly submitted requests requiring urgent DGM attention
  const newPendingRequests = useMemo(() => {
    return requests.filter(r => r.status === 'Pending Review' || r.status === 'Submitted');
  }, [requests]);

  const handleOpenDetailModal = (req) => {
    setSelectedRequest(req);
    setDgmRemarksInput(req.dgmRemarks || '');
    setDgmStatusInput(req.status === 'Submitted' || req.status === 'Pending Review' ? 'Under Review' : req.status);
    setIsDetailModalOpen(true);
  };

  const handleInspectorSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Fields',
        description: 'Please provide both a Title and detailed Description for this complaint/request.'
      });
      return;
    }

    submitRequest({
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      priority: newPriority,
      location: newLocation || currentUser?.division || 'Field Site',
      inspectorId: currentUser?.id || 'usr-001',
      inspectorName: currentUser?.name || 'Inspector Rajesh Sharma',
      inspectorEmail: currentUser?.email || 'inspector@lmcc.demo',
      inspectorDivision: currentUser?.division || 'Indore Central Division',
      productId: selectedProductId || null,
      productName: newProductName || 'Packaged Commodity Sample',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80'
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewProductName('');
    setNewImageUrl('');
    setSelectedProductId('');
    setIsSubmitModalOpen(false);
  };

  const handleDgmSaveAction = async (newStatusOverride) => {
    if (!selectedRequest) return;
    setIsSubmittingAction(true);

    const finalStatus = newStatusOverride || dgmStatusInput;
    await updateRequestStatusAndRemarks(selectedRequest.id, finalStatus, dgmRemarksInput.trim());

    setIsSubmittingAction(false);
    setIsDetailModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Under Review
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0d4734] to-[#145741] text-white p-6 rounded-2xl shadow-sm border border-emerald-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-200 rounded border border-emerald-400/30">
              {isDGM ? 'Central Authority Portal' : 'Field Officer Desk'}
            </span>
            <span className="text-xs text-emerald-200">• Legal Metrology PCR-2011 Workflow</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-emerald-300" />
            <span>{isDGM ? 'DLMO(District Legal Metrology Officer) — Inspector Requests Portal' : 'Inspector Complaint & Action Requests'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
            {isDGM 
              ? 'Centralized control room receiving all enforcement requests, seizure notices, and infraction filings submitted by Field Inspectors.'
              : 'Submit field violation reports, request seizure summons, and track real-time decisions from the DLMO(District Legal Metrology Officer).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isDGM ? (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Request</span>
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs">
              <span className="text-emerald-200 block text-[10px] uppercase font-bold">Central Routing</span>
              <span className="font-semibold text-white">All Inspector Submissions Active</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'all' 
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Requests</span>
            <FileText className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{isDGM ? 'Statewide pool' : 'Your submissions'}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Pending Review')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Pending Review' 
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900">{stats.pending}</div>
          <div className="text-[10px] text-amber-700 mt-0.5">Awaiting DLMO triage</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Under Review')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Under Review' 
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-semibold">Under Review</span>
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">{stats.underReview}</div>
          <div className="text-[10px] text-blue-700 mt-0.5">Technical & Legal check</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Approved' 
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-semibold">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{stats.approved}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Notice issued</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Rejected')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Rejected' 
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-semibold">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900">{stats.rejected}</div>
          <div className="text-[10px] text-rose-700 mt-0.5">Declined with note</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Resolved')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Resolved' 
              ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-xs font-semibold">Resolved</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">{stats.resolved}</div>
          <div className="text-[10px] text-purple-700 mt-0.5">Compounded / Closed</div>
        </div>
      </div>

      {/* 3. DGM ONLY: Prominent "New Incoming Requests" Section */}
      {isDGM && newPendingRequests.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h3 className="text-sm font-bold text-amber-950">
                New Requests Awaiting DLMO Action ({newPendingRequests.length})
              </h3>
            </div>
            <span className="text-xs text-amber-800 font-medium">Automatic Central Routing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {newPendingRequests.map((req) => (
              <div 
                key={req.id}
                onClick={() => handleOpenDetailModal(req)}
                className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-slate-700">{req.id}</span>
                    {getPriorityBadge(req.priority)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{req.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{req.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-emerald-800">{req.inspectorName}</span>
                  <span className="text-amber-800 font-medium flex items-center gap-1 hover:underline">
                    Review & Decide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request ID, title, inspector, location..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Inspector Filter (DGM Only) */}
          {isDGM ? (
            <div>
              <select
                value={inspectorFilter}
                onChange={(e) => setInspectorFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="all">All Field Inspectors</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="Rule 6 Declaration Infraction">Rule 6 Infraction</option>
                <option value="Font Size / Numeral Height (Rule 7)">Font Size (Rule 7)</option>
                <option value="Consumer Care Violation">Consumer Care</option>
                <option value="Overcharging / Dual MRP Violation">Dual MRP</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 5. Central Requests Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isDGM ? 'Central Inspector Requests Repository' : 'My Filed Action Requests'}
            </h2>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {filteredRequests.length} records
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Workflow: <span className="font-semibold text-slate-700">Inspector ➔ DLMO ➔ Action ➔ Inspector</span>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No complaints or requests found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isDGM 
                ? 'No requests match the selected filters.' 
                : 'You have not submitted any complaints yet. Click "Create New Request" to submit one for DLMO review.'}
            </p>
            {!isDGM && (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Request Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => handleOpenDetailModal(req)}
                className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img 
                      src={req.imageUrl} 
                      alt={req.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      {getStatusBadge(req.status)}
                      {getPriorityBadge(req.priority)}
                      <span className="text-[11px] text-slate-500 font-medium">
                        {req.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {req.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {req.description}
                    </p>

                    {/* DLMO Remarks Preview Banner */}
                    {req.dgmRemarks && (
                      <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-emerald-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold">DLMO Decision:</span>
                        <span className="truncate">{req.dgmRemarks}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Metadata & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-1 text-xs text-slate-500 shrink-0">
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{req.inspectorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{req.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{req.date}</span>
                  </div>

                  <button className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#0d4734] mt-1 group-hover:underline">
                    <span>{isDGM ? 'Review Case' : 'View Status'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. CREATE REQUEST MODAL (Inspector Only) */}
      {/* ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0d4734] px-6 py-4.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                  <PlusCircle className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New Complaint / Action Request</h3>
                  <p className="text-xs text-emerald-200">Automatically routed to DLMO(District Legal Metrology Officer) Central Desk</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleInspectorSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900">
                <span className="font-bold block mb-0.5">Enforcement Protocol:</span>
                This complaint will be instantly stored in the central database and queued in the DLMO Portal for statutory compounding or seizure notice sign-off.
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Request / Complaint Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Seizure & Compounding Notice for Missing Country of Origin"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Detailed Infraction Description & Evidence *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the packaging violation, batch numbers, manufacturer details, Rule 6/7 clause violated, and recommended action..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Category */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Violation Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="Rule 6 Declaration Infraction">Rule 6 Declaration Infraction</option>
                    <option value="Font Size / Numeral Height (Rule 7)">Font Size / Numeral Height (Rule 7)</option>
                    <option value="MRP & Unit Sale Price (USP) Violation">MRP & Unit Sale Price (USP) Violation</option>
                    <option value="Consumer Care Violation">Consumer Care Violation</option>
                    <option value="Overcharging / Dual MRP Violation">Overcharging / Dual MRP Violation</option>
                    <option value="Suspected Counterfeit / Relabeling">Suspected Counterfeit / Relabeling</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['High', 'Medium', 'Low'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`py-2 text-center rounded-xl border font-bold transition-all ${
                          newPriority === p
                            ? p === 'High' 
                              ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/20'
                              : p === 'Medium'
                              ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-500/20'
                              : 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Location */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Inspection / Seizure Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g., Central Mart, Zone 4, Indore"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Product Sample Name
                  </label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g., Amul Taaza Toned Milk (500ml)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Photo Evidence URL / Presets */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Photo Evidence URL (or Select Sample)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL or choose from repository below"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Quick select from recent products */}
                <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                  <span className="text-[10px] font-semibold text-slate-500 shrink-0">Attach Sample:</span>
                  {products.slice(0, 4).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setNewProductName(p.name);
                        setNewImageUrl(p.imageUrl);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] rounded-lg border border-slate-200 truncate shrink-0"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-[#0d4734] hover:bg-[#083325] rounded-xl shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to DLMO Central Desk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. VIEW / REVIEW DETAIL MODAL (Inspector View & DGM Action Station) */}
      {/* ========================================================================= */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0d4734] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                  <FileText className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                      {selectedRequest.id}
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                    {getPriorityBadge(selectedRequest.priority)}
                  </div>
                  <h2 className="text-base font-bold text-white mt-1 leading-snug">
                    {selectedRequest.title}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Top metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Submitted By</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.inspectorName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Division</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.inspectorDivision || selectedRequest.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Date & Time</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.date}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Category</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.category}</span>
                </div>
              </div>

              {/* Photo & Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                  <img 
                    src={selectedRequest.imageUrl} 
                    alt={selectedRequest.title}
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-2 bg-white text-center border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-800">{selectedRequest.productName}</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                      Infraction Details & Officer Report
                    </h4>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed text-slate-800 text-xs">
                      {selectedRequest.description}
                    </div>
                  </div>

                  {/* Audit Timeline */}
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1.5">
                      Statutory Workflow Timeline
                    </h4>
                    <div className="space-y-2 border-l-2 border-emerald-800/30 pl-3.5 ml-1">
                      {selectedRequest.timeline?.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-2 h-2 rounded-full bg-emerald-800 absolute -left-[19px] top-1.5 ring-2 ring-white" />
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-[11px]">{step.status}</span>
                            <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">{step.by}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{step.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DLMO Action Box (Central Authority Controls) */}
              {isDGM ? (
                <div className="bg-emerald-50/70 border-2 border-emerald-600/40 rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-800" />
                      <span>DLMO(District Legal Metrology Officer) Decision Station</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                      Central Authority
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Official DLMO Remarks / Compounding Order / Seizure Summons:
                    </label>
                    <textarea
                      rows={3}
                      value={dgmRemarksInput}
                      onChange={(e) => setDgmRemarksInput(e.target.value)}
                      placeholder="Enter official DLMO decision, Section 36 penalty amount, compounded fee order, or instructions for the Field Inspector..."
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">Set Status:</span>
                      <select
                        value={dgmStatusInput}
                        onChange={(e) => setDgmStatusInput(e.target.value)}
                        className="p-2 bg-white border border-slate-300 rounded-xl font-semibold text-xs focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved (Issue Notice)</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Resolved">Resolved (Compounded)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSubmittingAction}
                        onClick={() => handleDgmSaveAction('Approved')}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Notice</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingAction}
                        onClick={() => handleDgmSaveAction('Rejected')}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1 shadow-2xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingAction}
                        onClick={() => handleDgmSaveAction('Resolved')}
                        className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center gap-1 shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Inspector View of DLMO Remarks */
                selectedRequest.dgmRemarks ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-1">
                    <div className="flex items-center justify-between text-emerald-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        DLMO(District Legal Metrology Officer) Action & Remarks
                      </span>
                      <span className="text-[10px] text-emerald-700 font-normal">{selectedRequest.dgmActionDate}</span>
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed pt-1">
                      {selectedRequest.dgmRemarks}
                    </p>
                    <div className="text-[10px] text-emerald-700 pt-1 font-semibold">
                      Officer: {selectedRequest.dgmOfficerName || 'Dr. Anita Verma (DLMO)'}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>This request is currently queued at the DLMO Central Desk. You will receive an immediate update once the DLMO reviews this file.</span>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Suraksha1 Enforcement ID: {selectedRequest.id}
              </span>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
