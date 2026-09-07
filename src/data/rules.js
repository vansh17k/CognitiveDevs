/**
 * ============================================================================
 * LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011 - STATUTORY LIBRARY
 * ============================================================================
 * 
 * This module encodes the complete legal text, verification criteria,
 * statutory authorities, and compounding penalties under the Legal Metrology
 * Act, 2009 & PCR, 2011.
 * 
 * Rule Hierarchy:
 * - Rule 6: Mandatory Declarations on Pre-packaged Commodities
 * - Rule 7: Principal Display Panel (PDP) & Font Height Requirements
 * - Rule 9: Manner in which declaration shall be made
 * - Rule 12: Declarations of Quantity (SI units & permissible abbreviations)
 * - Section 36: Penal provisions for selling non-standard packages
 */

export const LEGAL_RULES = [
  {
    code: 'Rule 6(1)(a)',
    name: 'Name and Address of the Manufacturer / Packer / Importer',
    category: 'Manufacturer Identity',
    sectionRef: 'Section 18 & 36 of Legal Metrology Act, 2009',
    description: 'Every package shall bear the name and complete address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer.',
    whatToCheck: 'Must contain full street address, industrial area, city, state, and pin code. Post box addresses alone are non-compliant.',
    penalty: '₹25,000 fine for first offence; up to ₹50,000 for second offence; imprisonment up to 1 year for subsequent offences.',
    minFontHeightMm: 1.0,
    criticality: 'High',
    sampleCompliant: 'Manufactured by: ABC Foods Ltd., Plot 12, Sector 5, Manesar, Haryana - 122050',
    sampleViolation: 'Manufactured by: ABC Foods Ltd. (No address/pincode provided)'
  },
  {
    code: 'Rule 6(1)(b)',
    name: 'Generic or Common Name of Commodity',
    category: 'Product Identification',
    sectionRef: 'Rule 6(1)(b) of PCR, 2011',
    description: 'The common or generic name of the commodity contained in the package must be prominently displayed on the Principal Display Panel.',
    whatToCheck: 'Brand name cannot substitute generic name (e.g. if brand is "Oreo", generic name "Sandwich Biscuits" must be clearly stated).',
    penalty: '₹20,000 compounding fee under Section 48.',
    minFontHeightMm: 1.0,
    criticality: 'Medium',
    sampleCompliant: 'Generic Name: Roasted Cashew Nuts',
    sampleViolation: 'Brand: Royal Crunchy (No generic name of product provided)'
  },
  {
    code: 'Rule 6(1)(c)',
    name: 'Net Quantity in Standard Units of Measurement',
    category: 'Quantity & Weights',
    sectionRef: 'Rule 6(1)(c), Rule 12 & Second Schedule',
    description: 'The net quantity in terms of standard unit of weight or measure (g, kg, ml, l, m) or number of commodities contained in the package.',
    whatToCheck: 'Non-standard abbreviations like "gms", "grm", "kilo", "ltr", "ml." are strictly prohibited. Permissible: "g", "kg", "ml", "l". Must include numeral and unit.',
    penalty: '₹25,000 fine for non-standard quantity declaration under Section 36(1).',
    minFontHeightMm: 2.0,
    criticality: 'Critical',
    sampleCompliant: 'Net Quantity: 500 g  or  Net Qty: 1 L',
    sampleViolation: 'Net Weight: 500 gms (Illegal unit abbreviation) or Net Wt: 500 (Missing unit)'
  },
  {
    code: 'Rule 6(1)(d)',
    name: 'Month and Year of Manufacture / Packing / Import',
    category: 'Batch & Date Marking',
    sectionRef: 'Rule 6(1)(d) of PCR, 2011',
    description: 'The month and year in which the commodity is manufactured or pre-packed or imported shall be clearly indicated.',
    whatToCheck: 'Must be in MM/YYYY, Month YYYY, or DD/MM/YYYY format. "Best before" date cannot substitute the manufacturing date.',
    penalty: '₹25,000 compounding notice.',
    minFontHeightMm: 1.0,
    criticality: 'High',
    sampleCompliant: 'Mfg Date: 08/2026  or  Packed: August 2026',
    sampleViolation: 'Best Before 6 Months from Packaging (Without actual Mfg date)'
  },
  {
    code: 'Rule 6(1)(e)',
    name: 'Maximum Retail Price (MRP) - Inclusive of all Taxes',
    category: 'Pricing & Consumer Protection',
    sectionRef: 'Rule 6(1)(e) & Section 36(2) of Legal Metrology Act',
    description: 'The retail sale price of the package shall clearly state "Maximum Retail Price" or "MRP Rs." / "₹" followed by the amount and the mandatory words "(Inclusive of all taxes)".',
    whatToCheck: 'Must explicitly state "Incl. of all taxes" or "Inclusive of all taxes". Smudging, alteration, or dual MRP stickers are strictly punishable.',
    penalty: '₹20,000 to ₹50,000 fine. Overcharging above MRP invites criminal prosecution.',
    minFontHeightMm: 2.0,
    criticality: 'Critical',
    sampleCompliant: 'MRP ₹ 150.00 (Incl. of all taxes)',
    sampleViolation: 'MRP: Rs. 150 (Taxes extra) or Altered MRP sticker placed over original'
  },
  {
    code: 'Rule 6(1)(j)',
    name: 'Unit Sale Price (USP) Declaration',
    category: 'Pricing Transparency',
    sectionRef: 'Rule 6(1)(j) introduced vide PCR Amendment 2021',
    description: 'Declaration of Unit Sale Price in rupees and paise per gram, per kilogram, per millilitre, per litre, or per number for package comparison.',
    whatToCheck: 'Mandatory on commodities where package contains more than 1 quantity. e.g. For a 250g pack priced at ₹50, USP must be declared as "₹0.20 / g" or "₹200.00 / kg".',
    penalty: '₹20,000 fine under Section 36.',
    minFontHeightMm: 1.0,
    criticality: 'Medium',
    sampleCompliant: 'Unit Sale Price: ₹ 0.40 / g',
    sampleViolation: 'MRP ₹ 40 declared, but Unit Sale Price completely omitted.'
  },
  {
    code: 'Rule 6(1)(n)',
    name: 'Consumer Care & Grievance Contact Information',
    category: 'Consumer Redressal',
    sectionRef: 'Rule 6(1)(n) of PCR, 2011',
    description: 'The name, address, telephone number, and email address of the person or office that can be contacted in case of consumer complaints.',
    whatToCheck: 'Must provide at least (1) Official designation/name, (2) Postal address, (3) Telephone / Toll-free number, and (4) Valid email ID.',
    penalty: '₹25,000 fine under Section 36.',
    minFontHeightMm: 1.0,
    criticality: 'High',
    sampleCompliant: 'Consumer Care: Manager, Customer Support, Address: [...], Toll-Free: 1800-111-222, Email: help@brand.in',
    sampleViolation: 'For complaints contact manager (No phone number or email provided)'
  },
  {
    code: 'Rule 6(1)(m)',
    name: 'Country of Origin for Imported Commodities',
    category: 'Import Compliance',
    sectionRef: 'Rule 6(1)(m) of PCR, 2011',
    description: 'The name of the country of origin or manufacture or assembly shall be mentioned on the package in clear English or Hindi letters.',
    whatToCheck: 'Mandatory for all goods manufactured outside India. Must clearly state "Country of Origin: [Country Name]".',
    penalty: '₹25,000 fine and product seizure.',
    minFontHeightMm: 1.0,
    criticality: 'High',
    sampleCompliant: 'Country of Origin: Vietnam | Imported by: ABC Imports India Pvt Ltd',
    sampleViolation: 'Imported product without specifying Country of Origin'
  },
  {
    code: 'Rule 7 Table-1',
    name: 'Principal Display Panel (PDP) & Font Height Standards',
    category: 'Typography & Readability',
    sectionRef: 'Rule 7 & Table-1 of PCR, 2011',
    description: 'Minimum height of numerals and letters for net quantity and mandatory declarations based on package size and PDP area.',
    whatToCheck: 'Up to 200g/200ml: min 1.0mm; 200g-1kg / 200ml-1L: min 2.0mm; Above 1kg/1L: min 4.0mm (double for blown/embossed letters).',
    penalty: '₹15,000 compounding fee.',
    minFontHeightMm: 2.0,
    criticality: 'Medium',
    sampleCompliant: '500g package with 2.5mm font height for Net Qty and MRP',
    sampleViolation: '1kg package with tiny 1.2mm font height for Net Qty'
  }
];
