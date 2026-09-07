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
  AlertTriangle
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    navigate, 
    currentUser, 
    inspectorRequests = [], 
    requestStats = {}
  } = useApp();

  const isDgm = currentUser?.role === 'dgm';

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
    { name: 'Compliant', value: 876, color: '#10b981' },
    { name: 'Non-Compliant', value: 372, color: '#ef4444' },
  ];

  // Recent inspection items
  const recentInspections = [
    {
      id: 'insp-1',
      name: 'Parle-G Biscuit',
      date: '13 May 2025',
      status: 'Compliant',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&auto=format&fit=crop&q=60',
    },
    {
      id: 'insp-2',
      name: 'Amul Taaza Milk',
      date: '13 May 2025',
      status: 'Non-Compliant',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60',
    },
    {
      id: 'insp-3',
      name: 'Lays Classic',
      date: '12 May 2025',
      status: 'Compliant',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=150&auto=format&fit=crop&q=60',
    },
  ];

  // Top 3 requests for the dashboard spotlight
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
              Active Officer: <strong className="text-slate-900">{currentUser?.name}</strong> ({isDgm ? 'Deputy General Manager' : currentUser?.division})
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            {isDgm ? 'Deputy General Manager (DGM) Central Command' : 'Inspector Field Compliance Desk'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isDgm 
              ? 'Central authority for inspecting packaged commodities, compounding offences, and reviewing field inspector complaints.' 
              : 'Field-level packaging scanner, statutory declaration inspector, and direct DGM request escalation desk.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('requests')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0d4734] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isDgm ? `Review Requests (${requestStats?.pending || 0} Pending)` : 'My Requests to DGM'}</span>
          </button>

          <button
            onClick={() => navigate('scan')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0d4734] hover:bg-[#093526] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
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
    </div>
  );
};
