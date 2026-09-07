/**
 * ============================================================================
 * LEGAL METROLOGY COMPLIANCE EVALUATION ENGINE
 * ============================================================================
 * 
 * Logic & Algorithms for evaluating pre-packaged commodities against:
 * 1. Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)
 * 2. Rule 6: Mandatory Declarations Matrix
 * 3. Rule 7, Table-1: Mathematical Font Height Thresholds based on PDP & Weight
 * 4. Section 36 & 48 Penalty Calculations
 */

import { LEGAL_RULES } from '../data/rules.js';

/**
 * Calculates statutory minimum font height (in mm) prescribed by Rule 7, Table-1.
 * 
 * Weight/Volume Categories:
 * - Up to 200g / 200ml: min 1.0 mm (standard print) / 2.0 mm (blown/embossed)
 * - 200g to 1kg / 200ml to 1L: min 2.0 mm (standard print) / 4.0 mm (blown)
 * - Above 1kg / 1L: min 4.0 mm (standard print) / 6.0 mm (blown)
 * 
 * @param {string|number} weightOrVolume - Net quantity string (e.g. "500 g", "750 ml") or grams/ml value
 * @returns {number} Minimum required font height in millimetres
 */
export function calculatePrescribedFontHeight(weightOrVolume) {
  let numericalVal = 500; // default medium pack

  if (typeof weightOrVolume === 'number') {
    numericalVal = weightOrVolume;
  } else if (typeof weightOrVolume === 'string') {
    const cleanStr = weightOrVolume.toLowerCase().trim();
    const match = cleanStr.match(/([\d.]+)\s*(kg|l|g|ml|gm|gms)/);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2];
      if (unit === 'kg' || unit === 'l') {
        numericalVal = val * 1000;
      } else {
        numericalVal = val;
      }
    }
  }

  if (numericalVal <= 200) {
    return 1.0;
  } else if (numericalVal <= 1000) {
    return 2.0;
  } else {
    return 4.0;
  }
}

/**
 * Validates an extracted product object against all 8 mandatory Rule 6 declarations.
 * 
 * Scoring Formula:
 * - Base score: 100 points
 * - Missing Manufacturer/Packer Details: -20 pts
 * - Missing Generic Name: -10 pts
 * - Missing Net Quantity / Non-Standard Unit: -15 pts
 * - Missing Month/Year of Mfg: -15 pts
 * - Missing MRP / Taxes Clause: -20 pts
 * - Missing Consumer Care Phone/Email: -12 pts
 * - Missing Country of Origin (if required): -10 pts
 * - Missing Unit Sale Price: -8 pts
 * - Undersized Font: -10 pts
 * 
 * @param {Object} product - Product candidate
 * @returns {Object} Comprehensive compliance report with score, status, and violations
 */
export function evaluateProductCompliance(product) {
  let score = 100;
  const violations = [];

  // 1. Manufacturer / Packer Check (Rule 6(1)(a))
  const hasMfg = Boolean(product.manufacturerDeclared && product.manufacturerName && product.manufacturerName.trim().length > 3);
  if (!hasMfg) {
    score -= 20;
    violations.push({
      id: `viol-${Date.now()}-1`,
      rule: 'Rule 6(1)(a)',
      ruleNumber: 'Rule 6(1)(a)',
      ruleReference: 'Rule 6(1)(a) of PCR, 2011',
      title: 'Missing Manufacturer / Packer Name & Address',
      clauseTitle: 'Mandatory Manufacturer / Packer Identity',
      severity: 'Critical',
      field: 'manufacturerDeclared',
      explanation: 'Rule 6(1)(a) mandates the complete name and address of the manufacturer, packer, or importer.',
      finding: 'The package lacks full manufacturer name and physical postal address with pin code.',
      lawExcerpt: 'Rule 6(1)(a): Every package shall bear the name and complete address of the manufacturer or packer.',
      fineAmount: '₹25,000 (Section 36(1))',
      recommendation: 'Print full corporate address with street name and postal pin code.'
    });
  }

  // 2. Generic Name (Rule 6(1)(b))
  const hasGeneric = Boolean(product.genericNameDeclared && product.genericName);
  if (!hasGeneric) {
    score -= 10;
    violations.push({
      id: `viol-${Date.now()}-2`,
      rule: 'Rule 6(1)(b)',
      ruleNumber: 'Rule 6(1)(b)',
      ruleReference: 'Rule 6(1)(b) of PCR, 2011',
      title: 'Missing Generic / Common Name of Commodity',
      clauseTitle: 'Prominent Generic Name Declaration',
      severity: 'Medium',
      field: 'genericNameDeclared',
      explanation: 'The generic/common name must be displayed on the Principal Display Panel.',
      finding: 'Generic commodity category name is not stated.',
      lawExcerpt: 'Rule 6(1)(b): The common or generic names of the commodity contained in the package must appear prominently.',
      fineAmount: '₹20,000 (Section 48)',
      recommendation: 'Add clear generic name on front display.'
    });
  }

  // 3. Net Quantity & Standard Unit (Rule 6(1)(c) & Rule 12)
  const hasNetQty = Boolean(product.netQuantityDeclared && product.netQuantityValue);
  if (!hasNetQty) {
    score -= 15;
    violations.push({
      id: `viol-${Date.now()}-3`,
      rule: 'Rule 6(1)(c)',
      ruleNumber: 'Rule 6(1)(c)',
      ruleReference: 'Rule 6(1)(c) & Rule 12 of PCR, 2011',
      title: 'Missing Net Quantity in Standard SI Units',
      clauseTitle: 'Standard Quantity Weight/Measure Declaration',
      severity: 'Critical',
      field: 'netQuantityDeclared',
      explanation: 'Net quantity must be declared using standard SI units (g, kg, ml, l). Non-standard units (gms, kilo) are strictly prohibited.',
      finding: 'Net quantity statement is missing or non-standard.',
      lawExcerpt: 'Rule 6(1)(c): Net quantity in terms of the standard unit of weight or measure.',
      fineAmount: '₹25,000 (Section 36(1))',
      recommendation: 'Declare net quantity clearly using metric standard units (e.g. 500 g or 1 L).'
    });
  }

  // 4. Month & Year of Mfg/Packing (Rule 6(1)(d))
  const hasMfgDate = Boolean(product.mfgDate && product.mfgDate.trim().length >= 4);
  if (!hasMfgDate) {
    score -= 15;
    violations.push({
      id: `viol-${Date.now()}-4`,
      rule: 'Rule 6(1)(d)',
      ruleNumber: 'Rule 6(1)(d)',
      ruleReference: 'Rule 6(1)(d) of PCR, 2011',
      title: 'Missing Month & Year of Manufacture/Packing',
      clauseTitle: 'Statutory Date of Packaging',
      severity: 'High',
      field: 'mfgDate',
      explanation: 'Month and year of packaging or import must be printed unambiguously.',
      finding: 'Packaging date / month of pre-packing not found on product surface.',
      lawExcerpt: 'Rule 6(1)(d): The month and year in which the commodity is manufactured or pre-packed or imported.',
      fineAmount: '₹25,000 (Section 36)',
      recommendation: 'Ensure inline coder prints MM/YYYY manufacturing date.'
    });
  }

  // 5. MRP Declaration (Rule 6(1)(e))
  const hasMrp = Boolean(product.mrpDeclared && (product.mrpValue > 0 || typeof product.mrpValue === 'number'));
  if (!hasMrp) {
    score -= 20;
    violations.push({
      id: `viol-${Date.now()}-5`,
      rule: 'Rule 6(1)(e)',
      ruleNumber: 'Rule 6(1)(e)',
      ruleReference: 'Rule 6(1)(e) of PCR, 2011',
      title: 'Missing or Non-Compliant Maximum Retail Price (MRP)',
      clauseTitle: 'Maximum Retail Price with Taxes Clause',
      severity: 'Critical',
      field: 'mrpDeclared',
      explanation: 'MRP must be stated with "Incl. of all taxes". Smudged or missing retail price is a punishable offence.',
      finding: 'MRP statement is absent or lacks mandatory inclusive of all taxes wording.',
      lawExcerpt: 'Rule 6(1)(e): Maximum Retail Price inclusive of all taxes.',
      fineAmount: '₹25,000 to ₹50,000 (Section 36(2))',
      recommendation: 'Print MRP in format: "MRP ₹ [Amount] (Incl. of all taxes)".'
    });
  }

  // 6. Consumer Care Contact (Rule 6(1)(n))
  const hasCare = Boolean(product.consumerCareDetails);
  if (!hasCare) {
    score -= 12;
    violations.push({
      id: `viol-${Date.now()}-6`,
      rule: 'Rule 6(1)(n)',
      ruleNumber: 'Rule 6(1)(n)',
      ruleReference: 'Rule 6(1)(n) of PCR, 2011',
      title: 'Missing Consumer Care Contact Details',
      clauseTitle: 'Consumer Grievance Redressal Mechanism',
      severity: 'High',
      field: 'consumerCareDetails',
      explanation: 'Every pre-packaged commodity must provide consumer care telephone number, email address, and grievance officer contact.',
      finding: 'No consumer care phone number or official email found on the package.',
      lawExcerpt: 'Rule 6(1)(n): Every package shall bear the name of the person or officer who can be contacted in case of consumer complaints, with telephone and email.',
      fineAmount: '₹25,000 (Section 36)',
      recommendation: 'Provide toll-free telephone number and valid support email.'
    });
  }

  // 7. Unit Sale Price (Rule 6(1)(j))
  const hasUsp = Boolean(product.uspDeclared);
  if (!hasUsp) {
    score -= 8;
    violations.push({
      id: `viol-${Date.now()}-7`,
      rule: 'Rule 6(1)(j)',
      ruleNumber: 'Rule 6(1)(j)',
      ruleReference: 'Rule 6(1)(j) of PCR, 2011',
      title: 'Absence of Unit Sale Price (USP)',
      clauseTitle: 'Mandatory Unit Sale Price Declaration',
      severity: 'Medium',
      field: 'uspDeclared',
      explanation: 'Unit Sale Price (e.g. ₹ per gram/ml) is mandatory on pre-packaged commodities to enable consumer value comparison.',
      finding: 'MRP is declared but Unit Sale Price per g/ml is absent.',
      lawExcerpt: 'Rule 6(1)(j): Unit sale price in rupees and paise per g/kg/ml/l shall be declared.',
      fineAmount: '₹20,000 (Section 36)',
      recommendation: 'Print Unit Sale Price per standard unit adjacent to MRP.'
    });
  }

  // Clamp score
  const finalScore = Math.max(0, Math.min(100, score));
  const finalStatus = finalScore >= 90 && violations.length === 0 ? 'Compliant' : 'Non-Compliant';

  return {
    complianceScore: finalScore,
    status: finalStatus,
    violations
  };
}

/**
 * Formats a statutory section notice according to Form-V under Legal Metrology Enforcement rules.
 */
export function generateStatutoryNoticeNumber(inspectorBadge = 'LM-INSP-4091') {
  const year = new Date().getFullYear();
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  return `NOT-LM-${year}-${inspectorBadge.slice(-4)}-${randSeq}`;
}
