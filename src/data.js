// Pure JavaScript Dataset for LexiScan

export const INITIAL_USERS = [
  {
    id: 'usr-001',
    name: 'Inspector Rajesh Sharma',
    email: 'inspector@lmcc.demo',
    role: 'inspector',
    department: 'Legal Metrology Enforcement Wing',
    designation: 'Senior Metrological Officer (SMO)',
    division: 'Indore Central Division',
    mobile: '+91 98260 12345',
    status: 'active',
    lastActive: 'Active now (Terminal #09)',
    scansCount: 342,
  },
  {
    id: 'usr-002',
    name: 'Dr. Anita Verma (DGM)',
    email: 'dgm@lmcc.demo',
    role: 'dgm',
    department: 'Directorate of Legal Metrology',
    designation: 'Deputy General Manager (DGM)',
    division: 'State Headquarters, Bhopal',
    mobile: '+91 94250 98765',
    status: 'active',
    lastActive: 'Active now (Central Command)',
    scansCount: 1205,
  },
  {
    id: 'usr-003',
    name: 'Inspector Meera Sen',
    email: 'meera.sen@lmcc.gov.in',
    role: 'inspector',
    department: 'Legal Metrology Enforcement Wing',
    designation: 'Assistant Controller',
    division: 'Ujjain Commercial Hub',
    mobile: '+91 98930 44211',
    status: 'active',
    lastActive: '1 hour ago',
    scansCount: 219,
  },
  {
    id: 'usr-004',
    name: 'Inspector V. Ramanathan',
    email: 'v.raman@lmcc.gov.in',
    role: 'inspector',
    department: 'Legal Metrology Enforcement Wing',
    designation: 'Field Inspection Inspector',
    division: 'Gwalior Industrial Zone',
    mobile: '+91 94251 11200',
    status: 'inactive',
    lastActive: '2 days ago',
    scansCount: 184,
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-001',
    title: 'Relabeling Notice & Seizure for Missing Country of Origin',
    description: 'Amul Taaza Milk 500ml batch #AT-2938 shows missing country of origin declaration and ambiguous packer address under Rule 6(1)(a). Requesting immediate seizure notice issuance and compounding summons.',
    category: 'Rule 6 Declaration Infraction',
    priority: 'High',
    location: 'Central Supermarket, Indore Division',
    date: '2026-08-30 14:30',
    inspectorId: 'usr-001',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorEmail: 'inspector@lmcc.demo',
    inspectorDivision: 'Indore Central Division',
    status: 'Under Review', // Submitted -> Pending Review -> Under Review -> Approved / Rejected -> Resolved
    productId: 'prod-2',
    productName: 'Amul Taaza Toned Milk (500ml)',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: 'Field evidence acknowledged. Legal Section drafting Section 36 seizure notice for DGM sign-off.',
    dgmActionDate: '2026-08-30 16:15',
    dgmOfficerName: 'Dr. Anita Verma (DGM)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-30 14:30', note: 'Request submitted with photo evidence by Inspector Rajesh Sharma', by: 'Inspector Rajesh Sharma' },
      { status: 'Pending Review', timestamp: '2026-08-30 14:35', note: 'Auto-routed and queued in DGM Central Review Portal', by: 'System' },
      { status: 'Under Review', timestamp: '2026-08-30 16:15', note: 'DGM reviewed lab findings and assigned legal counsel for drafting seizure order.', by: 'Dr. Anita Verma (DGM)' }
    ]
  },
  {
    id: 'REQ-2026-002',
    title: 'Sub-minimum Numeral Height on Unit Sale Price (USP)',
    description: 'Maggi 2-Min Noodles 70g packet exhibits numeral height of 1.1 mm for Unit Sale Price, violating Rule 7 Table 1 mandatory 1.5 mm requirement.',
    category: 'Font Size / Numeral Height (Rule 7)',
    priority: 'Medium',
    location: 'Mega Mart, Palasia, Indore',
    date: '2026-08-29 11:15',
    inspectorId: 'usr-001',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorEmail: 'inspector@lmcc.demo',
    inspectorDivision: 'Indore Central Division',
    status: 'Approved',
    productId: 'prod-4',
    productName: 'Maggi 2-Minute Noodles (70g)',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: 'Approved for issuing compounding notice under Section 36 of Legal Metrology Act, 2009. Fine: ₹25,000.',
    dgmActionDate: '2026-08-29 15:40',
    dgmOfficerName: 'Dr. Anita Verma (DGM)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-29 11:15', note: 'Complaint submitted by Inspector Rajesh Sharma', by: 'Inspector Rajesh Sharma' },
      { status: 'Pending Review', timestamp: '2026-08-29 11:20', note: 'Queued in DGM Central Portal', by: 'System' },
      { status: 'Under Review', timestamp: '2026-08-29 13:00', note: 'DGM initiated technical verification', by: 'Dr. Anita Verma (DGM)' },
      { status: 'Approved', timestamp: '2026-08-29 15:40', note: 'DGM approved notice for compounding issuance.', by: 'Dr. Anita Verma (DGM)' }
    ]
  },
  {
    id: 'REQ-2026-003',
    title: 'Missing Toll-Free Helpline on Imported Olive Oil',
    description: 'Imported Extra Virgin Olive Oil 1L batch lacks Indian consumer grievance address and active telephone number as mandated by Rule 6(1)(f).',
    category: 'Consumer Care Violation',
    priority: 'High',
    location: 'Freeganj Market, Ujjain',
    date: '2026-08-28 09:45',
    inspectorId: 'usr-003',
    inspectorName: 'Inspector Meera Sen',
    inspectorEmail: 'meera.sen@lmcc.gov.in',
    inspectorDivision: 'Ujjain Commercial Hub',
    status: 'Resolved',
    productId: 'prod-6',
    productName: 'Borges Extra Virgin Olive Oil (1L)',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: 'Importer furnished rectified label stickers and paid compounding fee of ₹50,000. Case closed as resolved.',
    dgmActionDate: '2026-08-29 17:00',
    dgmOfficerName: 'Dr. Anita Verma (DGM)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-28 09:45', note: 'Submitted by Inspector Meera Sen', by: 'Inspector Meera Sen' },
      { status: 'Pending Review', timestamp: '2026-08-28 10:00', note: 'Received by DGM Portal', by: 'System' },
      { status: 'Under Review', timestamp: '2026-08-28 14:00', note: 'DGM issued hearing notice to importer', by: 'Dr. Anita Verma (DGM)' },
      { status: 'Approved', timestamp: '2026-08-28 16:30', note: 'DGM approved compounding settlement order', by: 'Dr. Anita Verma (DGM)' },
      { status: 'Resolved', timestamp: '2026-08-29 17:00', note: 'Fine collected and case officially marked resolved.', by: 'Dr. Anita Verma (DGM)' }
    ]
  },
  {
    id: 'REQ-2026-004',
    title: 'Dual MRP Sticker Overwriting on Cold Drinks Case',
    description: 'Retailer found affixing secondary higher MRP sticker of ₹45 over printed manufacturer MRP of ₹38 on 750ml bottles.',
    category: 'Overcharging / Dual MRP Violation',
    priority: 'High',
    location: 'Industrial Area Zone 3, Gwalior',
    date: '2026-08-31 08:20',
    inspectorId: 'usr-004',
    inspectorName: 'Inspector V. Ramanathan',
    inspectorEmail: 'v.raman@lmcc.gov.in',
    inspectorDivision: 'Gwalior Industrial Zone',
    status: 'Pending Review',
    productId: 'prod-7',
    productName: 'Sparkling Carbonated Beverage (750ml)',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: '',
    dgmActionDate: '',
    dgmOfficerName: '',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-31 08:20', note: 'Urgent seizure request submitted by Inspector V. Ramanathan', by: 'Inspector V. Ramanathan' },
      { status: 'Pending Review', timestamp: '2026-08-31 08:21', note: 'Queued at DGM Desk for priority decision', by: 'System' }
    ]
  }
];

export const LEGAL_RULES = [
  {
    id: 'rule-006-1a',
    code: 'Rule 6(1)(a)',
    name: 'Manufacturer, Packer & Importer Identification Details',
    category: 'Rule 6 (Declarations)',
    description: 'The name and complete physical address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer, and in case of imported goods, the name and address of the importer must be declared.',
    whatToCheck: 'Verify complete physical address including street, city, state, and pin code. Incomplete addresses with just a company name or city name without full premises details are non-compliant.',
    prescribedRequirement: 'Every package shall bear the name and complete address of the manufacturer, packer, or importer printed clearly on the label.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 6(1)(a)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-006-1b',
    code: 'Rule 6(1)(b)',
    name: 'Net Quantity Declaration in Standard Metric Units',
    category: 'Rule 6 (Declarations)',
    description: 'The net quantity in terms of standard unit of weight (g/kg), measure (ml/l), or number (units/pieces) contained in the package must be declared prominently on the Principal Display Panel (PDP).',
    whatToCheck: 'Check that standard SI unit symbols (g, kg, ml, l, or N) are used without non-metric units. Ensure font size meets Rule 7 Table 1 minimums for the package display area.',
    prescribedRequirement: 'The net quantity in terms of standard unit of weight or measure or number contained in the package shall be declared on the principal display panel.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 6(1)(b) read with Rule 11',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-006-1c',
    code: 'Rule 6(1)(c)',
    name: 'Month and Year of Manufacture, Packing or Import',
    category: 'Rule 6 (Declarations)',
    description: 'The month and year in which the commodity is manufactured, pre-packed, or imported must be explicitly declared on the package.',
    whatToCheck: 'Look for "Mfg Date", "Packed On", or "Import Date" with both month and 4-digit or 2-digit year clearly stated (e.g., "08/2026" or "Aug 2026").',
    prescribedRequirement: 'The month and year in which the commodity is manufactured or pre-packed or imported shall be declared on every package.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 6(1)(c)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-006-1d',
    code: 'Rule 6(1)(d)',
    name: 'Maximum Retail Price (MRP) & Tax Inclusivity',
    category: 'Rule 6 (Declarations)',
    description: 'The retail sale price of the package shall be declared as Maximum Retail Price (MRP) inclusive of all taxes (in Indian Rupees ₹).',
    whatToCheck: 'Confirm "MRP ₹ XX.XX (inclusive of all taxes)" or "MRP Rs. XX.XX (incl. of all taxes)". Ensure no individual tax surcharge is added separately at the POS.',
    prescribedRequirement: 'The retail sale price of the package shall clearly indicate that it is the Maximum Retail Price inclusive of all taxes, with currency in Rupees.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 6(1)(d) read with Rule 18',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-006-1e',
    code: 'Rule 6(1)(e)',
    name: 'Consumer Care Contact Details & Redressal Mechanism',
    category: 'Rule 6 (Declarations)',
    description: 'Name, address, telephone number, and e-mail address of the person who can be or the office which can be contacted in case of consumer complaints must be declared.',
    whatToCheck: 'Check that at least 3 essential channels (Toll-Free/Phone number, Email ID, and complete physical postal address) are clearly printed for consumer redressal.',
    prescribedRequirement: 'Every package shall bear the name, address, telephone number and e-mail address of the person or office to be contacted for consumer grievances.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 6(1)(e)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-006-1f',
    code: 'Rule 6(1)(f)',
    name: 'Country of Origin / Country of Manufacture',
    category: 'Rule 6 (Declarations)',
    description: 'The name of the country of origin or manufacture or assembly in the case of imported goods, or domestic origin for local goods, must be stated prominently.',
    whatToCheck: 'Verify explicit statement of origin (e.g., "Country of Origin: India", "Made in India", "Manufactured in Vietnam"). Mandatory for both domestic and imported packages.',
    prescribedRequirement: 'The country of origin or manufacture or assembly in the case of imported products shall be declared prominently on the package.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 6(1)(f)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-009',
    code: 'Rule 9',
    name: 'Manner, Prominence and Legibility of Declarations',
    category: 'Rule 9 (Legibility)',
    description: 'Every declaration required on a package shall be legible, distinct, prominent, and in contrasting color with the background of the packaging or label.',
    whatToCheck: 'Check grouping of declarations on the Principal Display Panel (PDP), contrast ratio against background packaging film/carton, and ensure declarations are not obscured by folds, seams, or barcode labels.',
    prescribedRequirement: 'All statutory declarations shall appear grouped together on the principal display panel and printed with unambiguous color contrast so as to be easily readable without optical magnification.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 9 & Seventh Schedule',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-009-3',
    code: 'Rule 9(3)',
    name: 'Language & Script of Mandatory Declarations',
    category: 'Rule 9 (Legibility)',
    description: 'Declarations on the package shall be in Hindi in Devanagari script or in English. Additional regional languages are permitted provided standard English/Hindi text is not omitted or distorted.',
    whatToCheck: 'Ensure all mandatory information (MRP, Net Quantity, Dates, Manufacturer address, Consumer Care) is clearly presented in English or Hindi.',
    prescribedRequirement: 'Mandatory text must be in English or Hindi (Devanagari script). Dual language declarations are encouraged provided mandatory statutory words are complete.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 9(3)',
    status: 'Active',
    severityLevel: 'Medium',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-018-1',
    code: 'Rule 18(1)',
    name: 'Prohibition of Sale in Excess of Maximum Retail Price (MRP)',
    category: 'Rule 18 (Retail & MRP)',
    description: 'No person shall sell, distribute, deliver, or store for sale, any packaged commodity at a price exceeding the retail sale price (MRP) declared on the package.',
    whatToCheck: 'Compare scanned invoice / POS billing price against declared MRP on the package. Check for overcharging at transport hubs, malls, restaurants, or via unauthorized surcharges.',
    prescribedRequirement: 'No wholesale or retail dealer shall sell any commodity in packaged form at a price exceeding the retail sale price declared by the manufacturer or packer.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 18(1) read with Section 36(1)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-018-2',
    code: 'Rule 18(2)',
    name: 'Prohibition of Price Alteration, Smudging & Over-Stickering',
    category: 'Rule 18 (Retail & MRP)',
    description: 'No retail dealer or any other person including manufacturer, packer, or importer shall alter, obliterate, smudge, or paste a new price sticker over the retail sale price originally declared on the package.',
    whatToCheck: 'Inspect package for stickers pasted over original printed MRP, scratched out numerals, dual-pricing tags, or over-printed prices.',
    prescribedRequirement: 'No person shall obliterate, smudge, or alter the retail sale price indicated on the package. Stickering over printed MRP is a compoundable statutory violation.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 18(2) & Section 36',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'rule-018-8',
    code: 'Rule 18(8)',
    name: 'Unit Sale Price (USP) Declaration for Packaged Commodities',
    category: 'Rule 18 (Retail & MRP)',
    description: 'Every package containing net quantity > 100g/100ml, or containing more than one unit, shall declare the Unit Sale Price (USP) in ₹ per g/ml or ₹ per kg/L in close proximity to the MRP.',
    whatToCheck: 'Verify presence of Unit Sale Price (USP = Total MRP ÷ Net Quantity), rounded to two decimal places, printed adjacent to MRP in prescribed font height.',
    prescribedRequirement: 'Unit Sale Price shall be declared as "₹ XX.XX per g/ml" for net qty < 1kg/1L, and "₹ XX.XX per kg/L" for net qty ≥ 1kg/1L.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 18(8)',
    status: 'Active',
    severityLevel: 'Medium',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'sched-1',
    code: 'First Schedule',
    name: 'Standard Packaging Sizes for Specified Commodities',
    category: 'Schedules (MPE & Sizes)',
    description: 'Prescribes mandatory standardized net quantity packaging sizes for specific essential consumer commodities to prevent deceptive packaging and shrinkflation.',
    whatToCheck: 'Check if packaged commodity falls under First Schedule scheduled items (e.g. baby food, biscuits, tea, coffee, edible oils, pulses, detergent) and conforms to prescribed metric increments.',
    prescribedRequirement: 'Commodities specified in the First Schedule shall be packed only in the standard quantities prescribed therein, unless explicitly exempted by Central Government notification.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 5 & First Schedule',
    status: 'Active',
    severityLevel: 'Medium',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'sched-2',
    code: 'Second Schedule',
    name: 'Maximum Permissible Error (MPE) in Net Quantity',
    category: 'Schedules (MPE & Sizes)',
    description: 'Specifies the maximum permissible tolerance shortfall (MPE) between declared net quantity and actual gravimetric/volumetric measure determined during statutory field testing.',
    whatToCheck: 'Measure actual physical weight of package sample on verified scale, subtract tare weight, and compare deviation against Second Schedule percentage/gram limits.',
    prescribedRequirement: 'The net quantity in any individual package shall not fall short of the declared net quantity by more than the Maximum Permissible Error (MPE) specified in the Second Schedule.',
    applicableLaw: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    sectionReference: 'Rule 11 & Second Schedule',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'sec-36-1',
    code: 'Section 36(1)',
    name: 'Penal Provision: Non-Conforming / Non-Compliant Packages',
    category: 'Section 36 (Penalties)',
    description: 'Whoever manufactures, packs, imports, sells, distributes, or delivers any pre-packaged commodity which does not conform to declarations or standards shall be punishable.',
    whatToCheck: 'Applied for any violation of mandatory label declarations, missing details, improper MRP, missing dates, or unreadable font sizes.',
    prescribedRequirement: 'Punishable with fine up to ₹25,000 for the first offence; fine up to ₹50,000 for the second offence; and fine up to ₹1,00,000 or imprisonment up to 1 year, or both, for subsequent offences.',
    applicableLaw: 'The Legal Metrology Act, 2009',
    sectionReference: 'Section 36(1)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'sec-36-2',
    code: 'Section 36(2)',
    name: 'Penal Provision: Penalty for Short Measure / Deficiency in Package',
    category: 'Section 36 (Penalties)',
    description: 'Whoever manufactures, packs, sells or delivers any pre-packaged commodity containing a net quantity less than the declared quantity exceeding Maximum Permissible Error (MPE) shall be punished.',
    whatToCheck: 'Enforced when laboratory verification or gravimetric audit establishes physical shortfall beyond permissible statistical errors.',
    prescribedRequirement: 'Punishable with fine not less than ₹10,000 extending up to ₹50,000 for first offence; and fine not less than ₹50,000 extending up to ₹1,00,000 or imprisonment up to 1 year, or both, for subsequent offences.',
    applicableLaw: 'The Legal Metrology Act, 2009',
    sectionReference: 'Section 36(2)',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'sec-38',
    code: 'Section 38',
    name: 'Penal Provision: Penalty for Non-Registration of Manufacturer/Packer/Importer',
    category: 'Section 38 (Registration)',
    description: 'Whoever fails to register as a manufacturer, packer, or importer of pre-packaged commodities under Rule 27 of PCR 2011 with the Director or Controller of Legal Metrology shall be punishable with fine.',
    whatToCheck: 'Verify LM Registration Certificate number with Central Directorate or State Legal Metrology Controller database.',
    prescribedRequirement: 'Every manufacturer, packer, or importer of pre-packaged commodities shall apply for registration under Rule 27. Failure to register is penalized under Section 38 with fines up to ₹25,000.',
    applicableLaw: 'The Legal Metrology Act, 2009',
    sectionReference: 'Section 38 read with Rule 27 of PCR 2011',
    status: 'Active',
    severityLevel: 'High',
    officialSourceUrl: 'https://consumeraffairs.nic.in'
  }
];

export const FONT_SIZE_LOOKUP_MATRIX = [
  {
    areaRange: 'A ≤ 50 cm²',
    areaMin: 0,
    areaMax: 50,
    weightRange: '≤ 50 g / ml',
    minHeightNormal: '1.0 mm',
    minHeightBlown: '2.0 mm',
    notes: 'Very small sachets, miniature containers, confectionery wrappers'
  },
  {
    areaRange: '50 cm² < A ≤ 100 cm²',
    areaMin: 50,
    areaMax: 100,
    weightRange: '50 g to 200 g / ml',
    minHeightNormal: '1.5 mm',
    minHeightBlown: '3.0 mm',
    notes: 'Small pouches, bar soaps, spice packets, snack pouches'
  },
  {
    areaRange: '100 cm² < A ≤ 500 cm²',
    areaMin: 100,
    areaMax: 500,
    weightRange: '200 g to 1 kg / L',
    minHeightNormal: '2.0 mm',
    minHeightBlown: '4.0 mm',
    notes: 'Medium grocery cartons, 500ml milk pouches, 1L oil bottles'
  },
  {
    areaRange: '500 cm² < A ≤ 2500 cm²',
    areaMin: 500,
    areaMax: 2500,
    weightRange: '1 kg to 5 kg / L',
    minHeightNormal: '4.0 mm',
    minHeightBlown: '6.0 mm',
    notes: '5kg flour bags, 5L cans, bulk detergent cartons'
  },
  {
    areaRange: 'A > 2500 cm²',
    areaMin: 2500,
    areaMax: 999999,
    weightRange: '> 5 kg / L',
    minHeightNormal: '6.0 mm',
    minHeightBlown: '8.0 mm',
    notes: 'Industrial sacks (10kg-50kg), jumbo multipacks, shipping crates'
  }
];

export const MPE_SCHEDULE_TABLE = [
  { range: 'Up to 50 g or ml', mpePercent: '9.0%', mpeAbsolute: '—' },
  { range: '50 to 100 g or ml', mpePercent: '—', mpeAbsolute: '4.5 g or ml' },
  { range: '100 to 200 g or ml', mpePercent: '4.5%', mpeAbsolute: '—' },
  { range: '200 to 300 g or ml', mpePercent: '—', mpeAbsolute: '9.0 g or ml' },
  { range: '300 to 500 g or ml', mpePercent: '3.0%', mpeAbsolute: '—' },
  { range: '500 to 1000 g or ml (1 kg/L)', mpePercent: '—', mpeAbsolute: '15.0 g or ml' },
  { range: '1 kg to 10 kg / L', mpePercent: '1.5%', mpeAbsolute: '—' },
  { range: '10 kg to 15 kg / L', mpePercent: '—', mpeAbsolute: '150 g or ml' },
  { range: 'Above 15 kg / L', mpePercent: '1.0%', mpeAbsolute: '—' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Amul Taaza Toned Milk',
    brand: 'Amul',
    category: 'Food & Beverages',
    netQuantity: '500 ml',
    mrp: '₹30.00 (incl. of all taxes)',
    manufacturerName: 'Gujarat Co-operative Milk Marketing Federation Ltd.',
    manufacturerAddress: 'PO Box 10, Amul Dairy Road, Anand 388001, Gujarat, India',
    packingDate: '05/06/2025',
    expiryDate: '07/06/2025',
    countryOfOrigin: 'Not Detected',
    consumerCare: '1800-258-3333 | customercare@amul.coop',
    fssaiLicense: '10012021000071',
    batchNumber: 'LOT-TZ-8842',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    scanDate: '11/05/2025 04:30 PM',
    status: 'Needs Review',
    score: 72,
    inspectorName: 'Inspector A',
    inspectorId: 'usr-001',
    reportId: 'LEXISCAN-2025-00124',
    inspectorRemarks: 'Missing country of origin declaration on rear panel. MRP font height appears slightly condensed; sent for physical field inspection.',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Gujarat Co-operative Milk Marketing Federation Ltd., Anand, Gujarat', status: 'Compliant', confidence: 96, detected: true, remarks: 'Verified complete postal address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '500 ml', status: 'Compliant', confidence: 97, detected: true, remarks: 'Standard SI metric unit', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹30.00 (incl. of all taxes)', status: 'Compliant', confidence: 98, detected: true, remarks: 'Currency & tax clause detected', ruleCode: 'Rule 6(1)(d)' },
      { id: 'd-4', srNo: 4, name: 'Month & Year of Packing', extractedValue: '05/06/2025', status: 'Compliant', confidence: 92, detected: true, remarks: 'Valid date formatting', ruleCode: 'Rule 6(1)(c)' },
      { id: 'd-5', srNo: 5, name: 'Consumer Care Details', extractedValue: '1800-258-3333 | customercare@amul.coop', status: 'Compliant', confidence: 94, detected: true, remarks: 'Phone & email present', ruleCode: 'Rule 6(1)(e)' },
      { id: 'd-6', srNo: 6, name: 'Country of Origin', extractedValue: '—', status: 'Non-Compliant', confidence: 32, detected: false, remarks: 'Not detected on scanned package panels', ruleCode: 'Rule 6(1)(f)' },
      { id: 'd-7', srNo: 7, name: 'FSSAI License No.', extractedValue: '10012021000071', status: 'Compliant', confidence: 95, detected: true, remarks: 'Valid 14-digit license', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-8', srNo: 8, name: 'Font Size & Readability', extractedValue: 'Estimated 1.1mm (Prescribed min: 1.5mm for 500ml)', status: 'Needs Review', confidence: 74, detected: true, remarks: 'MRP font size is smaller than prescribed size', ruleCode: 'Rule 7 & Table 1' }
    ],
    violations: [
      {
        id: 'viol-001',
        title: 'Country of Origin Declaration Missing',
        type: 'Missing Declaration',
        severity: 'High',
        finding: 'Country of Origin declaration was not detected on the analyzed package panels.',
        evidenceText: 'Scanned OCR buffer: [No matching tokens for "Country of Origin" or "Made in"]',
        recommendation: 'Verify the physical original package to confirm whether the declaration is present on any un-scanned fold.',
        ruleReference: 'Rule 6(1)(f) — Legal Metrology (Packaged Commodities) Rules, 2011',
        confidence: 87,
        status: 'Flagged'
      },
      {
        id: 'viol-002',
        title: 'Font Size of MRP Smaller than Prescribed Size',
        type: 'Font Size Issue',
        severity: 'Medium',
        finding: 'The numeral height of the retail sale price is estimated at 1.1mm, whereas Rule 7 Table-1 mandates minimum 1.5mm for 500ml milk pouches.',
        evidenceText: 'OCR bounding box height: 1.12mm (Tolerance ±0.15mm)',
        recommendation: 'Perform optical caliper gauge measurement on physical sample.',
        ruleReference: 'Rule 7 & Table-1 — Minimum Height of Numerals',
        confidence: 79,
        status: 'Flagged'
      }
    ],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 12, y: 18, width: 75, height: 16, status: 'compliant', textDetected: 'Gujarat Co-operative Milk Marketing Federation Ltd.' },
      { id: 'bb-2', label: 'Net Qty: 500 ml', x: 60, y: 44, width: 28, height: 10, status: 'compliant', textDetected: 'Net Qty: 500 ml' },
      { id: 'bb-3', label: 'MRP ₹30.00', x: 60, y: 58, width: 32, height: 12, status: 'warning', textDetected: 'MRP Rs. 30.00 (Incl. of all taxes)' },
      { id: 'bb-4', label: 'Missing Country of Origin', x: 12, y: 76, width: 40, height: 14, status: 'violation', textDetected: '[Region scanned: No origin detected]' }
    ]
  },
  {
    id: 'prod-002',
    name: 'Parle-G Glucose Biscuit',
    brand: 'Parle',
    category: 'Food & Beverages',
    netQuantity: '250 g',
    mrp: '₹25.00 (incl. of all taxes)',
    manufacturerName: 'Parle Products Pvt. Ltd.',
    manufacturerAddress: 'North Level Crossing, Vile Parle East, Mumbai 400057, Maharashtra',
    packingDate: '12/05/2025',
    expiryDate: '12/11/2025',
    countryOfOrigin: 'India',
    consumerCare: '1800-22-7777 | customercare@parle.biz',
    fssaiLicense: '10013022001417',
    batchNumber: 'LOT-PG-9912',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    scanDate: '12/05/2025 10:15 AM',
    status: 'Compliant',
    score: 96,
    inspectorName: 'Inspector A',
    inspectorId: 'usr-001',
    reportId: 'LEXISCAN-2025-00125',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Parle Products Pvt. Ltd., Vile Parle East, Mumbai', status: 'Compliant', confidence: 98, detected: true, remarks: 'Verified complete postal address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '250 g', status: 'Compliant', confidence: 99, detected: true, remarks: 'Standard SI unit', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹25.00 (incl. of all taxes)', status: 'Compliant', confidence: 98, detected: true, remarks: 'Complies with pricing rules', ruleCode: 'Rule 6(1)(d)' },
      { id: 'd-4', srNo: 4, name: 'Month & Year of Packing', extractedValue: '12/05/2025', status: 'Compliant', confidence: 95, detected: true, remarks: 'Legible date format', ruleCode: 'Rule 6(1)(c)' },
      { id: 'd-5', srNo: 5, name: 'Consumer Care Details', extractedValue: '1800-22-7777 | customercare@parle.biz', status: 'Compliant', confidence: 97, detected: true, remarks: 'Valid toll-free and email', ruleCode: 'Rule 6(1)(e)' },
      { id: 'd-6', srNo: 6, name: 'Country of Origin', extractedValue: 'Country of Origin: India', status: 'Compliant', confidence: 96, detected: true, remarks: 'Declared clearly on display panel', ruleCode: 'Rule 6(1)(f)' }
    ],
    violations: [],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 10, y: 15, width: 80, height: 18, status: 'compliant', textDetected: 'Parle Products Pvt Ltd' },
      { id: 'bb-2', label: 'Net Qty: 250 g', x: 10, y: 40, width: 35, height: 12, status: 'compliant', textDetected: 'Net Qty: 250g' },
      { id: 'bb-3', label: 'MRP ₹25.00', x: 55, y: 40, width: 35, height: 12, status: 'compliant', textDetected: 'MRP Rs. 25.00 (Incl. all taxes)' },
      { id: 'bb-4', label: 'Country: India', x: 10, y: 65, width: 45, height: 12, status: 'compliant', textDetected: 'Country of Origin: India' }
    ]
  },
  {
    id: 'prod-003',
    name: 'Lays Classic Salted Potato Chips',
    brand: 'Lays',
    category: 'Food & Beverages',
    netQuantity: '52 g',
    mrp: '₹20.00 (incl. of all taxes)',
    manufacturerName: 'PepsiCo India Holdings Pvt. Ltd.',
    manufacturerAddress: 'JLPL Industrial Area, Sector 82, Mohali 140306, Punjab',
    packingDate: '11/05/2025',
    expiryDate: '11/09/2025',
    countryOfOrigin: 'India',
    consumerCare: '1800-22-4020 | consumer.feedback@pepsico.com',
    fssaiLicense: '10014064000435',
    batchNumber: 'LOT-LYS-5521',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    scanDate: '11/05/2025 02:20 PM',
    status: 'Compliant',
    score: 94,
    inspectorName: 'Inspector Meera Sen',
    inspectorId: 'usr-003',
    reportId: 'LEXISCAN-2025-00126',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'PepsiCo India Holdings Pvt. Ltd., Mohali, Punjab', status: 'Compliant', confidence: 97, detected: true, remarks: 'Verified complete postal address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '52 g (Unit Sale Price: ₹0.38/g)', status: 'Compliant', confidence: 96, detected: true, remarks: 'Net Qty & Unit Sale Price present', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹20.00 (incl. of all taxes)', status: 'Compliant', confidence: 98, detected: true, remarks: 'Complies with tax phrasing', ruleCode: 'Rule 6(1)(d)' },
      { id: 'd-4', srNo: 4, name: 'Month & Year of Packing', extractedValue: '11/05/2025', status: 'Compliant', confidence: 94, detected: true, remarks: 'Clear date', ruleCode: 'Rule 6(1)(c)' },
      { id: 'd-5', srNo: 5, name: 'Consumer Care Details', extractedValue: '1800-22-4020 | feedback@pepsico.com', status: 'Compliant', confidence: 96, detected: true, remarks: 'Verified details', ruleCode: 'Rule 6(1)(e)' },
      { id: 'd-6', srNo: 6, name: 'Country of Origin', extractedValue: 'Made in India', status: 'Compliant', confidence: 95, detected: true, remarks: 'Complies with Rule 6(1)(f)', ruleCode: 'Rule 6(1)(f)' }
    ],
    violations: [],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 15, y: 20, width: 70, height: 20, status: 'compliant', textDetected: 'PepsiCo India Holdings' },
      { id: 'bb-2', label: 'Net Qty: 52g', x: 15, y: 48, width: 30, height: 12, status: 'compliant', textDetected: '52 g' },
      { id: 'bb-3', label: 'MRP ₹20.00', x: 55, y: 48, width: 30, height: 12, status: 'compliant', textDetected: '₹20.00' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Maggi 2-Min Noodles',
    brand: 'Maggi',
    category: 'Food & Beverages',
    netQuantity: '70 g',
    mrp: '₹14.00',
    manufacturerName: 'Nestlé India Limited',
    manufacturerAddress: '100/101, World Trade Centre, Barakhamba Lane, New Delhi 110001',
    packingDate: '09/05/2025',
    countryOfOrigin: 'India',
    consumerCare: '1800-103-1947 | wecare@in.nestle.com',
    fssaiLicense: '10012011000168',
    batchNumber: 'LOT-MG-4410',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    scanDate: '09/05/2025 06:45 PM',
    status: 'Non-Compliant',
    score: 64,
    inspectorName: 'Inspector V. Ramanathan',
    inspectorId: 'usr-004',
    reportId: 'LEXISCAN-2025-00127',
    inspectorRemarks: 'MRP font height is under 1.0mm, violating minimum font height rules for small packets under Rule 7 Table-1.',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Nestlé India Limited, New Delhi', status: 'Compliant', confidence: 95, detected: true, remarks: 'Verified address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '70 g', status: 'Compliant', confidence: 94, detected: true, remarks: 'Valid SI unit', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹14.00 (tax clause missing in OCR bounding zone)', status: 'Non-Compliant', confidence: 81, detected: true, remarks: 'Missing "(incl. of all taxes)" wording', ruleCode: 'Rule 6(1)(d)' },
      { id: 'd-4', srNo: 4, name: 'Month & Year of Packing', extractedValue: '09/05/2025', status: 'Compliant', confidence: 93, detected: true, remarks: 'Valid date', ruleCode: 'Rule 6(1)(c)' },
      { id: 'd-5', srNo: 5, name: 'Font Size & Readability', extractedValue: 'Estimated 0.85mm (Prescribed min: 1.0mm)', status: 'Non-Compliant', confidence: 88, detected: true, remarks: 'MRP font size smaller than prescribed', ruleCode: 'Rule 7 & Table 1' }
    ],
    violations: [
      {
        id: 'viol-003',
        title: 'MRP Font Size Smaller Than Prescribed',
        type: 'Font Size Issue',
        severity: 'High',
        finding: 'The numeral height of the retail sale price is estimated at 0.85mm, violating Rule 7 Table-1 minimum requirement of 1.0mm.',
        evidenceText: 'Estimated numeral height: 0.85mm',
        recommendation: 'Sample product seized for laboratory measurement test.',
        ruleReference: 'Rule 7 Table-1 — Minimum Height of Letters and Numerals',
        confidence: 91,
        status: 'Flagged'
      },
      {
        id: 'viol-004',
        title: 'Mandatory Tax Clause Omission',
        type: 'Incorrect MRP',
        severity: 'Medium',
        finding: 'MRP does not prominently display the mandatory phrase "(inclusive of all taxes)".',
        evidenceText: 'Scanned text: "MRP Rs 14.00" without tax suffix',
        recommendation: 'Verify package rear flap to check if taxes clause is obscured by crimp seal.',
        ruleReference: 'Rule 6(1)(d) — Retail Sale Price Declaration',
        confidence: 84,
        status: 'Flagged'
      }
    ],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 12, y: 15, width: 75, height: 20, status: 'compliant', textDetected: 'Nestlé India Limited' },
      { id: 'bb-2', label: 'Net Qty: 70g', x: 12, y: 45, width: 30, height: 12, status: 'compliant', textDetected: '70 g' },
      { id: 'bb-3', label: 'MRP Font Violation', x: 50, y: 45, width: 40, height: 14, status: 'violation', textDetected: 'MRP Rs 14.00 [0.85mm font]' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Fresh Detergent Powder',
    brand: 'Fresh Clean',
    category: 'Household',
    netQuantity: '1 kg',
    mrp: '₹140.00 (incl. of all taxes)',
    manufacturerName: 'Sample Chemical & Household Corp.',
    manufacturerAddress: 'Industrial Area Phase 2, Sanwer Road, Indore 452015, M.P.',
    packingDate: '01/05/2025',
    countryOfOrigin: 'India',
    consumerCare: 'Not Detected',
    batchNumber: 'LOT-FC-1029',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    scanDate: '10/05/2025 11:35 AM',
    status: 'Needs Review',
    score: 75,
    inspectorName: 'Inspector A',
    inspectorId: 'usr-001',
    reportId: 'LEXISCAN-2025-00128',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Sample Chemical Corp., Indore, M.P.', status: 'Compliant', confidence: 96, detected: true, remarks: 'Verified complete postal address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '1 kg', status: 'Compliant', confidence: 97, detected: true, remarks: 'Metric kg unit', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹140.00 (incl. of all taxes)', status: 'Compliant', confidence: 98, detected: true, remarks: 'Verified', ruleCode: 'Rule 6(1)(d)' },
      { id: 'd-4', srNo: 4, name: 'Consumer Care Details', extractedValue: '—', status: 'Non-Compliant', confidence: 25, detected: false, remarks: 'Consumer helpline / email missing', ruleCode: 'Rule 6(1)(e)' }
    ],
    violations: [
      {
        id: 'viol-005',
        title: 'Consumer Care Details Missing',
        type: 'Consumer Care Details',
        severity: 'High',
        finding: 'No consumer care phone number or email address detected on outer package surfaces.',
        evidenceText: 'Scanned buffer: [No helpline, toll-free number or email address found]',
        recommendation: 'Check bottom seal or top crimp fold before issuing notice.',
        ruleReference: 'Rule 6(1)(e) — Mandatory Consumer Care Helpline',
        confidence: 89,
        status: 'Flagged'
      }
    ],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 10, y: 15, width: 80, height: 18, status: 'compliant', textDetected: 'Sample Chemical & Household Corp' },
      { id: 'bb-2', label: 'Net Qty: 1 kg', x: 10, y: 42, width: 30, height: 12, status: 'compliant', textDetected: '1 kg' },
      { id: 'bb-3', label: 'Missing Consumer Care', x: 10, y: 65, width: 80, height: 18, status: 'violation', textDetected: '[Helpline not detected]' }
    ]
  },
  {
    id: 'prod-006',
    name: 'Daily Care Herbal Shampoo',
    brand: 'Daily Care',
    category: 'Personal Care',
    netQuantity: '180 ml',
    mrp: '₹165.00 (incl. of all taxes)',
    manufacturerName: 'Apex Cosmetics India Pvt. Ltd.',
    manufacturerAddress: 'Plot 44, Electronic Complex, Pardesipura, Indore 452010',
    packingDate: '15/04/2025',
    expiryDate: '15/04/2027',
    countryOfOrigin: 'India',
    consumerCare: '1800-444-1234 | care@apexcosmetics.in',
    batchNumber: 'LOT-AP-7731',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    scanDate: '08/05/2025 03:10 PM',
    status: 'Compliant',
    score: 92,
    inspectorName: 'Inspector Meera Sen',
    inspectorId: 'usr-003',
    reportId: 'LEXISCAN-2025-00129',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Apex Cosmetics India Pvt. Ltd., Indore', status: 'Compliant', confidence: 96, detected: true, remarks: 'Verified address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '180 ml', status: 'Compliant', confidence: 97, detected: true, remarks: 'Standard ml unit', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹165.00 (incl. of all taxes)', status: 'Compliant', confidence: 98, detected: true, remarks: 'Verified', ruleCode: 'Rule 6(1)(d)' },
      { id: 'd-4', srNo: 4, name: 'Country of Origin', extractedValue: 'Country of Origin: India', status: 'Compliant', confidence: 95, detected: true, remarks: 'Verified', ruleCode: 'Rule 6(1)(f)' }
    ],
    violations: [],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 15, y: 20, width: 70, height: 18, status: 'compliant', textDetected: 'Apex Cosmetics' },
      { id: 'bb-2', label: 'Net Qty: 180 ml', x: 15, y: 45, width: 35, height: 12, status: 'compliant', textDetected: '180 ml' },
      { id: 'bb-3', label: 'MRP ₹165.00', x: 55, y: 45, width: 35, height: 12, status: 'compliant', textDetected: '₹165.00' }
    ]
  },
  {
    id: 'prod-007',
    name: 'Coca Cola Bottle 750ml',
    brand: 'Coca Cola',
    category: 'Food & Beverages',
    netQuantity: '750 ml',
    mrp: '₹40.00 (incl. of all taxes)',
    manufacturerName: 'Hindustan Coca-Cola Beverages Pvt. Ltd.',
    manufacturerAddress: 'Plot 1A, Bidadi Industrial Area, Ramanagara 562109, Karnataka',
    packingDate: '10/05/2025',
    expiryDate: '10/11/2025',
    countryOfOrigin: 'India',
    consumerCare: '1800-208-2653 | indiahelpline@coca-cola.com',
    fssaiLicense: '10012043000078',
    batchNumber: 'LOT-CC-9011',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    scanDate: '10/05/2025 11:05 AM',
    status: 'Compliant',
    score: 95,
    inspectorName: 'Inspector A',
    inspectorId: 'usr-001',
    reportId: 'LEXISCAN-2025-00130',
    declarations: [
      { id: 'd-1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Hindustan Coca-Cola Beverages Pvt. Ltd., Karnataka', status: 'Compliant', confidence: 98, detected: true, remarks: 'Verified address', ruleCode: 'Rule 6(1)(a)' },
      { id: 'd-2', srNo: 2, name: 'Net Quantity', extractedValue: '750 ml', status: 'Compliant', confidence: 99, detected: true, remarks: 'Valid standard unit', ruleCode: 'Rule 6(1)(b)' },
      { id: 'd-3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹40.00 (incl. of all taxes)', status: 'Compliant', confidence: 97, detected: true, remarks: 'Compliant MRP format', ruleCode: 'Rule 6(1)(d)' }
    ],
    violations: [],
    boundingBoxes: [
      { id: 'bb-1', label: 'Manufacturer Info', x: 15, y: 25, width: 70, height: 18, status: 'compliant', textDetected: 'Hindustan Coca-Cola' },
      { id: 'bb-2', label: 'Net Qty: 750 ml', x: 20, y: 50, width: 60, height: 14, status: 'compliant', textDetected: '750 ml' }
    ]
  }
];

export const INITIAL_INSPECTIONS = INITIAL_PRODUCTS.map((prod) => ({
  id: `insp-${prod.id}`,
  reportId: prod.reportId,
  productId: prod.id,
  productName: prod.name,
  brand: prod.brand,
  category: prod.category,
  imageUrl: prod.imageUrl,
  inspectorId: prod.inspectorId,
  inspectorName: prod.inspectorName,
  date: prod.scanDate.split(' ')[0],
  timestamp: prod.scanDate,
  status: prod.status,
  score: prod.score,
  declarationsCount: prod.declarations.length,
  compliantCount: prod.declarations.filter(d => d.status === 'Compliant').length,
  violationsCount: prod.violations.length,
  manualReviewCount: prod.declarations.filter(d => d.status === 'Needs Review').length,
  violations: prod.violations,
  declarations: prod.declarations,
  boundingBoxes: prod.boundingBoxes,
  inspectorRemarks: prod.inspectorRemarks
}));

export const SAMPLE_PRESET_PACKAGES = [
  {
    id: 'sample-milk',
    title: 'Amul Taaza Milk Pouch',
    category: 'Dairy / Pouch',
    expectedScore: 72,
    expectedStatus: 'Needs Review',
    issues: 'Missing Country of Origin, Font Size under 1.5mm',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: 'Classic test sample: Missing country of origin and borderline MRP font height.'
  },
  {
    id: 'sample-biscuit',
    title: 'Parle-G Biscuit Packet',
    category: 'Bakery / Biscuit',
    expectedScore: 96,
    expectedStatus: 'Compliant',
    issues: 'Fully Compliant with Rule 6',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    description: 'Fully compliant pack with clear MRP, net weight (250g), customer helpline and address.'
  },
  {
    id: 'sample-chips',
    title: 'Classic Potato Chips',
    category: 'Snacks / Food',
    expectedScore: 94,
    expectedStatus: 'Compliant',
    issues: 'Fully Compliant + Unit Sale Price',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp packaging containing Unit Sale Price (₹0.38/g) and all 8 legal declarations.'
  },
  {
    id: 'sample-noodles',
    title: 'Instant 2-Min Noodles',
    category: 'Packaged Food',
    expectedScore: 64,
    expectedStatus: 'Non-Compliant',
    issues: 'Font Size < 1.0mm, Missing Tax Suffix',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    description: 'Demonstrates non-compliant font size violation and missing mandatory tax clause.'
  },
  {
    id: 'sample-detergent',
    title: 'Fresh Detergent Powder 1kg',
    category: 'Household Detergent',
    expectedScore: 75,
    expectedStatus: 'Needs Review',
    issues: 'Missing Consumer Care Helpline',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    description: 'Missing 1800 consumer redressal phone number under Rule 6(1)(e).'
  },
  {
    id: 'sample-shampoo',
    title: 'Daily Care Herbal Shampoo',
    category: 'Cosmetics / Personal Care',
    expectedScore: 92,
    expectedStatus: 'Compliant',
    issues: 'Fully Compliant',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    description: 'Cosmetic bottle with batch number, month/year, manufacturing license, and MRP.'
  }
];

export const COMPLIANCE_TREND_DATA = [
  { day: '7 May', compliant: 112, nonCompliant: 42, total: 154 },
  { day: '8 May', compliant: 128, nonCompliant: 38, total: 166 },
  { day: '9 May', compliant: 145, nonCompliant: 51, total: 196 },
  { day: '10 May', compliant: 132, nonCompliant: 44, total: 176 },
  { day: '11 May', compliant: 156, nonCompliant: 48, total: 204 },
  { day: '12 May', compliant: 164, nonCompliant: 52, total: 216 },
  { day: '13 May', compliant: 139, nonCompliant: 47, total: 186 },
];

export const VIOLATION_CATEGORIES_DATA = [
  { name: 'Missing Declaration', count: 152, color: '#ef4444' },
  { name: 'Font Size / Readability', count: 96, color: '#f59e0b' },
  { name: 'Incorrect MRP Format', count: 64, color: '#eab308' },
  { name: 'Consumer Care Helpline', count: 48, color: '#3b82f6' },
  { name: 'Wrong Date Format', count: 28, color: '#8b5cf6' },
  { name: 'Others / Unclassified', count: 16, color: '#64748b' },
];

export const CATEGORY_DISTRIBUTION_DATA = [
  { name: 'Food & Beverages', value: 38, color: '#10b981' },
  { name: 'Personal Care', value: 24, color: '#065f46' },
  { name: 'Household', value: 18, color: '#047857' },
  { name: 'Pharma', value: 12, color: '#34d399' },
  { name: 'Others', value: 8, color: '#a7f3d0' },
];

export const REGIONAL_COMPLIANCE_DATA = [
  { region: 'Indore Division', complianceRate: 78.4, totalScans: 1450, status: 'High' },
  { region: 'Bhopal Division', complianceRate: 72.1, totalScans: 1230, status: 'Medium' },
  { region: 'Gwalior Division', complianceRate: 64.8, totalScans: 980, status: 'Medium' },
  { region: 'Jabalpur Division', complianceRate: 59.2, totalScans: 870, status: 'Low' },
  { region: 'Ujjain Division', complianceRate: 74.5, totalScans: 790, status: 'High' },
];
