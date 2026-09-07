/**
 * ============================================================================
 * CHART COMPONENT - RECHARTS DATA VISUALIZATION
 * ============================================================================
 * 
 * Provides interactive charts for inspection trends, category compliance,
 * and rule violation frequencies using Recharts.
 */

import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const Chart = ({
  type = 'bar',
  data = [],
  dataKey = 'compliant',
  secondaryKey = 'nonCompliant',
  xKey = 'name',
  height = 260
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-xs text-slate-400 font-mono">
        No Data Points Available
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} 
            />
            <Line type="monotone" dataKey={dataKey} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Compliant" />
            {secondaryKey && (
              <Line type="monotone" dataKey={secondaryKey} stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Non-Compliant" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Default Bar Chart
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} 
          />
          <Bar dataKey={dataKey} fill="#0d4734" radius={[6, 6, 0, 0]} name="Compliant" />
          {secondaryKey && (
            <Bar dataKey={secondaryKey} fill="#ef4444" radius={[6, 6, 0, 0]} name="Non-Compliant" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
