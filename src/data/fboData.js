// Dedicated Initial Datasets for FBO (Food Business Operator) Compliance Portal

export const INITIAL_FBO_PROFILE = {
  businessName: 'Apex Nutrition & Agro Foods Pvt. Ltd.',
  brandName: 'Apex Naturals',
  fboId: 'FBO-IND-2024-8839',
  fssaiLicenseNo: '10020022001948',
  licenseType: 'FSSAI Central Manufacturing License',
  licenseValidity: '2027-10-15',
  licenseStatus: 'Active & Verified',
  issuingAuthority: 'FSSAI Western Regional Licensing Authority',
  businessCategory: 'Food Processing & Packaged Commodities Manufacturer',
  panNumber: 'AAACA1234F',
  gstNumber: '23AAACA1234F1Z5',
  contactPerson: 'Vikramaditya Singhania',
  designation: 'Head of Quality Assurance & Regulatory Compliance',
  email: 'fbo@lmcc.demo',
  phone: '+91 98200 54321',
  alternateEmail: 'regulatory@apexagrofoods.in',
  registeredAddress: 'Plot No. 42-B, Food Processing Special Economic Zone, Industrial Area Phase II, Indore, Madhya Pradesh - 452010',
  manufacturingUnits: [
    {
      unitId: 'UNIT-01',
      name: 'Main Processing & Packaging Plant (Indore)',
      address: 'Plot 42-B, Industrial Area Phase II, Indore, MP',
      capacity: '45,000 MT/annum',
      certifications: ['FSSAI Central', 'ISO 22000:2018', 'HACCP', 'GMP Certified']
    },
    {
      unitId: 'UNIT-02',
      name: 'Cold Storage & Warehousing Hub (Dewas)',
      address: 'Survey 118, AB Road, Dewas, MP',
      capacity: '12,000 MT',
      certifications: ['FSSAI State', 'GHP Standard']
    }
  ]
};

export const INITIAL_FBO_PRODUCTS = [
  {
    id: 'fbo-prod-101',
    name: 'Apex Pure Honey with Natural Honeycomb',
    category: 'Honey & Natural Sweeteners',
    fssaiCategory: 'Category 11.2 - Honey and other Sweeteners',
    productId: 'APX-HNY-500G',
    netQuantity: '500 g',
    mrp: '₹ 385.00 (Incl. of all taxes)',
    currentLabel: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    complianceStatus: 'Mostly Compliant',
    complianceScore: 84,
    lastAiCheck: '2026-09-01 14:20',
    openIssuesCount: 2,
    issues: [
      {
        id: 'iss-1',
        severity: 'high',
        title: 'Nutrition declaration requires review',
        description: 'Under FSSAI Labelling Regulations 2020 & Rule 6, "Added Sugars" must be explicitly quantified in g and % RDA per serving.',
        whyItMatters: 'Mandatory statutory requirement under FSSAI (Packaging & Labelling) Amendment 2020. Non-declaration attracts compounding penalty up to ₹3,00,000 under Section 52 of FSS Act.',
        recommendedCorrection: 'Add explicit "Added Sugars: 0g (0% RDA)" column to the Nutritional Information table on the Principal Display Panel.',
        evidenceSnippet: 'Current label shows "Total Carbohydrates 82g, of which Sugars 80g" without explicit "Added Sugars" breakout line.'
      },
      {
        id: 'iss-2',
        severity: 'medium',
        title: 'Allergen information may need clarification',
        description: 'Plant processes mustard and sesame on shared lines. Advisory declaration must follow standard bold font format.',
        whyItMatters: 'Mandatory under Food Safety and Standards (Labelling and Display) Regulations, 2020 Regulation 5(3)(b).',
        recommendedCorrection: 'Update caution line to bold typeface: "Allergen Advice: Made in a facility that also handles Mustard and Sesame."',
        evidenceSnippet: 'Current cautionary text is in 4pt regular gray font at bottom left corner.'
      }
    ],
    goodPoints: [
      'Manufacturer and Packer address with PIN code detected and verified.',
      'FSSAI 14-digit license logo displayed with correct 1.5mm numeral height.',
      'Green Veg Logo detected within 8mm x 8mm specification.',
      'Customer Care email and 1800 toll-free number properly stated.'
    ]
  },
  {
    id: 'fbo-prod-102',
    name: 'Apex Multi-Grain Roasted Diet Mixture',
    category: 'Savory Snacks & Ready-to-Eat',
    fssaiCategory: 'Category 15.1 - Snacks & Savoury Foods',
    productId: 'APX-SNK-200G',
    netQuantity: '200 g',
    mrp: '₹ 95.00 (USP: ₹ 0.48 / g)',
    currentLabel: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
    complianceStatus: 'Compliant',
    complianceScore: 96,
    lastAiCheck: '2026-08-28 10:15',
    openIssuesCount: 0,
    issues: [],
    goodPoints: [
      'All 8 mandatory declarations under Rule 6 PCR & FSSAI present.',
      'Nutritional Information includes energy, protein, carbohydrate, total sugars, added sugars, total fat, saturated fat, trans fat, cholesterol, and sodium with % RDA.',
      'Unit Sale Price correctly formatted.',
      'Batch No., Mfg Date, and Best Before prominently displayed.'
    ]
  },
  {
    id: 'fbo-prod-103',
    name: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    category: 'Edible Oils & Fats',
    fssaiCategory: 'Category 02.1 - Fats and Oils',
    productId: 'APX-OIL-001L',
    netQuantity: '1 Litre',
    mrp: '₹ 220.00 (USP: ₹ 0.22 / ml)',
    currentLabel: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    complianceStatus: 'Action Required',
    complianceScore: 68,
    lastAiCheck: '2026-08-25 16:45',
    openIssuesCount: 3,
    issues: [
      {
        id: 'iss-3',
        severity: 'high',
        title: 'Fortification Logo Format Incomplete',
        description: 'Mandatory "+F" logo size is smaller than required 5mm x 5mm for 1L oil bottles.',
        whyItMatters: 'Mandatory under Food Safety and Standards (Fortification of Foods) Regulations, 2018.',
        recommendedCorrection: 'Enlarge the +F Fortified Logo to minimum 7mm x 7mm on the front display panel.',
        evidenceSnippet: 'Detected +F logo height is 3.1mm on front right corner.'
      },
      {
        id: 'iss-4',
        severity: 'high',
        title: 'Official Notice #NTC-2026-088 Pending Response',
        description: 'Inspector issued notice regarding sub-minimum font size for Batch number.',
        whyItMatters: 'Overdue responses may trigger administrative compounding under Section 36.',
        recommendedCorrection: 'Submit Corrective Action Report with re-designed label proof.',
        evidenceSnippet: 'Official inspection notice dated 2026-08-22.'
      }
    ],
    goodPoints: [
      'FSSAI 14-digit license number prominently positioned.',
      'Free Fatty Acid value and SFA/MUFA/PUFA ratio clearly declared.'
    ]
  },
  {
    id: 'fbo-prod-104',
    name: 'Apex Instant Oats with Chia & Flax Seeds',
    category: 'Breakfast Cereals',
    fssaiCategory: 'Category 06.3 - Breakfast Cereals',
    productId: 'APX-OTS-400G',
    netQuantity: '400 g',
    mrp: '₹ 160.00',
    currentLabel: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80',
    complianceStatus: 'Under Review',
    complianceScore: 78,
    lastAiCheck: '2026-08-20 11:30',
    openIssuesCount: 1,
    issues: [
      {
        id: 'iss-5',
        severity: 'medium',
        title: 'Health Claim Disclaimers Required',
        description: '"Heart Healthy" claim requires statutory disclaimer linking whole grain oats to healthy cholesterol maintenance.',
        whyItMatters: 'Advertising and Claims Regulations, 2018 Regulation 4(2).',
        recommendedCorrection: 'Add statutory footnote: "A diet rich in whole grain oat soluble fibre helps maintain normal cholesterol levels when consumed as part of a balanced diet."',
        evidenceSnippet: 'Front banner states "High Fibre - Good for Heart" without reference footnote.'
      }
    ],
    goodPoints: [
      'Ingredient declaration in descending order of weight.',
      'FSSAI Logo and Organic India Jaivik Bharat Logo present.'
    ]
  }
];

export const INITIAL_FBO_NOTICES = [
  {
    id: 'NTC-2026-088',
    noticeNumber: 'FSSAI/ENF/MP/2026/088',
    date: '2026-08-22',
    issuedBy: 'Inspector Rajesh Sharma (Food Safety Officer / Metrology)',
    division: 'Indore Central Division, Food Safety & Standards Authority',
    productId: 'fbo-prod-103',
    productName: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    issue: 'Sub-minimum Batch Number Numeral Height & Fortification (+F) Logo Dimensions under FSSAI Labelling Regulations 2020 and Rule 7 PCR 2011.',
    requiredAction: 'Submit revised artwork proof demonstrating minimum 2.5mm numeral height for batch coding and minimum 5mm x 5mm for the +F fortification logo. Provide Corrective and Preventive Action (CAPA) plan with lot disposition details.',
    deadline: '2026-09-08',
    status: 'Response Pending', // 'Response Pending' | 'Submitted - Under Review' | 'Awaiting Officer Review' | 'Resolved & Closed'
    severity: 'High',
    inspectionReportRef: 'INSP-2026-4412',
    submittedResponse: null
  },
  {
    id: 'NTC-2026-042',
    noticeNumber: 'FSSAI/ENF/MP/2026/042',
    date: '2026-07-14',
    issuedBy: 'Dr. Anita Verma (DGM / Designated Officer)',
    division: 'Directorate of Food Safety & Legal Metrology, Bhopal HQ',
    productId: 'fbo-prod-101',
    productName: 'Apex Pure Honey with Natural Honeycomb',
    issue: 'Mandatory C4 Sugar and Pollen Count test certificate update required for floral claim validation.',
    requiredAction: 'Provide NABL-accredited laboratory test report conforming to FSSAI Honey Standards (Gazette Notification 2020) for batch APX-H-2601.',
    deadline: '2026-08-10',
    status: 'Resolved & Closed',
    severity: 'Medium',
    inspectionReportRef: 'INSP-2026-3108',
    submittedResponse: {
      submittedDate: '2026-08-04',
      responseStatement: 'NABL accredited test report from Shriram Institute for Industrial Research submitted showing zero C4 sugars and 98.4% pollen authenticity.',
      documentName: 'Apex_Honey_NABL_Report_C4_Sugar.pdf',
      officerRemarks: 'Document verified and accepted by Designated Officer on 2026-08-08. Notice closed without penalty.'
    }
  }
];

export const INITIAL_FBO_CORRECTIVE_ACTIONS = [
  {
    id: 'CAPA-2026-001',
    noticeId: 'NTC-2026-088',
    productId: 'fbo-prod-103',
    productName: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    currentStep: 3, // 1: Official Issue Received, 2: FBO Reviews Requirement, 3: FBO Uploads Correction, 4: FBO Submits Response, 5: Inspector Reviews, 6: DGM Approval, 7: Case Status Updated
    status: 'Drafting Response', // 'Drafting Response' | 'Awaiting Officer Review' | 'Under Inspector Review' | 'Approved & Closed'
    deadline: '2026-09-08',
    issuedDate: '2026-08-22',
    issueSummary: 'Batch numeral height (1.1mm < 2.5mm required) & Fortification logo dimensions (3.1mm < 5.0mm required).',
    rootCause: 'Pre-printed label cylinder engraving tool wear during Q2 packaging print run.',
    correctiveActionDescription: 'Re-engraved flexographic rotogravure print cylinder with 3.0mm bold typography for batch window and updated +F logo to 7.0mm x 7.0mm. Overprinting ribbon updated on line #2.',
    preventiveActionDescription: 'Implemented automated vision camera verification on packaging line #2 to reject any packet with text height below 2.5mm.',
    uploadedFiles: [
      { name: 'Apex_MustardOil_Revised_Artwork_Proof_v2.pdf', size: '2.4 MB', date: '2026-09-01' }
    ],
    officerFeedback: null
  },
  {
    id: 'CAPA-2026-002',
    noticeId: null, // Proactive Internal CAPA
    productId: 'fbo-prod-101',
    productName: 'Apex Pure Honey with Natural Honeycomb',
    currentStep: 4,
    status: 'Awaiting Officer Review',
    deadline: '2026-09-15',
    issuedDate: '2026-08-28',
    issueSummary: 'Self-identified Added Sugars declaration omission following AI Pre-Compliance Check.',
    rootCause: 'Legacy label template predated FSSAI 2020 labelling amendments.',
    correctiveActionDescription: 'Updated nutritional panel table on back label to explicitly list "Added Sugars: 0g (0% RDA)".',
    preventiveActionDescription: 'Enrolled all 14 product lines in AI Pre-Compliance validation pipeline before printing batch approvals.',
    uploadedFiles: [
      { name: 'Apex_Honey_500g_Corrected_Nutrition_Panel.pdf', size: '1.8 MB', date: '2026-08-29' }
    ],
    officerFeedback: 'Under review by Food Safety Inspector Indore Division.'
  }
];

export const INITIAL_COMPLIANCE_CALENDAR_EVENTS = [
  {
    id: 'cal-1',
    title: 'Corrective Action Response Due for Notice #NTC-2026-088',
    type: 'corrective_action',
    colorCategory: 'red', // red: Overdue/Urgent, orange: Due Soon, yellow: Upcoming, green: Completed
    status: 'Due Soon',
    date: '2026-09-08',
    time: '17:00 IST',
    product: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    description: 'Submit revised artwork proof and CAPA report to Inspector Rajesh Sharma.',
    actionRequired: 'Submit Response via FBO Portal'
  },
  {
    id: 'cal-2',
    title: 'FSSAI Annual Return (Form D-1) Submission Deadline',
    type: 'document_submission',
    colorCategory: 'orange',
    status: 'Due Soon',
    date: '2026-09-12',
    time: '23:59 IST',
    product: 'All Registered Products (Indore Plant)',
    description: 'Statutory submission of annual manufacturing & sales figures for FY 2025-26 under FSS (Licensing) Regulations.',
    actionRequired: 'Upload Signed Form D-1'
  },
  {
    id: 'cal-3',
    title: 'Surveillance Inspection - Central Processing Unit (Indore)',
    type: 'inspection',
    colorCategory: 'yellow',
    status: 'Upcoming',
    date: '2026-09-18',
    time: '10:30 IST',
    product: 'Processing Facility Unit-01',
    description: 'Routine quarterly hygiene & hygiene rating audit by State Food Safety Authority.',
    actionRequired: 'Ensure water potability certificates & pest control logs are accessible.'
  },
  {
    id: 'cal-4',
    title: 'Water Potability & Heavy Metal Lab Test Renewal',
    type: 'document_submission',
    colorCategory: 'yellow',
    status: 'Upcoming',
    date: '2026-09-25',
    time: '18:00 IST',
    product: 'Unit-01 Water Supply',
    description: 'Six-monthly NABL chemical and microbiological water analysis test submission.',
    actionRequired: 'Schedule sample collection with NABL lab'
  },
  {
    id: 'cal-5',
    title: 'FSSAI Central Manufacturing License Renewal Window Opens',
    type: 'license_renewal',
    colorCategory: 'yellow',
    status: 'Upcoming',
    date: '2027-04-15',
    time: '00:00 IST',
    product: 'License #10020022001948',
    description: 'Standard 180-day advance renewal window before expiry on 15 Oct 2027.',
    actionRequired: 'Prepare updated layout plan & NOCs'
  },
  {
    id: 'cal-6',
    title: 'Quarterly NABL Food Testing Report Submission',
    type: 'document_submission',
    colorCategory: 'green',
    status: 'Completed',
    date: '2026-08-15',
    time: '14:00 IST',
    product: 'Honey, Mixture, Oil batches',
    description: 'Quarterly microbiological and nutritional safety tests successfully validated.',
    actionRequired: 'Completed & Verified'
  }
];

export const INITIAL_FBO_DOCUMENTS = [
  {
    id: 'doc-01',
    name: 'Apex_MustardOil_Revised_Artwork_Proof_v2.pdf',
    category: 'Corrected Labels',
    product: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    version: 'v2.1',
    uploadDate: '2026-09-01',
    fileSize: '2.4 MB',
    status: 'Submitted', // 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Correction Required'
    statusNote: 'Submitted in response to Notice #NTC-2026-088. Awaiting inspector review.'
  },
  {
    id: 'doc-02',
    name: 'FSSAI_Central_License_10020022001948.pdf',
    category: 'Certificates',
    product: 'Company-wide (All Products)',
    version: 'v1.0',
    uploadDate: '2024-10-15',
    fileSize: '1.2 MB',
    status: 'Approved',
    statusNote: 'Verified by Central Licensing Authority on 2024-10-16. Valid till 2027-10-15.'
  },
  {
    id: 'doc-03',
    name: 'ISO_22000_2018_Food_Safety_Certificate.pdf',
    category: 'Certificates',
    product: 'Indore Processing Plant',
    version: 'v3.0',
    uploadDate: '2025-06-10',
    fileSize: '3.1 MB',
    status: 'Approved',
    statusNote: 'Certified by Bureau Veritas Certification.'
  },
  {
    id: 'doc-04',
    name: 'Apex_Honey_NABL_Lab_Test_Report_C4_Sugar.pdf',
    category: 'Supporting Documents',
    product: 'Apex Pure Honey with Natural Honeycomb',
    version: 'v1.0',
    uploadDate: '2026-08-04',
    fileSize: '4.8 MB',
    status: 'Approved',
    statusNote: 'Accepted by DGM Office on 2026-08-08.'
  },
  {
    id: 'doc-05',
    name: 'CAPA_Report_MustardOil_Font_Correction.pdf',
    category: 'Corrective Action Reports',
    product: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    version: 'v1.2',
    uploadDate: '2026-09-01',
    fileSize: '1.5 MB',
    status: 'Under Review',
    statusNote: 'Queued for Inspector Rajesh Sharma evaluation.'
  },
  {
    id: 'doc-06',
    name: 'Water_Potability_Microbial_Analysis_Q2_2026.pdf',
    category: 'Other Compliance Evidence',
    product: 'Unit-01 Water Supply',
    version: 'v1.0',
    uploadDate: '2026-06-20',
    fileSize: '890 KB',
    status: 'Approved',
    statusNote: 'Compliant with IS 10500 standards.'
  }
];

export const INITIAL_COMPLIANCE_HISTORY_TIMELINE = [
  {
    id: 'hist-01',
    productId: 'fbo-prod-103',
    productName: 'Apex Organic Cold Pressed Mustard Oil (1L)',
    currentStage: 'Officer Review',
    steps: [
      { stage: 'Product Uploaded', date: '2026-08-01', status: 'completed', description: 'Product metadata and initial packaging artwork registered on FBO portal.' },
      { stage: 'AI Check Completed', date: '2026-08-02', status: 'completed', description: 'AI Pre-Compliance Check flagged sub-minimum batch font size (1.1mm).' },
      { stage: 'Official Inspection', date: '2026-08-20', status: 'completed', description: 'Field inspection conducted at retail distribution point by Indore enforcement team.' },
      { stage: 'Violation Confirmed', date: '2026-08-22', status: 'completed', description: 'Officer recorded font size infraction under Rule 7 PCR & FSSAI Labelling 2020.' },
      { stage: 'Notice Received', date: '2026-08-22', status: 'completed', description: 'Notice #NTC-2026-088 issued with 15-day response deadline.' },
      { stage: 'Corrective Action Submitted', date: '2026-09-01', status: 'completed', description: 'FBO uploaded revised label artwork (v2.1) and CAPA report.' },
      { stage: 'Officer Review', date: '2026-09-02', status: 'in_progress', description: 'Inspector reviewing submitted corrections.' },
      { stage: 'DGM Decision', date: 'Pending', status: 'pending', description: 'Awaiting DGM final sign-off.' },
      { stage: 'Case Closed', date: 'Pending', status: 'pending', description: 'Formal case closure upon officer approval.' }
    ]
  },
  {
    id: 'hist-02',
    productId: 'fbo-prod-101',
    productName: 'Apex Pure Honey with Natural Honeycomb',
    currentStage: 'Case Closed',
    steps: [
      { stage: 'Product Uploaded', date: '2026-06-15', status: 'completed', description: 'Apex Pure Honey registered.' },
      { stage: 'AI Check Completed', date: '2026-06-16', status: 'completed', description: 'Score: 84/100. Added sugars flag detected.' },
      { stage: 'Official Inspection', date: '2026-07-10', status: 'completed', description: 'Market surveillance sample collected.' },
      { stage: 'Violation Confirmed', date: '2026-07-14', status: 'completed', description: 'C4 floral verification requested.' },
      { stage: 'Notice Received', date: '2026-07-14', status: 'completed', description: 'Notice #NTC-2026-042 received.' },
      { stage: 'Corrective Action Submitted', date: '2026-08-04', status: 'completed', description: 'NABL test report and corrected declaration submitted.' },
      { stage: 'Officer Review', date: '2026-08-07', status: 'completed', description: 'Officer verified zero C4 sugar purity.' },
      { stage: 'DGM Decision', date: '2026-08-08', status: 'completed', description: 'DGM approved lab findings without compounding fine.' },
      { stage: 'Case Closed', date: '2026-08-08', status: 'completed', description: 'Notice successfully closed.' }
    ]
  }
];

export const INITIAL_FBO_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'deadline',
    title: 'Corrective action deadline in 3 days',
    message: 'Notice #NTC-2026-088 for Apex Cold Pressed Mustard Oil (1L) requires response by 08 Sep 2026.',
    time: '2 hours ago',
    read: false,
    link: 'fbo-corrective-action',
    severity: 'critical'
  },
  {
    id: 'notif-2',
    type: 'review_status',
    title: 'Your submitted document is under review',
    message: 'Apex_MustardOil_Revised_Artwork_Proof_v2.pdf is currently being reviewed by Inspector Rajesh Sharma.',
    time: '5 hours ago',
    read: false,
    link: 'fbo-documents',
    severity: 'info'
  },
  {
    id: 'notif-3',
    type: 'inspector_request',
    title: 'Inspector requested additional evidence',
    message: 'Additional verification photos requested for packaging line vision camera installation.',
    time: '1 day ago',
    read: false,
    link: 'fbo-notices',
    severity: 'warning'
  },
  {
    id: 'notif-4',
    type: 'inspection_schedule',
    title: 'Official inspection scheduled',
    message: 'Quarterly surveillance inspection scheduled for Indore Processing Unit-01 on 18 Sep 2026, 10:30 AM.',
    time: '2 days ago',
    read: true,
    link: 'fbo-calendar',
    severity: 'info'
  },
  {
    id: 'notif-5',
    type: 'ai_check',
    title: 'AI Pre-Compliance Check completed',
    message: 'Label scan for Apex Multi-Grain Roasted Diet Mixture scored 96/100 (Compliant).',
    time: '3 days ago',
    read: true,
    link: 'fbo-ai-result',
    severity: 'success'
  }
];
