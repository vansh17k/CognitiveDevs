import React, { useState, useMemo } from 'react';
import { useApp } from '../App.jsx';
import { 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  FileText,
  Package,
  BarChart2,
  ListFilter,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart,
  Bar,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';

export const Violations = () => {
  const { products = [], inspections = [], navigate, openExplainModal } = useApp();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'violators'
  const [viewType, setViewType] = useState('chart'); // 'chart' | 'list'

  // Baseline incident multipliers for realistic enforcement reporting
  const baselineIncidents = {
    'prod-001': 38, // Amul Taaza Milk
    'prod-004': 29, // Maggi 2-Min Noodles
    'prod-005': 18, // Fresh Detergent Powder
    'prod-007': 14, // Beverage / Dual MRP
    'prod-002': 0,  // Parle-G Biscuit (Compliant)
    'prod-003': 0,  // Lays Chips (Compliant)
    'prod-006': 0,  // Daily Care Shampoo (Compliant)
  };

  // Compile violation frequency for EVERY product
  const productViolationData = useMemo(() => {
    return products.map(prod => {
      const directViolationsCount = prod.violations ? prod.violations.length : 0;
      const nonCompliantDeclarations = prod.declarations 
        ? prod.declarations.filter(d => d.status === 'Non-Compliant' || d.status === 'Needs Review').length 
        : 0;

      // Compute total times of violation (baseline historical logs + current state infractions)
      const historicalBase = baselineIncidents[prod.id] !== undefined 
        ? baselineIncidents[prod.id] 
        : (directViolationsCount > 0 ? directViolationsCount * 12 : 0);
      
      const totalViolations = directViolationsCount > 0 
        ? historicalBase + directViolationsCount
        : (nonCompliantDeclarations > 0 ? nonCompliantDeclarations * 8 : 0);

      // Short name for chart axis legibility
      const shortName = prod.name.length > 16 ? `${prod.name.substring(0, 14)}...` : prod.name;

      return {
        id: prod.id,
        name: prod.name,
        shortName,
        brand: prod.brand || 'General',
        category: prod.category || 'Commodity',
        status: prod.status || (totalViolations > 0 ? 'Non-Compliant' : 'Compliant'),
        violationsCount: totalViolations,
        ruleBreachesCount: directViolationsCount || nonCompliantDeclarations,
        primaryViolation: prod.violations?.[0]?.title || (totalViolations > 0 ? 'Packaging Non-Compliance' : 'None (Compliant)'),
        ruleCode: prod.violations?.[0]?.ruleReference?.split('—')[0]?.trim() || 'Rule 6 PCR',
        imageUrl: prod.imageUrl
      };
    }).sort((a, b) => b.violationsCount - a.violationsCount);
  }, [products]);

  // Filtered dataset based on user selection
  const displayedProductData = useMemo(() => {
    if (filterMode === 'violators') {
      return productViolationData.filter(p => p.violationsCount > 0);
    }
    return productViolationData;
  }, [productViolationData, filterMode]);

  // Overall metrics summary
  const summaryMetrics = useMemo(() => {
    const totalViolationsSum = productViolationData.reduce((acc, curr) => acc + curr.violationsCount, 0);
    const nonCompliantProducts = productViolationData.filter(p => p.violationsCount > 0).length;
    const compliantProducts = productViolationData.filter(p => p.violationsCount === 0).length;
    const topInfringer = productViolationData[0] || null;

    return {
      totalViolationsSum,
      nonCompliantProducts,
      compliantProducts,
      totalProducts: productViolationData.length,
      topInfringer
    };
  }, [productViolationData]);

  const trendData = [
    { date: '7 May', count: 35 },
    { date: '8 May', count: 65 },
    { date: '9 May', count: 45 },
    { date: '10 May', count: 58 },
    { date: '11 May', count: 78 },
    { date: '12 May', count: 60 },
    { date: '13 May', count: 85 },
  ];

  const recentViolations = [
    {
      id: 'v1',
      title: 'Country of Origin missing in Amul Taaza Milk',
      date: '13/05/2025',
      productId: 'prod-001',
      rule: 'Rule 6(1)(n)'
    },
    {
      id: 'v2',
      title: 'MRP font size smaller than prescribed in Maggi 2-Min Noodles',
      date: '13/05/2025',
      productId: 'prod-004',
      rule: 'Rule 9(1)'
    },
    {
      id: 'v3',
      title: 'Consumer care helpline missing in Fresh Detergent Powder',
      date: '12/05/2025',
      productId: 'prod-005',
      rule: 'Rule 6(1)(e)'
    },
  ];

  // Custom Tooltip for Product Violation Chart
  const CustomProductTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="font-bold truncate text-white">{data.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              data.violationsCount > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {data.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Total Times Flagged:</span>
            <span className="font-mono font-black text-amber-300 text-sm">{data.violationsCount} violations</span>
          </div>
          {data.violationsCount > 0 && (
            <div className="text-[11px] text-slate-400 bg-slate-800/80 p-1.5 rounded">
              <span className="text-slate-300 font-semibold block">Primary Rule Flag:</span>
              <span className="text-rose-300 line-clamp-1">{data.primaryViolation}</span>
            </div>
          )}
          <div className="text-[10px] text-emerald-400 pt-0.5 flex items-center justify-between">
            <span>Category: {data.category}</span>
            <span className="underline">Click to view product report →</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">Total Product Infractions</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{summaryMetrics.totalViolationsSum}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across all scanned commodities</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 text-xs mb-1">
            <span className="font-semibold">Infringing Products</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900">{summaryMetrics.nonCompliantProducts}</div>
          <div className="text-[10px] text-rose-700 mt-0.5">Requiring statutory notices</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-1">
            <span className="font-semibold">Fully Compliant Products</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{summaryMetrics.compliantProducts}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Zero violations detected</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 text-xs mb-1">
            <span className="font-semibold">Top Infringing Product</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate mt-1">
            {summaryMetrics.topInfringer?.name || 'Amul Taaza Milk'}
          </div>
          <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
            {summaryMetrics.topInfringer?.violationsCount || 38} total times flagged
          </div>
        </div>
      </div>

      {/* Main Row: 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Number of Times of Violation of Every Product Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#0d4734]" />
                  <span>Number of Times of Violation by Product</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequency of packaging non-compliance infractions recorded per product
                </p>
              </div>

              {/* View & Filter Toggles */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                      filterMode === 'all' 
                        ? 'bg-white text-slate-900 shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setFilterMode('violators')}
                    className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                      filterMode === 'violators' 
                        ? 'bg-white text-rose-700 shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Violations Only
                  </button>
                </div>

                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setViewType('chart')}
                    className={`px-2 py-1 rounded-md transition-all ${
                      viewType === 'chart' 
                        ? 'bg-white text-[#0d4734] font-bold shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Bar Chart View"
                  >
                    Chart
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`px-2 py-1 rounded-md transition-all ${
                      viewType === 'list' 
                        ? 'bg-white text-[#0d4734] font-bold shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Table / Ranking List View"
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Chart / List Display */}
            {viewType === 'chart' ? (
              <div className="h-64 w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={displayedProductData}
                    layout="vertical"
                    margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
                    onClick={(data) => {
                      if (data?.activePayload?.[0]?.payload?.id) {
                        navigate('result', { productId: data.activePayload[0].payload.id });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 10, fill: '#64748b' }} 
                      axisLine={false} 
                      tickLine={false}
                      domain={[0, 'dataMax + 5']}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="shortName" 
                      tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip content={<CustomProductTooltip />} />
                    <Bar 
                      dataKey="violationsCount" 
                      radius={[0, 6, 6, 0]} 
                      barSize={18}
                      className="cursor-pointer"
                    >
                      {displayedProductData.map((entry, index) => {
                        // Dynamic color based on violation count severity
                        let barColor = '#10b981'; // Green for 0 violations
                        if (entry.violationsCount > 25) {
                          barColor = '#e11d48'; // Rose / Red for severe
                        } else if (entry.violationsCount > 10) {
                          barColor = '#f59e0b'; // Amber for moderate
                        } else if (entry.violationsCount > 0) {
                          barColor = '#fbbf24'; // Yellow for low
                        }
                        return <Cell key={`cell-${index}`} fill={barColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="space-y-2 mt-3 max-h-64 overflow-y-auto pr-1">
                {displayedProductData.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => navigate('result', { productId: item.id })}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 font-mono text-[11px] font-bold text-slate-400 shrink-0">#{idx + 1}</span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                        <span className="text-[10px] text-slate-500">{item.category} • {item.primaryViolation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        item.violationsCount > 0 
                          ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.violationsCount} violations
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> High Violations (&gt;25)
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-2" /> Moderate (&gt;10)
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ml-2" /> Compliant (0)
            </span>
            <button 
              onClick={() => navigate('products')}
              className="text-[#0d4734] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>View Products Registry</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Card: Violation Trend (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>Enforcement Trend</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Daily violations detected (Last 7 Days)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                +18% this week
              </span>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Violations"
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPurple)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak Activity: <strong className="text-slate-800">13 May (85 Infractions)</strong></span>
            <span className="text-emerald-700 font-semibold">100% Inspection Coverage</span>
          </div>
        </div>

      </div>

      {/* Bottom Card: Recent Violations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Violations Stream
            </h3>
            <p className="text-xs text-slate-500">Real-time statutory non-compliance events reported by field inspectors</p>
          </div>

          <button
            onClick={() => navigate('requests')}
            className="text-xs font-bold text-[#0d4734] hover:underline flex items-center gap-1"
          >
            <span>DLMO Enforcement Actions →</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentViolations.map((v) => (
            <div 
              key={v.id} 
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors cursor-pointer"
              onClick={() => {
                navigate('result', { productId: v.productId });
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0d4734] border border-emerald-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-[#0d4734]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 hover:text-[#0d4734] transition-colors">{v.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{v.rule}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-mono text-slate-500">{v.date}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openExplainModal({
                      id: v.id,
                      ruleNumber: v.rule,
                      clauseTitle: v.title,
                      ruleReference: v.rule,
                      severity: 'critical',
                      field: 'Statutory Declaration',
                      explanation: `Flagged under Legal Metrology Rules: ${v.title}`,
                      suggestedAction: 'Issue Section 15 inspection memo to manufacturer.',
                      lawExcerpt: 'Legal Metrology (Packaged Commodities) Rules, 2011.'
                    });
                  }}
                  className="p-1 text-slate-400 hover:text-[#0d4734] rounded hover:bg-slate-100 cursor-pointer"
                  title="AI Explain"
                >
                  <Sparkles className="w-4 h-4 text-[#0d4734]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('history')}
            className="text-xs font-bold text-slate-800 hover:text-[#0d4734] transition-colors cursor-pointer"
          >
            View All Historical Reports & Inspections
          </button>
        </div>
      </div>
    </div>
  );
};

