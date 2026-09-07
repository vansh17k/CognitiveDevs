import React from 'react';
import { 
  Lightbulb, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const Analytics = () => {
  const categoryData = [
    { name: 'Food & Beverages', value: 38, color: '#8b5cf6' },
    { name: 'Personal Care', value: 24, color: '#10b981' },
    { name: 'Household', value: 18, color: '#f59e0b' },
    { name: 'Pharma', value: 12, color: '#f97316' },
    { name: 'Others', value: 8, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-600">Total Products Scanned</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">5,320</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-600">Compliance Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">68.4%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-600">Average Violations / Scan</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">1.42</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-600">Active Inspectors</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">24</p>
        </div>
      </div>

      {/* Middle Row: Compliance by Category (Donut) & Compliance by Region (Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Compliance by Category (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Compliance by Category
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-2">
            {/* Donut Chart */}
            <div className="sm:col-span-7 h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cat-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with Percentages */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Compliance by Region (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Compliance by Region
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-2">
            {/* India Map Representation Graphic */}
            <div className="sm:col-span-7 flex items-center justify-center p-2">
              <div className="w-full max-w-[200px] h-48 relative flex items-center justify-center">
                <svg viewBox="0 0 300 340" className="w-full h-full drop-shadow-xs">
                  {/* Northern Region (High - Green) */}
                  <path d="M 120 20 L 170 30 L 190 70 L 150 100 L 100 80 Z" fill="#10b981" opacity="0.9" stroke="#fff" strokeWidth="2" />
                  {/* Western Region - Gujarat/Rajasthan (Medium - Yellow) */}
                  <path d="M 60 90 L 120 90 L 130 150 L 70 170 L 40 130 Z" fill="#eab308" opacity="0.9" stroke="#fff" strokeWidth="2" />
                  {/* Central Region - MP/Indore (High - Green) */}
                  <path d="M 120 100 L 180 110 L 190 170 L 130 170 Z" fill="#10b981" opacity="0.95" stroke="#fff" strokeWidth="2" />
                  {/* Eastern Region (Low - Orange) */}
                  <path d="M 190 110 L 260 120 L 270 180 L 200 180 Z" fill="#f97316" opacity="0.9" stroke="#fff" strokeWidth="2" />
                  {/* Southern Region (High - Green) */}
                  <path d="M 90 180 L 190 180 L 160 300 L 130 320 L 110 250 Z" fill="#10b981" opacity="0.9" stroke="#fff" strokeWidth="2" />
                  
                  {/* Region Marker Labels */}
                  <circle cx="150" cy="140" r="4" fill="#0d4734" />
                  <text x="156" y="144" fontSize="9" fontWeight="bold" fill="#0d4734">Indore</text>
                  <circle cx="140" cy="60" r="3" fill="#0d4734" />
                  <text x="146" y="64" fontSize="8" fill="#0f172a">Delhi</text>
                </svg>
              </div>
            </div>

            {/* Region Legend */}
            <div className="sm:col-span-5 space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#10b981] shrink-0" />
                <span className="text-slate-700 font-medium">High (&gt; 75%)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#eab308] shrink-0" />
                <span className="text-slate-700 font-medium">Medium (50% - 75%)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#f97316] shrink-0" />
                <span className="text-slate-700 font-medium">Low (&lt; 50%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Card: Insights */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insight 1: Bulb */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
              Food & Beverages category has the highest non-compliance rate.
            </p>
          </div>

          {/* Insight 2: Alert */}
          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/60 flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
              Font size issues are most common across all categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
