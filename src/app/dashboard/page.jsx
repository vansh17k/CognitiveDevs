/**
 * ============================================================================
 * OFFICER DASHBOARD PAGE (src/app/dashboard/page.jsx)
 * ============================================================================
 * 
 * Central overview of state-level packaging compliance:
 * - Summary metric cards (Total Scans, Compliance %, Active Notices, Penalties)
 * - Monthly audit trends chart
 * - Recent field infractions list with one-click report generator
 * - Quick packaging intake trigger
 */

import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  FileText, 
  TrendingUp, 
  Building2, 
  ArrowRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { StatCard } from '../../components/StatCard.jsx';
import { Chart } from '../../components/Chart.jsx';
import { DASHBOARD_STATS } from '../../data/dashboard.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { formatINR } from '../../utils/helpers.js';

export default function DashboardPage() {
  const { 
    products, 
    inspections, 
    navigate, 
    currentUser, 
    setSelectedProduct, 
    setActiveInspection 
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalScans = inspections.length;
  const compliantCount = inspections.filter(i => i.status === 'Compliant').length;
  const nonCompliantCount = totalScans - compliantCount;
  const complianceRate = totalScans > 0 ? Math.round((compliantCount / totalScans) * 100) : 100;

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#0d4734] to-[#083325] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-200 uppercase tracking-wider">
                  Enforcement Station: {currentUser?.division || 'Central Zone'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Welcome, {currentUser?.name || 'Officer'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
                Legal Metrology (Packaged Commodities) Rules, 2011 active monitoring portal. 
                Perform instant OCR checks on pre-packaged goods and issue Form-V compounding notices.
              </p>
            </div>

            <button
              onClick={() => navigate('scan')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#0d4734] hover:bg-emerald-50 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>Initiate New Package Scan</span>
            </button>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Commodities Scanned"
              value={totalScans}
              subtitle="Current Inspection Term"
              icon={Scale}
              color="green"
              trend="+14% this month"
              trendPositive={true}
            />
            <StatCard
              title="Rule 6 Compliance Rate"
              value={`${complianceRate}%`}
              subtitle={`${compliantCount} of ${totalScans} passed`}
              icon={CheckCircle2}
              color="blue"
              trend="+3.2% vs Q2"
              trendPositive={true}
            />
            <StatCard
              title="Active Form-V Notices"
              value={nonCompliantCount}
              subtitle="Under Section 36 review"
              icon={AlertTriangle}
              color="red"
              trend="Requires Action"
              trendPositive={false}
            />
            <StatCard
              title="Recovered Compounding Fines"
              value={formatINR(DASHBOARD_STATS.finesRealizedInr)}
              subtitle="State Treasury Realization"
              icon={Building2}
              color="amber"
              trend="Section 48"
              trendPositive={true}
            />
          </div>

          {/* Charts & Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Chart */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Commodity Inspection Audit Trend
                  </h3>
                  <p className="text-xs text-slate-500">Monthly breakdown of compliant vs non-compliant packages</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  2026 Fiscal
                </span>
              </div>
              <div className="mt-4">
                <Chart
                  type="bar"
                  data={DASHBOARD_STATS.monthlyTrend}
                  dataKey="compliant"
                  secondaryKey="nonCompliant"
                  xKey="month"
                  height={260}
                />
              </div>
            </div>

            {/* Top Infractions */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Most Frequent PCR 2011 Infractions
                </h3>
                <div className="mt-3 space-y-3">
                  {DASHBOARD_STATS.topViolatedRules.slice(0, 4).map((rule) => (
                    <div key={rule.rule} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-900">{rule.rule}</span>
                        <span className="text-rose-600 font-bold">{rule.percentage}%</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5 truncate">{rule.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('violations')}
                className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>View All Infraction Types</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Inspections Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Recent Field Inspections & Test Samples
                </h3>
                <p className="text-xs text-slate-500">Live feed from verified retail locations</p>
              </div>
              <button
                onClick={() => navigate('history')}
                className="text-xs font-bold text-[#0d4734] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Audit Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Inspection Reference</th>
                    <th className="py-3 px-3">Commodity</th>
                    <th className="py-3 px-3">Inspecting Officer</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inspections.slice(0, 5).map((insp) => {
                    const matchedProd = products.find(p => p.id === insp.productId) || products[0];
                    return (
                      <tr key={insp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {insp.id}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{insp.productName}</div>
                          <div className="text-[11px] text-slate-500">{insp.location}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700">
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
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedProduct(matchedProd);
                              setActiveInspection(insp);
                              navigate('result');
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#0d4734] hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            View Result
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
