/**
 * ============================================================================
 * LEGAL METROLOGY DASHBOARD ANALYTICS & STATISTICAL SEED DATA
 * ============================================================================
 * 
 * Aggregates state-level inspection metrics, violation distributions across
 * commodities, monthly trends, and division performance indicators.
 */

export const DASHBOARD_STATS = {
  totalScans: 1248,
  compliantScans: 986,
  nonCompliantScans: 262,
  overallComplianceRate: 79.0, // Percentage
  noticesGenerated: 184,
  finesRealizedInr: 3450000,
  activeInspectorsCount: 42,
  divisionsCovered: 8,
  
  complianceByCategory: [
    { category: 'Dairy & Beverages', compliant: 94, nonCompliant: 6, total: 310 },
    { category: 'Packaged Snacks', compliant: 71, nonCompliant: 29, total: 420 },
    { category: 'Cosmetics & Personal', compliant: 68, nonCompliant: 32, total: 240 },
    { category: 'Edible Oils & Grains', compliant: 88, nonCompliant: 12, total: 180 },
    { category: 'Imported Confectionery', compliant: 55, nonCompliant: 45, total: 98 }
  ],

  topViolatedRules: [
    { rule: 'Rule 6(1)(n)', name: 'Missing Consumer Care Details', count: 98, percentage: 37.4 },
    { rule: 'Rule 6(1)(j)', name: 'Absence of Unit Sale Price (USP)', count: 74, percentage: 28.2 },
    { rule: 'Rule 7 Table-1', name: 'Undersized Font Height', count: 46, percentage: 17.5 },
    { rule: 'Rule 6(1)(d)', name: 'Missing / Illegible Mfg Date', count: 32, percentage: 12.2 },
    { rule: 'Rule 12', name: 'Non-Standard Quantity Unit (gms/kilo)', count: 12, percentage: 4.7 }
  ],

  monthlyTrend: [
    { month: 'Mar 2026', total: 180, compliant: 135, nonCompliant: 45 },
    { month: 'Apr 2026', total: 210, compliant: 162, nonCompliant: 48 },
    { month: 'May 2026', total: 240, compliant: 190, nonCompliant: 50 },
    { month: 'Jun 2026', total: 285, compliant: 228, nonCompliant: 57 },
    { month: 'Jul 2026', total: 310, compliant: 251, nonCompliant: 59 },
    { month: 'Aug 2026', total: 345, compliant: 279, nonCompliant: 66 }
  ]
};
