/**
 * ============================================================================
 * LEGAL METROLOGY VIOLATIONS TAXONOMY & STATUTORY INFRACTIONS
 * ============================================================================
 * 
 * Provides predefined violation types, legal classifications, statutory citations,
 * and compounding penalty amounts under the Legal Metrology Act, 2009.
 */

export const VIOLATION_TYPES = {
  MISSING_CONSUMER_CARE: {
    id: 'V-CC',
    rule: 'Rule 6(1)(n)',
    title: 'Missing Consumer Care Contact Details',
    severity: 'High',
    fine: 25000,
    section: 'Section 36(1)'
  },
  MISSING_USP: {
    id: 'V-USP',
    rule: 'Rule 6(1)(j)',
    title: 'Absence of Unit Sale Price (USP)',
    severity: 'Medium',
    fine: 20000,
    section: 'Section 36(1)'
  },
  MISSING_MFG_DATE: {
    id: 'V-MFG',
    rule: 'Rule 6(1)(d)',
    title: 'Missing Month & Year of Manufacture/Packing',
    severity: 'High',
    fine: 25000,
    section: 'Section 36(1)'
  },
  UNDERSIZED_FONT: {
    id: 'V-FONT',
    rule: 'Rule 7 Table-1',
    title: 'Font Height Less Than Statutory Minimum',
    severity: 'Medium',
    fine: 15000,
    section: 'Section 48'
  },
  NON_STANDARD_UNIT: {
    id: 'V-UNIT',
    rule: 'Rule 12',
    title: 'Non-Standard SI Weight/Volume Abbreviation',
    severity: 'High',
    fine: 25000,
    section: 'Section 36(1)'
  },
  MISSING_MRP_TAX_CLAUSE: {
    id: 'V-TAX',
    rule: 'Rule 6(1)(e)',
    title: 'Omission of "Inclusive of all taxes" Statement',
    severity: 'Critical',
    fine: 25000,
    section: 'Section 36(2)'
  }
};

export const RECENT_INFRACTIONS = [
  {
    id: 'INF-901',
    productName: 'Parle-G Original Gluco Biscuits 800g',
    brand: 'Parle',
    rule: 'Rule 6(1)(n)',
    violationTitle: 'Missing Consumer Care Contact Details',
    date: '2026-08-28',
    severity: 'High',
    inspector: 'Inspector Rajesh Sharma',
    division: 'Central Zone - District 1',
    status: 'Notice Issued'
  },
  {
    id: 'INF-902',
    productName: "Lay's India's Magic Masala 50g",
    brand: "Lay's",
    rule: 'Rule 6(1)(j)',
    violationTitle: 'Absence of Unit Sale Price (USP)',
    date: '2026-08-27',
    severity: 'Medium',
    inspector: 'Inspector Vikram Joshi',
    division: 'Northern Division',
    status: 'Advisory Sent'
  },
  {
    id: 'INF-903',
    productName: 'Maggi 2-Minute Masala Noodles 70g',
    brand: 'Maggi',
    rule: 'Rule 6(1)(d)',
    violationTitle: 'Missing Month & Year of Manufacture/Packing',
    date: '2026-08-26',
    severity: 'High',
    inspector: 'Inspector Priya Patel',
    division: 'Western Sector',
    status: 'Under Review'
  },
  {
    id: 'INF-904',
    productName: 'Royal Crunchy Cashews 200g',
    brand: 'Royal Treat',
    rule: 'Rule 6(1)(b)',
    violationTitle: 'Missing Generic Name of Commodity',
    date: '2026-08-25',
    severity: 'Medium',
    inspector: 'Inspector Rajesh Sharma',
    division: 'Central Zone - District 1',
    status: 'Notice Issued'
  }
];
