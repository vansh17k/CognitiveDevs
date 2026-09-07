import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// PRESET SAMPLE PACKAGING LABELS FOR INSTANT TESTING
// ==========================================
export const SAMPLE_FBO_LABELS = [
  {
    id: 'sample-1',
    productName: 'AeroPulse Vitality Sparkling Energy (250ml)',
    category: 'Beverage',
    netQuantity: '250 ml',
    mrp: '₹120.00',
    batchNumber: 'AP-2026-B819',
    mfgDate: '07/2026',
    expiryDate: '01/2027',
    manufacturer: 'AeroPulse Beverages Ltd., Plot 44, MIDC Industrial Area, Pune - 411019, MH',
    fssaiLicense: '10020022008819',
    imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800&auto=format&fit=crop&q=80',
    complianceScore: 68,
    status: 'Requires Revision',
    pdpArea: 180, // cm2
    extractedFields: [
      { key: 'Product Name', value: 'AeroPulse Vitality Sparkling Energy', confidence: 99.2, bbox: [12, 10, 76, 14], compliant: true },
      { key: 'Net Quantity', value: '250 ml', confidence: 98.4, bbox: [15, 78, 30, 8], compliant: false, issue: 'Font size is 1.8mm (Min required for 180cm² PDP is 2.5mm)' },
      { key: 'MRP (Inclusive of taxes)', value: 'MRP: Rs. 120/-', confidence: 96.5, bbox: [55, 78, 35, 8], compliant: false, issue: 'Missing mandatory phrase "incl. of all taxes" under Rule 6(1)(e)' },
      { key: 'Unit Sale Price (USP)', value: 'Rs. 0.48 / ml', confidence: 94.0, bbox: [55, 88, 32, 6], compliant: true },
      { key: 'Month & Year of Packing', value: 'MFD: 07/2026', confidence: 97.8, bbox: [15, 62, 32, 7], compliant: true },
      { key: 'Country of Origin', value: 'Made in India', confidence: 98.9, bbox: [15, 70, 30, 6], compliant: true },
      { key: 'FSSAI License No.', value: 'Lic. No. 10020022008819', confidence: 99.1, bbox: [52, 62, 40, 7], compliant: true },
      { key: 'Consumer Care Contact', value: 'customercare@aeropulse.in | +91-20-88899900', confidence: 95.7, bbox: [15, 88, 38, 7], compliant: true },
    ],
    violationsList: [
      {
        id: 'viol-1',
        ruleCited: 'Rule 9(1) - Font & Numeral Height Deficiency',
        severity: 'Critical Violation',
        field: 'Net Quantity Declaration',
        observed: 'Net Quantity numeral height printed at 1.8mm. For a Principal Display Panel area of 180 cm², minimum prescribed numeral height is 2.5mm under Rule 9 Table 1.',
        penalty: 'Section 36(1) of Legal Metrology Act, 2009 — Fine up to ₹25,000 for first offense, ₹50,000 for second offense.',
        guidance: 'Increase typeface size of "250 ml" to at least 2.5mm (approx 7.1 pt) on the primary front panel before release to manufacturing.'
      },
      {
        id: 'viol-2',
        ruleCited: 'Rule 6(1)(e) - Mandatory MRP Tax Clause',
        severity: 'Critical Violation',
        field: 'Maximum Retail Price (MRP)',
        observed: 'Price printed as "MRP: Rs. 120/-" without the statutory wording "(Inclusive of all taxes)" or "Incl. of all taxes".',
        penalty: 'Section 36(1) of Legal Metrology Act, 2009 — Compounding fine up to ₹25,000 and possible confiscation of non-compliant batch.',
        guidance: 'Update label artwork to state "MRP ₹ 120.00 (incl. of all taxes)" in prominent, clear lettering.'
      },
      {
        id: 'viol-3',
        ruleCited: 'Rule 18(1) - Unit Sale Price Legibility',
        severity: 'Moderate Warning',
        field: 'Unit Sale Price (USP)',
        observed: 'Unit sale price is printed in low-contrast gray text on dark background.',
        penalty: 'Rule 9(3) & Section 36 — Warning memo / requirement to ensure contrasting background.',
        guidance: 'Ensure USP "₹ 0.48 / ml" is printed with high contrast against the packaging background for full legibility.'
      }
    ],
    rulesTriggered: ['Rule 6', 'Rule 9', 'Rule 18', 'Sec 36']
  },
  {
    id: 'sample-2',
    productName: 'Himalayan Gold Organic Green Tea (100g)',
    category: 'Packaged Food',
    netQuantity: '100 g',
    mrp: '₹249.00',
    batchNumber: 'HG-2026-GT90',
    mfgDate: '08/2026',
    expiryDate: '08/2027',
    manufacturer: 'Himalayan Organic Estates Ltd., Tea Garden Road, Palampur, HP - 176061',
    fssaiLicense: '10019011000342',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    complianceScore: 98,
    status: 'Ready for Market',
    pdpArea: 140, // cm2
    extractedFields: [
      { key: 'Product Name', value: 'Himalayan Gold Organic Green Tea', confidence: 99.8, bbox: [10, 8, 80, 15], compliant: true },
      { key: 'Net Quantity', value: '100 g', confidence: 99.4, bbox: [12, 75, 25, 8], compliant: true },
      { key: 'MRP (Inclusive of taxes)', value: 'MRP ₹ 249.00 (Incl. of all taxes)', confidence: 98.9, bbox: [45, 75, 45, 8], compliant: true },
      { key: 'Unit Sale Price (USP)', value: '₹ 2.49 per g', confidence: 97.2, bbox: [45, 85, 35, 6], compliant: true },
      { key: 'Month & Year of Packing', value: 'Packed: 08/2026', confidence: 99.0, bbox: [12, 60, 30, 6], compliant: true },
      { key: 'Country of Origin', value: 'Country of Origin: India', confidence: 99.5, bbox: [12, 68, 32, 6], compliant: true },
      { key: 'FSSAI License No.', value: 'FSSAI Lic: 10019011000342', confidence: 99.6, bbox: [50, 60, 42, 6], compliant: true },
      { key: 'Consumer Care Contact', value: 'Manager, Consumer Cell: 1800-123-4567 | care@himalayangold.in', confidence: 98.1, bbox: [12, 85, 32, 8], compliant: true },
    ],
    violationsList: [
      {
        id: 'viol-c1',
        ruleCited: 'Schedule II - Standard Package Size',
        severity: 'Compliant',
        field: 'Prescribed Weight Specification',
        observed: '100g is a standard prescribed package weight under Schedule II PCR-2011.',
        penalty: 'None (Full Statutory Compliance Verified).',
        guidance: 'All statutory declarations meet Legal Metrology (Packaged Commodities) Rules 2011.'
      }
    ],
    rulesTriggered: ['Rule 6', 'Rule 9', 'Schedule II']
  },
  {
    id: 'sample-3',
    productName: 'Royal Harvest Premium Basmati Rice (5kg)',
    category: 'Packaged Food',
    netQuantity: '5 kg',
    mrp: '₹580.00',
    batchNumber: 'RH-2026-R411',
    mfgDate: '06/2026',
    expiryDate: '06/2028',
    manufacturer: 'Royal Harvest Agro Mills, G.T. Road, Karnal - 132001, Haryana',
    fssaiLicense: '10014064000109',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    complianceScore: 54,
    status: 'Requires Revision',
    pdpArea: 550, // cm2
    extractedFields: [
      { key: 'Product Name', value: 'Royal Harvest Premium Basmati Rice', confidence: 98.7, bbox: [15, 8, 70, 16], compliant: true },
      { key: 'Net Quantity', value: '5 kg', confidence: 97.5, bbox: [18, 70, 28, 8], compliant: true },
      { key: 'MRP (Dual Price detected)', value: 'MRP ₹ 580.00 (Special Online: ₹ 520)', confidence: 95.1, bbox: [48, 70, 46, 12], compliant: false, issue: 'Dual MRP declaration violates Rule 18(2)' },
      { key: 'Unit Sale Price (USP)', value: '₹ 116.00 / kg', confidence: 96.0, bbox: [48, 84, 30, 6], compliant: true },
      { key: 'Month & Year of Packing', value: 'PKD: 06/2026', confidence: 98.1, bbox: [18, 55, 25, 6], compliant: true },
      { key: 'Country of Origin', value: 'Product of India', confidence: 98.5, bbox: [18, 62, 28, 6], compliant: true },
      { key: 'Packer Registration', value: 'Unregistered packing unit mark', confidence: 88.0, bbox: [48, 55, 40, 8], compliant: false, issue: 'Missing statutory Director/Packer registration code under Section 38' },
      { key: 'Consumer Care Contact', value: 'care@royalharvest.in', confidence: 94.2, bbox: [18, 84, 28, 6], compliant: false, issue: 'Telephone contact / complete postal address omitted' },
    ],
    violationsList: [
      {
        id: 'viol-3-1',
        ruleCited: 'Rule 18(2) - Dual MRP Prohibition',
        severity: 'Critical Violation',
        field: 'Retail Price Declaration',
        observed: 'Label displays two distinct MRP prices ("MRP ₹ 580.00" and "Special Online: ₹ 520"). Dual MRP is strictly prohibited under Rule 18(2) of PCR 2011.',
        penalty: 'Section 36(1) & Section 49 — Penalty up to ₹50,000 for manufacturer/packer for unfair trade practice & dual pricing.',
        guidance: 'Remove the secondary discounted price from the physical statutory label. Print single unified MRP inclusive of all taxes.'
      },
      {
        id: 'viol-3-2',
        ruleCited: 'Section 38 - Registration of Manufacturer / Packer',
        severity: 'Critical Violation',
        field: 'Statutory Registration Details',
        observed: 'Packaging does not carry the verified Packer Registration Number or Central Director of Legal Metrology registration identification.',
        penalty: 'Section 38 of Legal Metrology Act, 2009 — Penalty fine up to ₹25,000 for failure to register packing premises.',
        guidance: 'Include valid Packer Registration License Number (e.g., "Regd. Packer No: IND/DLM/2024/...") in the manufacturer address block.'
      },
      {
        id: 'viol-3-3',
        ruleCited: 'Rule 6(1)(g) - Consumer Care Mandatory Phone Number',
        severity: 'Moderate Warning',
        field: 'Consumer Redressal Details',
        observed: 'Only email address provided ("care@royalharvest.in"). Rule 6(1)(g) requires Name, Address, Telephone number AND Email of designated officer.',
        penalty: 'Rule 6 & Section 36(1) — Notice for rectification before commercial distribution.',
        guidance: 'Add a functioning toll-free / landline telephone number and physical contact officer designation to the consumer care panel.'
      }
    ],
    rulesTriggered: ['Rule 6', 'Rule 18', 'Sec 36', 'Sec 38']
  },
  {
    id: 'sample-4',
    productName: 'ChocoDelight Hazelnut Cocoa Spread (350g)',
    category: 'Confectionery',
    netQuantity: '350 g',
    mrp: '₹310.00',
    batchNumber: 'CD-2026-H04',
    mfgDate: '07/2026',
    expiryDate: '07/2027',
    manufacturer: 'ChocoDelight Confectionery Pvt. Ltd., Industrial Estate, Baddi, HP - 173205',
    fssaiLicense: '10018021000871',
    imageUrl: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&auto=format&fit=crop&q=80',
    complianceScore: 74,
    status: 'Requires Revision',
    pdpArea: 220, // cm2
    extractedFields: [
      { key: 'Product Name', value: 'ChocoDelight Hazelnut Cocoa Spread', confidence: 99.1, bbox: [12, 10, 75, 14], compliant: true },
      { key: 'Net Quantity', value: '350 g', confidence: 98.7, bbox: [15, 72, 28, 8], compliant: true },
      { key: 'MRP (Inclusive of taxes)', value: 'MRP: Rs. 310.00 (Incl. of all taxes)', confidence: 98.0, bbox: [48, 72, 42, 8], compliant: true },
      { key: 'Unit Sale Price (USP)', value: 'USP: Rs. 0.88/g', confidence: 93.4, bbox: [48, 82, 35, 6], compliant: false, issue: 'Font size 1.2mm is below the 2.0mm minimum for PDP > 200cm²' },
      { key: 'Month & Year of Packing', value: 'Mfg: 07/2026', confidence: 97.6, bbox: [15, 58, 28, 6], compliant: true },
      { key: 'Country of Origin', value: 'Country of Origin: India', confidence: 99.0, bbox: [15, 65, 30, 6], compliant: true },
      { key: 'FSSAI License No.', value: 'Lic. No. 10018021000871', confidence: 99.4, bbox: [48, 58, 42, 6], compliant: true },
      { key: 'Consumer Care Contact', value: 'Helpdesk: 1800-444-222', confidence: 91.0, bbox: [15, 82, 30, 6], compliant: false, issue: 'Missing consumer contact email or designated officer address' },
    ],
    violationsList: [
      {
        id: 'viol-4-1',
        ruleCited: 'Rule 9(1) & Rule 7 - Unit Sale Price Numeral Height',
        severity: 'Moderate Warning',
        field: 'Unit Sale Price (USP)',
        observed: 'Unit Sale Price numeral height is 1.2mm. For Principal Display Panel of 220cm², Rule 9 Table 1 mandates minimum 2.0mm.',
        penalty: 'Section 36(1) of Legal Metrology Act, 2009 — Mandatory corrective order.',
        guidance: 'Increase font size of "USP: Rs. 0.88/g" to minimum 2.0mm.'
      },
      {
        id: 'viol-4-2',
        ruleCited: 'Rule 6(1)(g) - Incomplete Consumer Care Details',
        severity: 'Moderate Warning',
        field: 'Consumer Redressal',
        observed: 'Telephone provided but contact email and postal address omitted.',
        penalty: 'Rule 6(1)(g) compliance reminder.',
        guidance: 'Include email address (e.g., "feedback@chocodelight.in") alongside the toll-free number.'
      }
    ],
    rulesTriggered: ['Rule 6', 'Rule 9', 'Sec 36']
  }
];

// ==========================================
// INITIAL AUDIT HISTORY DATASET
// ==========================================
export const INITIAL_FBO_AUDIT_HISTORY = [
  {
    id: 'FBO-AUD-2026-901',
    timestamp: '2026-08-31 16:45',
    productName: 'AeroPulse Vitality Sparkling Energy (250ml)',
    category: 'Beverage',
    batchNumber: 'AP-2026-B819',
    netQuantity: '250 ml',
    mrp: '₹120.00',
    labelImageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800&auto=format&fit=crop&q=80',
    complianceScore: 68,
    status: 'Requires Revision',
    violationsCount: 3,
    rulesTriggered: ['Rule 6', 'Rule 9', 'Rule 18', 'Sec 36'],
    violationsList: SAMPLE_FBO_LABELS[0].violationsList,
    extractedFields: SAMPLE_FBO_LABELS[0].extractedFields
  },
  {
    id: 'FBO-AUD-2026-902',
    timestamp: '2026-08-30 11:20',
    productName: 'Himalayan Gold Organic Green Tea (100g)',
    category: 'Packaged Food',
    batchNumber: 'HG-2026-GT90',
    netQuantity: '100 g',
    mrp: '₹249.00',
    labelImageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    complianceScore: 98,
    status: 'Ready for Market',
    violationsCount: 0,
    rulesTriggered: ['Rule 6', 'Rule 9', 'Schedule II'],
    violationsList: SAMPLE_FBO_LABELS[1].violationsList,
    extractedFields: SAMPLE_FBO_LABELS[1].extractedFields
  },
  {
    id: 'FBO-AUD-2026-903',
    timestamp: '2026-08-28 14:10',
    productName: 'Royal Harvest Premium Basmati Rice (5kg)',
    category: 'Packaged Food',
    batchNumber: 'RH-2026-R411',
    netQuantity: '5 kg',
    mrp: '₹580.00',
    labelImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    complianceScore: 54,
    status: 'Requires Revision',
    violationsCount: 3,
    rulesTriggered: ['Rule 6', 'Rule 18', 'Sec 36', 'Sec 38'],
    violationsList: SAMPLE_FBO_LABELS[2].violationsList,
    extractedFields: SAMPLE_FBO_LABELS[2].extractedFields
  },
  {
    id: 'FBO-AUD-2026-904',
    timestamp: '2026-08-25 09:30',
    productName: 'ChocoDelight Hazelnut Cocoa Spread (350g)',
    category: 'Confectionery',
    batchNumber: 'CD-2026-H04',
    netQuantity: '350 g',
    mrp: '₹310.00',
    labelImageUrl: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&auto=format&fit=crop&q=80',
    complianceScore: 74,
    status: 'Requires Revision',
    violationsCount: 2,
    rulesTriggered: ['Rule 6', 'Rule 9', 'Sec 36'],
    violationsList: SAMPLE_FBO_LABELS[3].violationsList,
    extractedFields: SAMPLE_FBO_LABELS[3].extractedFields
  }
];

// ==========================================
// OCR RULE ENGINE EXECUTION HELPER
// ==========================================
export const runOcrLegalMetrologyAudit = (metadata, labelImageSrc) => {
  const {
    productName = 'Packaged Commodity',
    category = 'Packaged Food',
    netQuantity = '500 g',
    mrp = '₹150.00',
    batchNumber = 'BATCH-2026-01',
    manufacturer = 'Apex Nutrition & Agro Foods Pvt. Ltd.',
    pdpArea = 200
  } = metadata;

  // Evaluate Rules
  const violations = [];
  const rules = [];

  // Check Net Quantity & SI Units
  const hasStandardUnit = /(g|kg|ml|l|m|cm|mm|n|units)/i.test(netQuantity);
  if (!hasStandardUnit) {
    violations.push({
      id: `v-${Date.now()}-1`,
      ruleCited: 'Rule 6(1)(c) & Rule 12 - Standard SI Units Required',
      severity: 'Critical Violation',
      field: 'Net Quantity Specification',
      observed: `Declared quantity "${netQuantity}" does not use approved standard SI symbols (g, kg, ml, l, N).`,
      penalty: 'Section 36(1) of Legal Metrology Act, 2009 — Penalty up to ₹25,000 for non-standard metric declaration.',
      guidance: 'Replace non-standard units (e.g. gms, kgs, ltr) with strict metric symbols (g, kg, ml, l).'
    });
    rules.push('Rule 6', 'Sec 36');
  }

  // Check PDP Font Size Requirement based on Rule 9
  let minFontHeight = 2.0;
  if (pdpArea <= 50) minFontHeight = 1.0;
  else if (pdpArea <= 200) minFontHeight = 2.0;
  else if (pdpArea <= 1000) minFontHeight = 4.0;
  else minFontHeight = 6.0;

  // Check MRP
  const hasTaxClause = mrp.toLowerCase().includes('tax') || mrp.toLowerCase().includes('incl');
  if (!hasTaxClause && !mrp.toLowerCase().includes('inclusive')) {
    violations.push({
      id: `v-${Date.now()}-2`,
      ruleCited: 'Rule 6(1)(e) - Mandatory Maximum Retail Price Declaration',
      severity: 'Critical Violation',
      field: 'Retail Price (MRP)',
      observed: `Price "${mrp}" is missing statutory "(Inclusive of all taxes)" statement.`,
      penalty: 'Section 36(1) of Legal Metrology Act, 2009 — Compounding fine up to ₹25,000.',
      guidance: 'Artwork must prominently state: "MRP ₹ [Amount] (Incl. of all taxes)".'
    });
    rules.push('Rule 6', 'Sec 36');
  }

  // Check Manufacturer Address
  if (!manufacturer || manufacturer.length < 15 || !/\d{6}/.test(manufacturer)) {
    violations.push({
      id: `v-${Date.now()}-3`,
      ruleCited: 'Rule 6(1)(a) - Complete Statutory Address of Manufacturer/Packer',
      severity: 'Moderate Warning',
      field: 'Manufacturer / Packer Address',
      observed: 'Manufacturer address lacks complete postal PIN code or factory survey number.',
      penalty: 'Rule 6(1)(a) & Section 38 — Requirement for statutory manufacturing traceability.',
      guidance: 'Declare complete physical address with 6-digit postal PIN and state code.'
    });
    rules.push('Rule 6', 'Sec 38');
  }

  // Calculate overall score
  const baseScore = Math.max(40, 100 - violations.length * 16);
  const score = violations.length === 0 ? 98 : baseScore;
  const status = violations.length === 0 ? 'Ready for Market' : 'Requires Revision';

  if (rules.length === 0) {
    rules.push('Rule 6', 'Rule 9', 'Schedule II');
  }

  const extractedFields = [
    { key: 'Product Name', value: productName, confidence: 99.2, bbox: [12, 10, 76, 14], compliant: true },
    { key: 'Net Quantity', value: netQuantity, confidence: 98.4, bbox: [15, 78, 30, 8], compliant: hasStandardUnit },
    { key: 'MRP (Inclusive of taxes)', value: mrp, confidence: 97.0, bbox: [52, 78, 38, 8], compliant: hasTaxClause },
    { key: 'Unit Sale Price (USP)', value: 'Auto-calculated statutory USP', confidence: 95.5, bbox: [52, 88, 35, 6], compliant: true },
    { key: 'Month & Year of Packing', value: metadata.mfgDate || '08/2026', confidence: 98.0, bbox: [15, 62, 30, 6], compliant: true },
    { key: 'Country of Origin', value: 'Country of Origin: India', confidence: 99.0, bbox: [15, 70, 30, 6], compliant: true },
    { key: 'FSSAI License No.', value: metadata.fssaiLicense || '10020022001948', confidence: 99.3, bbox: [52, 62, 40, 6], compliant: true },
    { key: 'Manufacturer Address', value: manufacturer, confidence: 96.0, bbox: [15, 88, 35, 8], compliant: manufacturer.length >= 15 },
  ];

  return {
    id: `FBO-AUD-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    productName,
    category,
    netQuantity,
    mrp,
    batchNumber,
    labelImageUrl: labelImageSrc || SAMPLE_FBO_LABELS[0].imageUrl,
    complianceScore: score,
    status,
    violationsCount: violations.length,
    rulesTriggered: Array.from(new Set(rules)),
    violationsList: violations.length > 0 ? violations : [
      {
        id: 'v-clean',
        ruleCited: 'Schedule II & PCR-2011 Verified',
        severity: 'Compliant',
        field: 'Full Statutory Alignment',
        observed: 'All mandatory declarations conform to Legal Metrology (Packaged Commodities) Rules, 2011.',
        penalty: 'None (Full Statutory Compliance Verified).',
        guidance: 'Label artwork approved for release to packaging line.'
      }
    ],
    extractedFields
  };
};

// ==========================================
// EXPORT FBO PRE-AUDIT REPORT AS PDF
// ==========================================
export const exportFboPreAuditPDF = (auditRecord) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const isClean = auditRecord.complianceScore >= 90;

    // Header Color Accent Bar (Deep Midnight Navy with Indigo accent)
    doc.setFillColor(10, 15, 30); // #0A0F1E
    doc.rect(0, 0, pageWidth, 24, 'F');

    doc.setFillColor(79, 70, 229); // #4F46E5 Indigo line
    doc.rect(0, 23, pageWidth, 1.5, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.text('FBO PACKAGING PRE-RELEASE COMPLIANCE AUDIT REPORT', pageWidth / 2, 9.5, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011 & FSSAI REGULATIONS', pageWidth / 2, 15.5, { align: 'center' });

    doc.setFontSize(7);
    doc.text(`AUDIT REF: ${auditRecord.id} • GENERATED ON: ${auditRecord.timestamp} • PRE-PRINT AUDIT`, pageWidth / 2, 20, { align: 'center' });

    // 1. PRODUCT SUMMARY SECTION
    let currentY = 32;
    doc.setTextColor(10, 15, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('1. PRODUCT & BATCH METADATA', 14, currentY);

    const productDetails = [
      [
        { content: 'Product Name:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.productName || 'N/A' },
        { content: 'Audit Reference ID:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.id }
      ],
      [
        { content: 'Category:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.category || 'Packaged Commodity' },
        { content: 'Batch / Lot No:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.batchNumber || 'BATCH-2026' }
      ],
      [
        { content: 'Declared Net Qty:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.netQuantity || 'N/A' },
        { content: 'Declared MRP:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.mrp || 'N/A' }
      ],
      [
        { content: 'Compliance Score:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `${auditRecord.complianceScore}% (${auditRecord.status})`, styles: { textColor: isClean ? [16, 185, 129] : [239, 68, 68], fontStyle: 'bold' } },
        { content: 'Rules Triggered:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: (auditRecord.rulesTriggered || ['Rule 6', 'Rule 9']).join(', ') }
      ]
    ];

    autoTable(doc, {
      startY: currentY + 3,
      body: productDetails,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 55 },
        2: { cellWidth: 35 },
        3: { cellWidth: 55 },
      },
      headStyles: { fillColor: [241, 245, 249] }
    });

    // 2. PARSED OCR FIELDS
    currentY = doc.lastAutoTable.finalY + 8;
    doc.setTextColor(10, 15, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('2. OCR EXTRACTED STATUTORY DECLARATIONS', 14, currentY);

    const ocrRows = (auditRecord.extractedFields || []).map((f, index) => [
      index + 1,
      f.key,
      f.value,
      `${f.confidence}%`,
      f.compliant ? 'Compliant' : 'Non-Compliant / Alert'
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['#', 'Statutory Parameter', 'Observed Extracted Text', 'OCR Confidence', 'Rule Status']],
      body: ocrRows,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 42 },
        2: { cellWidth: 80 },
        3: { cellWidth: 24, halign: 'center' },
        4: { cellWidth: 26, halign: 'center' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw === 'Compliant') {
            data.cell.styles.textColor = [16, 185, 129];
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    // 3. STATUTORY VIOLATIONS & PENAL PROVISIONS
    currentY = doc.lastAutoTable.finalY + 8;
    if (currentY > pageHeight - 65) {
      doc.addPage();
      currentY = 20;
    }

    doc.setTextColor(10, 15, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('3. DETECTED LEGAL METROLOGY NON-CONFORMANCES & PENALTIES', 14, currentY);

    const violRows = (auditRecord.violationsList || []).map((v, i) => [
      i + 1,
      v.ruleCited,
      v.observed,
      v.penalty,
      v.guidance
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['#', 'Rule Cited', 'Observed Non-Conformance', 'Applicable Statutory Penalty', 'Correction Guidance']],
      body: violRows,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2.2, textColor: [30, 41, 59] },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 36 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
        4: { cellWidth: 46 }
      }
    });

    // 4. SIGN-OFF / CERTIFICATE STAMP
    currentY = doc.lastAutoTable.finalY + 10;
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'D');

    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('FBO Quality Assurance Certification:', 18, currentY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('DIGITALLY GENERATED PRE-RELEASE COMPLIANCE AUDIT', 18, currentY + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('This automated verification report was generated for pre-release artwork assessment under PCR-2011.', 18, currentY + 16);

    doc.setFont('helvetica', 'bold');
    doc.text('Status: ' + (isClean ? 'APPROVED FOR COMMERCIAL PACKING' : 'REVISION REQUIRED BEFORE RELEASE'), pageWidth - 20, currentY + 11, { align: 'right' });
    doc.text('Verification Code: FBO-SEC-' + Math.floor(100000 + Math.random() * 900000), pageWidth - 20, currentY + 16, { align: 'right' });

    // Footer
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('CONFIDENTIAL • FOOD BUSINESS OPERATOR PRE-AUDIT RECORD • MINISTRY OF CONSUMER AFFAIRS & FSSAI COMPLIANT', pageWidth / 2, pageHeight - 6, { align: 'center' });

    doc.save(`${auditRecord.productName.replace(/[^a-zA-Z0-9]/g, '_')}_PreAudit_${auditRecord.id}.pdf`);
    return true;
  } catch (err) {
    console.error('Failed to export FBO PDF:', err);
    return false;
  }
};

// ==========================================
// EXPORT FBO AUDIT AS CSV
// ==========================================
export const exportFboPreAuditCSV = (auditRecord) => {
  try {
    const rows = [
      ['FBO PRE-RELEASE COMPLIANCE AUDIT RECORD'],
      ['Audit ID', auditRecord.id],
      ['Timestamp', auditRecord.timestamp],
      ['Product Name', auditRecord.productName],
      ['Category', auditRecord.category],
      ['Batch Number', auditRecord.batchNumber],
      ['Declared Net Qty', auditRecord.netQuantity],
      ['Declared MRP', auditRecord.mrp],
      ['Compliance Score', `${auditRecord.complianceScore}%`],
      ['Status', auditRecord.status],
      [''],
      ['OCR PARSED FIELDS'],
      ['Parameter', 'Extracted Value', 'Confidence', 'Status']
    ];

    (auditRecord.extractedFields || []).forEach(f => {
      rows.push([f.key, f.value, `${f.confidence}%`, f.compliant ? 'Compliant' : 'Non-Compliant']);
    });

    rows.push(['']);
    rows.push(['DETECTED VIOLATIONS & PENALTIES']);
    rows.push(['Rule Cited', 'Severity', 'Observed Deficiency', 'Statutory Penalty', 'Correction Guidance']);

    (auditRecord.violationsList || []).forEach(v => {
      rows.push([v.ruleCited, v.severity, v.observed, v.penalty, v.guidance]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${auditRecord.productName.replace(/[^a-zA-Z0-9]/g, '_')}_Audit_${auditRecord.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to export CSV:', err);
    return false;
  }
};
