/**
 * ============================================================================
 * COMPLIANCE ANALYTICS PAGE (src/app/analytics/page.jsx)
 * ============================================================================
 * 
 * Deep statistical breakdown of Legal Metrology enforcement metrics:
 * - Category compliance distributions (Dairy, Confectionery, Beverages, Personal Care)
 * - Monthly inspection rate line charts
 * - Regional enforcement velocity
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Scale, 
  BarChart3, 
  PieChart, 
  Calendar,
  Building2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { StatCard } from '../../components/StatCard.jsx';
import { Chart } from '../../components/Chart.jsx';
import { DASHBOARD_STATS } from '../../data/dashboard.js';
import { formatINR } from '../../utils/helpers.js';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Metrological Enforcement Analytics & Trends
              </h2>
              <p className="text-xs text-slate-500">
                Macro-level statistical tracking of packaging compliance across FMCG industry verticals
              </p>
            </div>
          </div>

          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Audit Coverage"
              value="1,248"
              subtitle="Registered FMCG SKUs"
              icon={Scale}
              color="blue"
            />
            <StatCard
              title="Pass Rate"
              value="79.0%"
              subtitle="State Average Compliance"
              icon={ShieldCheck}
              color="green"
            />
            <StatCard
              title="Critical Notices"
              value="262"
              subtitle="Form-V Compounding Issued"
              icon={AlertTriangle}
              color="red"
            />
            <StatCard
              title="Realized Penalties"
              value={formatINR(DASHBOARD_STATS.finesRealizedInr)}
              subtitle="Under Section 36 & 48"
              icon={Building2}
              color="amber"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Category Performance Bar Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Compliance Distribution by Category (%)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Rule 6 Pass Rate</span>
              </div>
              <Chart
                type="bar"
                data={DASHBOARD_STATS.categoryCompliance}
                dataKey="complianceRate"
                xKey="category"
                height={260}
              />
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Monthly Verification Velocity (2026)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Compliant vs Non-Compliant</span>
              </div>
              <Chart
                type="line"
                data={DASHBOARD_STATS.monthlyTrend}
                dataKey="compliant"
                secondaryKey="nonCompliant"
                xKey="month"
                height={260}
              />
            </div>

          </div>

          {/* Category breakdown table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Industry Sector Metrological Audit Summary
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Commodity Vertical</th>
                    <th className="py-3 px-3">Inspected Units</th>
                    <th className="py-3 px-3">Passed</th>
                    <th className="py-3 px-3">Infractions</th>
                    <th className="py-3 px-4">Compliance Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DASHBOARD_STATS.categoryCompliance.map((c) => (
                    <tr key={c.category} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.category}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-700">{c.totalAudited}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-bold">{c.passed}</td>
                      <td className="py-3.5 px-3 font-mono text-rose-600 font-bold">{c.failed}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.complianceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
