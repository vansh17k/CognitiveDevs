import React from 'react';
import { useApp } from '../App.jsx';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  ArrowRight,
  User,
  ShieldCheck,
  Send,
  AlertTriangle,
  Globe,
  Building2,
  ExternalLink,
  Database,
  Layers
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    navigate, 
    currentUser, 
    products = [],
    inspections = [],
    inspectorRequests = [], 
    requestStats = {},
    fboProducts = [],
    fboNotices = [],
    startNewScan,
    addToast
  } = useApp();

  const isDgm = currentUser?.role === 'dgm';

  // Scoped metrics based on logged-in role
  const totalInspections = products.length;
  const nonCompliantCount = products.filter(p => p.status === 'Non-Compliant' || (p.violations && p.violations.length > 0)).length;
  const compliantCount = products.filter(p => p.status === 'Compliant').length;
  const complianceRate = totalInspections > 0 ? Math.round((compliantCount / totalInspections) * 100) : 75;

  // 7-day trend data
  const trendData = [
    { date: '7 May', compliant: 180, nonCompliant: 70 },
    { date: '8 May', compliant: 230, nonCompliant: 110 },
    { date: '10 May', compliant: 210, nonCompliant: 80 },
    { date: '12 May', compliant: 245, nonCompliant: 160 },
    { date: '13 May', compliant: 220, nonCompliant: 90 },
  ];

  // Overall compliance pie data
  const pieData = [
    { name: 'Compliant', value: compliantCount || 876, color: '#10b981' },
    { name: 'Non-Compliant', value: nonCompliantCount || 372, color: '#ef4444' },
  ];

  // Dynamic recent inspections from scoped data
  const recentInspections = (inspections && inspections.length > 0)
    ? inspections.slice(0, 3).map(insp => ({
        id: insp.id,
        productId: insp.productId,
        name: insp.productName || insp.brand || 'Inspected Commodity',
        date: insp.date || insp.timestamp?.split(' ')[0] || '13 May 2025',
        status: insp.status || 'Compliant',
        image: insp.imageUrl || 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&auto=format&fit=crop&q=60',
      }))
    : [
        {
          id: 'insp-1',
          productId: 'prod-1',
          name: 'Parle-G Biscuit',
          date: '13 May 2025',
          status: 'Compliant',
          image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&auto=format&fit=crop&q=60',
        },
        {
          id: 'insp-2',
          productId: 'prod-2',
          name: 'Amul Taaza Milk',
          date: '13 May 2025',
          status: 'Non-Compliant',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60',
        },
      ];

  // Top requests for the dashboard spotlight
  const recentRequests = isDgm 
    ? inspectorRequests.slice(0, 3) 
    : inspectorRequests.filter(r => r.inspectorId === currentUser?.id || r.inspectorEmail === currentUser?.email).slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Role-Specific Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0d4734]/10 text-[#0d4734] px-2.5 py-0.5 rounded-md">
              {isDgm ? 'Central Authority Dashboard' : 'Field Enforcement Dashboard'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Active Officer: <strong className="text-slate-900">{currentUser?.name}</strong> ({isDgm ? 'DLMO(District Legal Metrology Officer)' : currentUser?.division})
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            {isDgm ? 'DLMO(District Legal Metrology Officer) Central Command' : 'Inspector Field Compliance Desk'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isDgm 
              ? 'Central authority for inspecting packaged commodities, compounding offences, and reviewing field inspector complaints.' 
              : 'Field-level packaging scanner, statutory declaration inspector, and direct DLMO request escalation desk.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('requests')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0d4734] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isDgm ? `Review Requests (${requestStats?.pending || 0} Pending)` : 'My Requests to DLMO'}</span>
          </button>

          <button
            onClick={() => navigate('scan')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#093526] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>

          <button
            onClick={() => navigate('ecommerce-scan')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0d4734] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Audit e-commerce digital product link (Rule 6(10))"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>E-Com Link Scan</span>
            <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-mono">6(10)</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">{isDgm ? 'Total Statewide Products' : 'My Inspected Products'}</span>
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalInspections}</div>
          <p className="text-[10px] text-slate-400 mt-1">
            {isDgm ? 'Central state repository access' : 'Only records inspected by you'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">{isDgm ? 'Statewide Violations' : 'My Flagged Violations'}</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{nonCompliantCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">
            {isDgm ? 'All zonal non-compliant items' : 'Violations detected on your desk'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Compliance Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{complianceRate}%</div>
          <p className="text-[10px] text-slate-400 mt-1">Rule 6 mandatory declarations</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">{isDgm ? 'Pending DLMO Decisions' : 'My Requests to DLMO'}</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {isDgm ? (requestStats?.pending || 0) : inspectorRequests.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {isDgm ? 'Seizure & compounding reviews' : 'Field escalation tracking'}
          </p>
        </div>
      </div>

      {/* Middle Row: Trend, Overall Donut, Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Compliance Trend Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Compliance Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">(Last 7 Days - Zonal Inspections)</p>
          </div>

          <div className="h-52 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorNonCompliant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 300]} ticks={[0, 100, 200, 300]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="compliant" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorCompliant)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="nonCompliant" 
                  stroke="#ef4444" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorNonCompliant)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-2 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]"></span>
              <span>Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#ef4444]"></span>
              <span>Non-Compliant</span>
            </div>
          </div>
        </div>

        {/* Overall Compliance Radial Donut (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h3 className="text-sm font-bold text-slate-900">Overall Compliance</h3>
          </div>

          {/* Donut with text inside */}
          <div className="relative w-44 h-44 my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">70.2%</span>
              <span className="text-[10px] text-slate-500 font-medium">Compliant</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-1 text-xs text-slate-600 pt-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]"></span>
              <span>Compliant (876)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#ef4444]"></span>
              <span>Non-Compliant (372)</span>
            </div>
          </div>
        </div>

        {/* Recent Inspections Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Inspections</h3>
          </div>

          <div className="divide-y divide-slate-100 my-2">
            {recentInspections.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  navigate('result', { productId: item.id === 'insp-2' ? 'prod-2' : 'prod-1' });
                }}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 rounded-lg px-1 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-11 h-11 object-cover rounded-lg border border-slate-200" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.date}</p>
                  </div>
                </div>

                <div>
                  {item.status === 'Compliant' ? (
                    <span className="px-2.5 py-1 rounded-md bg-[#e6f7ef] text-[#0b8a4f] text-[11px] font-semibold flex items-center gap-1">
                      ✓ Compliant
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-[#fdeeed] text-[#d93025] text-[11px] font-semibold flex items-center gap-1">
                      ● Non-Compliant
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={() => navigate('history')}
              className="text-xs font-bold text-slate-800 hover:text-[#0b4d3c] transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

      </div>

      {/* FBO SUBMISSIONS & PRE-MARKET AUDIT OVERSIGHT (Inspector & DGM Access) */}
      {(isDgm || currentUser?.role === 'inspector') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                  <Database className="w-3 h-3 text-emerald-600" />
                  Firebase Cloud DB • Inspector Oversight Active
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">•</span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Real-time synchronization of Food Business Operator (FBO) work
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0d4734]" />
                <span>FBO Self-Compliance & Pre-Market Artwork Submissions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspectors have statewide access to monitor and audit packaging labels registered by registered FBOs prior to retail dispatch.
              </p>
            </div>

            <button
              onClick={() => navigate('products')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full FBO Submissions Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Submissions List */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fboProducts.slice(0, 3).map((fboItem, idx) => {
              const score = fboItem.complianceScore || fboItem.score || 85;
              const isPassing = score >= 90;
              return (
                <div 
                  key={fboItem.id || `fbo-card-${idx}`}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-mono font-medium">
                        {fboItem.fboId || 'FBO-APEX-001'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPassing 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Score: {score}%
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {fboItem.name || fboItem.productName || 'Apex Commodity'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {fboItem.manufacturer || 'Apex Nutrition & Agro Foods Pvt. Ltd.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Net Quantity:</span>
                        <span className="font-mono font-medium text-slate-700">{fboItem.netQuantity || '500 g'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">MRP:</span>
                        <span className="font-mono font-medium text-slate-700">{fboItem.mrp || '₹ 150'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Batch: {fboItem.batchNumber || 'LOT-9821'}
                    </span>
                    <button
                      onClick={() => {
                        startNewScan(fboItem.imageUrl, fboItem.name || fboItem.productName);
                        navigate('scan');
                        if (addToast) {
                          addToast({
                            type: 'info',
                            title: 'Loaded FBO Submission',
                            description: `Initiated official statutory audit for ${fboItem.name || 'product'}.`
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0d4734] hover:text-[#083325] hover:underline cursor-pointer"
                    >
                      <span>Audit Artwork</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
