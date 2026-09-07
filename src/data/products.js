/**
 * ============================================================================
 * LEGAL METROLOGY (PACKAGED COMMODITIES) COMPLIANCE - PRODUCT REPOSITORY
 * ============================================================================
 * 
 * This dataset contains pre-configured test packages representing both
 * fully compliant commodities and real-world non-compliance scenarios
 * encountered during field inspections under Rule 6 of PCR, 2011.
 * 
 * Each product model tracks:
 * - Basic metadata: Name, Brand, Category, Barcode, Batch
 * - Physical & PDP properties: Package size (g/ml), PDP area, Font heights
 * - Statutory Rule 6 declarations:
 *     1. Manufacturer name & full address (Rule 6(1)(a))
 *     2. Common/Generic name (Rule 6(1)(b))
 *     3. Net quantity in standard SI units (Rule 6(1)(c) & Rule 12)
 *     4. Month & Year of packing/mfg (Rule 6(1)(d))
 *     5. MRP inclusive of all taxes (Rule 6(1)(e))
 *     6. Consumer care phone/email/address (Rule 6(1)(n))
 *     7. Country of origin for imports (Rule 6(1)(m))
 *     8. Unit Sale Price (USP) (Rule 6(1)(j))
 * - OCR extraction tokens with coordinates & bounding box highlights
 * - Violations array detailing flagged legal metrology defects
 */

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Amul Pasteurised Butter 500g',
    brand: 'Amul',
    category: 'Dairy Products',
    barcode: '8901262010123',
    batchNumber: 'AM-2026-B81',
    mfgDate: '07/2026',
    expiryDate: '01/2027',
    netQuantityDeclared: true,
    netQuantityValue: '500 g',
    mrpDeclared: true,
    mrpValue: 275.00,
    uspDeclared: true,
    uspValue: '₹0.55 / g',
    manufacturerDeclared: true,
    manufacturerName: 'Gujarat Cooperative Milk Marketing Federation Ltd. (GCMMF)',
    manufacturerAddress: 'Amul Dairy Road, Anand - 388001, Gujarat, India',
    consumerCareDetails: true,
    consumerCareContact: '1800-258-3333 | customercare@amul.coop',
    countryOfOriginDeclared: true,
    countryOfOrigin: 'India',
    fssaiLicenseDeclared: true,
    fssaiNumber: '10012021000071',
    genericNameDeclared: true,
    genericName: 'Pasteurised Butter',
    pdpAreaSqCm: 180,
    prescribedMinFontHeightMm: 2.0,
    actualFontHeightMm: 2.5,
    fontCompliance: true,
    complianceScore: 98,
    status: 'Compliant',
    image: '/images/products/amul.png',
    violations: [],
    ocrTokens: [
      { id: 't1', text: 'Amul PASTEURISED BUTTER', field: 'brand_generic', confidence: 0.99, box: [15, 20, 70, 25] },
      { id: 't2', text: 'Net Quantity: 500 g', field: 'net_quantity', confidence: 0.98, box: [50, 60, 40, 10] },
      { id: 't3', text: 'MRP Rs. 275.00 (Incl. of all taxes)', field: 'mrp', confidence: 0.97, box: [50, 72, 45, 10] },
      { id: 't4', text: 'USP: Rs. 0.55/g', field: 'usp', confidence: 0.95, box: [50, 83, 30, 8] },
      { id: 't5', text: 'Mfg Date: 07/2026', field: 'mfg_date', confidence: 0.96, box: [10, 85, 35, 8] },
      { id: 't6', text: 'Toll-Free: 1800-258-3333', field: 'consumer_care', confidence: 0.94, box: [10, 92, 40, 6] }
    ]
  },
  {
    id: 'prod-002',
    name: 'Parle-G Original Gluco Biscuits 800g',
    brand: 'Parle',
    category: 'Bakery & Confectionery',
    barcode: '8901719102034',
    batchNumber: 'PG-9920-X',
    mfgDate: '06/2026',
    expiryDate: '12/2026',
    netQuantityDeclared: true,
    netQuantityValue: '800 g',
    mrpDeclared: true,
    mrpValue: 80.00,
    uspDeclared: true,
    uspValue: '₹0.10 / g',
    manufacturerDeclared: true,
    manufacturerName: 'Parle Products Pvt. Ltd.',
    manufacturerAddress: 'North Level Crossing, Vile Parle (East), Mumbai - 400057',
    consumerCareDetails: false, // VIOLATION: Missing contact details
    consumerCareContact: '',
    countryOfOriginDeclared: true,
    countryOfOrigin: 'India',
    fssaiLicenseDeclared: true,
    fssaiNumber: '10013022000145',
    genericNameDeclared: true,
    genericName: 'Biscuits',
    pdpAreaSqCm: 220,
    prescribedMinFontHeightMm: 2.0,
    actualFontHeightMm: 1.8,
    fontCompliance: false,
    complianceScore: 68,
    status: 'Non-Compliant',
    image: '/images/products/parle-g.png',
    violations: [
      {
        id: 'viol-001',
        rule: 'Rule 6(1)(n)',
        ruleNumber: 'Rule 6(1)(n)',
        ruleReference: 'Rule 6(1)(n) of PCR, 2011',
        title: 'Missing Consumer Care Contact Details',
        clauseTitle: 'Mandatory Consumer Grievance Redressal Mechanism',
        severity: 'High',
        field: 'consumerCareDetails',
        explanation: 'Rule 6(1)(n) explicitly mandates the name, address, telephone number, and email address of the person or grievance officer who can be contacted by the consumer in case of complaints.',
        finding: 'No consumer care phone number or official email was identified on the back or side display panel.',
        lawExcerpt: 'Rule 6(1)(n): Every package shall bear the name of the person or officer who can be contacted in case of consumer complaints, with telephone number and email.',
        fineAmount: '₹25,000 (First Offence under Section 36)',
        recommendation: 'Print consumer care officer designation, phone number, and valid email on the information panel.'
      },
      {
        id: 'viol-002',
        rule: 'Rule 7, Table-1',
        ruleNumber: 'Rule 7 Table-1',
        ruleReference: 'Rule 7 Table-1 of PCR, 2011',
        title: 'Font Height Less Than Statutory Minimum',
        clauseTitle: 'Minimum Font Height for 800g Commodity Package',
        severity: 'Medium',
        field: 'fontCompliance',
        explanation: 'For pre-packaged commodities with net weight between 200g and 1kg, the minimum numeral and letter height for net quantity and MRP must be at least 2.0 mm.',
        finding: 'Measured font height for net weight is 1.8 mm (prescribed minimum is 2.0 mm).',
        lawExcerpt: 'Rule 7 Table 1: Minimum height of numerals for net quantity on packages between 200g-1kg is 2.0mm for standard print.',
        fineAmount: '₹15,000 (Compounding under Section 48)',
        recommendation: 'Increase typography scale for net quantity statement to at least 2.5 mm.'
      }
    ],
    ocrTokens: [
      { id: 't1', text: 'Parle-G Gluco Biscuits', field: 'brand_generic', confidence: 0.98, box: [20, 25, 60, 20] },
      { id: 't2', text: 'Net Wt: 800g', field: 'net_quantity', confidence: 0.94, box: [45, 65, 30, 8] },
      { id: 't3', text: 'MRP Rs. 80.00', field: 'mrp', confidence: 0.97, box: [45, 75, 25, 8] }
    ]
  },
  {
    id: 'prod-003',
    name: "Lay's India's Magic Masala 50g",
    brand: "Lay's",
    category: 'Snacks & Savouries',
    barcode: '8901491101235',
    batchNumber: 'LY-4022-N',
    mfgDate: '08/2026',
    expiryDate: '12/2026',
    netQuantityDeclared: true,
    netQuantityValue: '50 g',
    mrpDeclared: true,
    mrpValue: 20.00,
    uspDeclared: false, // VIOLATION: Missing Unit Sale Price
    uspValue: '',
    manufacturerDeclared: true,
    manufacturerName: 'PepsiCo India Holdings Pvt. Ltd.',
    manufacturerAddress: 'Village Channo, Patiala-Sangrur Road, Sangrur - 148026, Punjab',
    consumerCareDetails: true,
    consumerCareContact: '1800-22-4020 | consumer.feedback@pepsico.com',
    countryOfOriginDeclared: true,
    countryOfOrigin: 'India',
    fssaiLicenseDeclared: true,
    fssaiNumber: '10014064000435',
    genericNameDeclared: true,
    genericName: 'Potato Chips',
    pdpAreaSqCm: 140,
    prescribedMinFontHeightMm: 1.0,
    actualFontHeightMm: 1.5,
    fontCompliance: true,
    complianceScore: 74,
    status: 'Non-Compliant',
    image: '/images/products/lays.png',
    violations: [
      {
        id: 'viol-003',
        rule: 'Rule 6(1)(j)',
        ruleNumber: 'Rule 6(1)(j)',
        ruleReference: 'Rule 6(1)(j) of PCR, 2011',
        title: 'Absence of Unit Sale Price (USP)',
        clauseTitle: 'Mandatory Unit Sale Price Declaration',
        severity: 'Medium',
        field: 'uspDeclared',
        explanation: 'Rule 6(1)(j) mandates declaration of the unit sale price (e.g. ₹0.40/g) along with the Maximum Retail Price to allow consumers to compare value across package sizes.',
        finding: 'MRP ₹20 is declared, but corresponding Unit Sale Price (e.g., ₹0.40 per gram) is omitted.',
        lawExcerpt: 'Rule 6(1)(j): Unit sale price in rupees and paise per g/kg/ml/l shall be declared on packages containing more than 1 unit/quantity.',
        fineAmount: '₹20,000 (Notice under Section 36)',
        recommendation: 'Print "Unit Sale Price: ₹0.40 / g" adjacent to the MRP declaration.'
      }
    ],
    ocrTokens: [
      { id: 't1', text: "Lay's Magic Masala", field: 'brand_generic', confidence: 0.99, box: [20, 20, 60, 22] },
      { id: 't2', text: 'Net Quantity: 50 g', field: 'net_quantity', confidence: 0.96, box: [30, 60, 35, 10] },
      { id: 't3', text: 'MRP: Rs. 20.00 (Incl. Taxes)', field: 'mrp', confidence: 0.98, box: [30, 72, 40, 10] }
    ]
  },
  {
    id: 'prod-004',
    name: 'Maggi 2-Minute Masala Noodles 70g',
    brand: 'Maggi',
    category: 'Instant Foods',
    barcode: '8901058852310',
    batchNumber: 'MG-8831-C',
    mfgDate: '', // VIOLATION: Missing Mfg Month/Year
    expiryDate: '02/2027',
    netQuantityDeclared: true,
    netQuantityValue: '70 g',
    mrpDeclared: true,
    mrpValue: 14.00,
    uspDeclared: true,
    uspValue: '₹0.20 / g',
    manufacturerDeclared: true,
    manufacturerName: 'Nestlé India Limited',
    manufacturerAddress: '100 / 101, World Trade Centre, Barakhamba Lane, New Delhi - 110001',
    consumerCareDetails: true,
    consumerCareContact: '1800-103-1947 | wecare@in.nestle.com',
    countryOfOriginDeclared: true,
    countryOfOrigin: 'India',
    fssaiLicenseDeclared: true,
    fssaiNumber: '10012011000168',
    genericNameDeclared: true,
    genericName: 'Instant Noodles with Seasoning',
    pdpAreaSqCm: 160,
    prescribedMinFontHeightMm: 1.0,
    actualFontHeightMm: 1.4,
    fontCompliance: true,
    complianceScore: 72,
    status: 'Non-Compliant',
    image: '/images/products/maggi.png',
    violations: [
      {
        id: 'viol-004',
        rule: 'Rule 6(1)(d)',
        ruleNumber: 'Rule 6(1)(d)',
        ruleReference: 'Rule 6(1)(d) of PCR, 2011',
        title: 'Missing Month & Year of Manufacture/Packing',
        clauseTitle: 'Date of Packing / Pre-packing Verification',
        severity: 'High',
        field: 'mfgDate',
        explanation: 'Every pre-packaged commodity must unambiguously state the month and year in which the commodity is manufactured, packed, or imported.',
        finding: 'Best before duration is present, but exact Month and Year of manufacture is missing from the printing panel.',
        lawExcerpt: 'Rule 6(1)(d): Month and year in which the commodity is manufactured or pre-packed or imported shall be clearly indicated.',
        fineAmount: '₹25,000 (Section 36 Prosecution Notice)',
        recommendation: 'Ensure online batch coder stamps both MM/YYYY manufacturing and expiry details.'
      }
    ],
    ocrTokens: [
      { id: 't1', text: 'MAGGI 2-Minute Noodles', field: 'brand_generic', confidence: 0.99, box: [15, 20, 70, 20] },
      { id: 't2', text: 'Net Quantity: 70 g', field: 'net_quantity', confidence: 0.95, box: [25, 55, 30, 8] },
      { id: 't3', text: 'MRP Rs. 14.00 (USP Re. 0.20/g)', field: 'mrp', confidence: 0.97, box: [25, 68, 50, 10] }
    ]
  },
  {
    id: 'prod-005',
    name: 'Coca-Cola Original Taste 750ml',
    brand: 'Coca-Cola',
    category: 'Beverages',
    barcode: '8901764012211',
    batchNumber: 'CC-750-994',
    mfgDate: '07/2026',
    expiryDate: '01/2027',
    netQuantityDeclared: true,
    netQuantityValue: '750 ml',
    mrpDeclared: true,
    mrpValue: 40.00,
    uspDeclared: true,
    uspValue: '₹0.053 / ml',
    manufacturerDeclared: true,
    manufacturerName: 'Hindustan Coca-Cola Beverages Pvt. Ltd.',
    manufacturerAddress: 'Plot No. 1107, Phase IV, GIDC Industrial Estate, Naroda, Ahmedabad - 382330',
    consumerCareDetails: true,
    consumerCareContact: '1800-208-2653 | indiahelpline@coca-cola.com',
    countryOfOriginDeclared: true,
    countryOfOrigin: 'India',
    fssaiLicenseDeclared: true,
    fssaiNumber: '10012026000219',
    genericNameDeclared: true,
    genericName: 'Carbonated Water',
    pdpAreaSqCm: 190,
    prescribedMinFontHeightMm: 2.0,
    actualFontHeightMm: 2.4,
    fontCompliance: true,
    complianceScore: 100,
    status: 'Compliant',
    image: '/images/products/coca-cola.png',
    violations: [],
    ocrTokens: [
      { id: 't1', text: 'Coca-Cola Carbonated Beverage', field: 'brand_generic', confidence: 0.99, box: [20, 20, 60, 22] },
      { id: 't2', text: 'Net Quantity: 750 ml', field: 'net_quantity', confidence: 0.98, box: [30, 55, 40, 10] },
      { id: 't3', text: 'MRP Rs. 40.00 (Incl. of all taxes)', field: 'mrp', confidence: 0.99, box: [30, 68, 50, 10] },
      { id: 't4', text: 'Unit Sale Price: Rs. 0.053/ml', field: 'usp', confidence: 0.95, box: [30, 80, 45, 8] },
      { id: 't5', text: 'Consumer Helpline: 1800-208-2653', field: 'consumer_care', confidence: 0.97, box: [15, 90, 55, 6] }
    ]
  }
];

export const INITIAL_INSPECTIONS = [
  {
    id: 'INSP-2026-0881',
    productId: 'prod-001',
    productName: 'Amul Pasteurised Butter 500g',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorDivision: 'Central Zone - District 1',
    inspectionDate: '2026-08-28 10:45 AM',
    location: 'Reliance Smart Superstore, MG Road, Indore',
    status: 'Compliant',
    complianceScore: 98,
    violationsCount: 0,
    violations: [],
    inspectorRemarks: 'All statutory declarations match Rule 6 & Rule 7 specifications perfectly.'
  },
  {
    id: 'INSP-2026-0882',
    productId: 'prod-002',
    productName: 'Parle-G Original Gluco Biscuits 800g',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorDivision: 'Central Zone - District 1',
    inspectionDate: '2026-08-28 11:30 AM',
    location: 'D-Mart Supermarket, Scheme 54, Indore',
    status: 'Non-Compliant',
    complianceScore: 68,
    violationsCount: 2,
    violations: INITIAL_PRODUCTS[1].violations,
    inspectorRemarks: 'Notice Form-V drafted for missing consumer care email and undersized net quantity font height.'
  },
  {
    id: 'INSP-2026-0883',
    productId: 'prod-003',
    productName: "Lay's India's Magic Masala 50g",
    inspectorName: 'Inspector Vikram Joshi',
    inspectorDivision: 'Northern Division',
    inspectionDate: '2026-08-27 03:15 PM',
    location: 'Apna Sweets & Provision Store, New Palasia, Indore',
    status: 'Non-Compliant',
    complianceScore: 74,
    violationsCount: 1,
    violations: INITIAL_PRODUCTS[2].violations,
    inspectorRemarks: 'Missing Unit Sale Price declaration. Advisory issued to store manager.'
  },
  {
    id: 'INSP-2026-0884',
    productId: 'prod-004',
    productName: 'Maggi 2-Minute Masala Noodles 70g',
    inspectorName: 'Inspector Priya Patel',
    inspectorDivision: 'Western Sector',
    inspectionDate: '2026-08-26 04:00 PM',
    location: 'Vishal Mega Mart, AB Road, Indore',
    status: 'Non-Compliant',
    complianceScore: 72,
    violationsCount: 1,
    violations: INITIAL_PRODUCTS[3].violations,
    inspectorRemarks: 'Month/Year manufacturing stamp missing from printed pack panel.'
  },
  {
    id: 'INSP-2026-0885',
    productId: 'prod-005',
    productName: 'Coca-Cola Original Taste 750ml',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorDivision: 'Central Zone - District 1',
    inspectionDate: '2026-08-25 02:20 PM',
    location: 'Big Bazaar, Treasure Island Mall, Indore',
    status: 'Compliant',
    complianceScore: 100,
    violationsCount: 0,
    violations: [],
    inspectorRemarks: 'Full statutory compliance. All 8 declarations present with verified font height.'
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr-001',
    name: 'Inspector Rajesh Sharma',
    email: 'inspector@lmcc.demo',
    role: 'inspector',
    division: 'Central Zone - District 1',
    badgeNumber: 'LM-INSP-4091',
    scansCount: 428,
    lastActive: 'Active now',
    status: 'Active'
  },
  {
    id: 'usr-002',
    name: 'Dr. Anita Verma (Director)',
    email: 'admin@lmcc.demo',
    role: 'admin',
    division: 'State Legal Metrology Headquarters',
    badgeNumber: 'LM-DIR-0012',
    scansCount: 1248,
    lastActive: '10 mins ago',
    status: 'Active'
  }
];
