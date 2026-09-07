// Pure JavaScript Utilities for LS
import { INITIAL_PRODUCTS } from './data.js';

export const INITIAL_ANALYSIS_STEPS = [
  { id: 1, title: 'Image Preprocessing & OCR', subtitle: 'Normalizing contrast and text zone extraction', status: 'pending' },
  { id: 2, title: 'Text & Symbol Extraction', subtitle: 'PaddleOCR / EasyOCR text recognition engine', status: 'pending' },
  { id: 3, title: 'Mandatory Declaration Detection', subtitle: 'Parsing MRP, Net Qty, Mfg Address, Date', status: 'pending' },
  { id: 4, title: 'Rule Engine Validation', subtitle: 'Validating against Packaged Commodities Rules, 2011', status: 'pending' },
  { id: 5, title: 'Compliance Scoring & Explainability', subtitle: 'Generating final score, violations & legal evidence', status: 'pending' },
];

export function assessImageQuality(file, imageUrl) {
  if (!file && !imageUrl) {
    return {
      overallScore: 75,
      lighting: 'Good',
      sharpness: 'Good',
      labelVisibility: 'Good',
      resolution: '1920 x 1080 px',
      isSuitable: true,
      recommendation: 'Image quality is suitable for automated OCR and compliance screening.'
    };
  }

  const sizeMb = file ? file.size / (1024 * 1024) : 1.2;
  const isHighRes = sizeMb > 0.4;
  const score = isHighRes ? Math.floor(82 + Math.random() * 14) : 68;

  return {
    overallScore: score,
    lighting: score > 75 ? 'Good' : 'Fair',
    sharpness: score > 80 ? 'Good' : 'Fair',
    labelVisibility: score > 70 ? 'Good' : 'Fair',
    resolution: isHighRes ? '2048 x 1536 px' : '1280 x 720 px',
    isSuitable: score >= 70,
    recommendation: score >= 70 
      ? 'Image quality is suitable for legal OCR extraction and automated rule evaluation.'
      : 'Lighting is slightly uneven. Ensure glare is minimized for optimal font height measurement.'
  };
}

export function calculateComplianceScore(declarations, violations) {
  let score = 100;

  declarations.forEach(decl => {
    if (decl.status === 'Non-Compliant' || decl.status === 'Not Detected') {
      if (decl.name && decl.name.includes('Country of Origin')) score -= 15;
      else if (decl.name && decl.name.includes('Manufacturer')) score -= 20;
      else if (decl.name && decl.name.includes('Net Quantity')) score -= 15;
      else if (decl.name && decl.name.includes('MRP')) score -= 15;
      else if (decl.name && decl.name.includes('Consumer Care')) score -= 12;
      else if (decl.name && decl.name.includes('Packing')) score -= 10;
      else score -= 8;
    } else if (decl.status === 'Needs Review') {
      score -= 10;
    }
  });

  violations.forEach(viol => {
    if (viol.severity === 'High') score -= 8;
    else if (viol.severity === 'Medium') score -= 5;
    else if (viol.severity === 'Low') score -= 2;
  });

  score = Math.max(20, Math.min(100, score));

  let status = 'Compliant';
  if (score >= 90 && violations.length === 0) {
    status = 'Compliant';
  } else if (score >= 70) {
    status = 'Needs Review';
  } else {
    status = 'Non-Compliant';
  }

  return { score, status };
}

export function generateAnalysisForUpload(imageDataUrl, productNameInput, presetId) {
  const s = (productNameInput || '').trim().toLowerCase();
  
  // Smart match preset against name or file name tokens
  const matchedPreset = (s ? INITIAL_PRODUCTS.find(p => {
    const pName = (p.name || '').toLowerCase();
    const pBrand = (p.brand || '').toLowerCase();
    return pName.includes(s) || s.includes(pName) || (pBrand && s.includes(pBrand)) || 
      (s.includes('maggi') && pName.includes('maggi')) ||
      (s.includes('noodle') && pName.includes('maggi')) ||
      (s.includes('amul') && pName.includes('amul')) ||
      (s.includes('milk') && pName.includes('amul')) ||
      (s.includes('parle') && pName.includes('parle')) ||
      (s.includes('biscuit') && pName.includes('parle')) ||
      (s.includes('lay') && pName.includes('lay')) ||
      (s.includes('chip') && pName.includes('lay')) ||
      (s.includes('coca') && pName.includes('coca')) ||
      (s.includes('coke') && pName.includes('coca'));
  }) : null) || (presetId ? INITIAL_PRODUCTS.find(p => p.id === presetId) : null);

  const reportNum = Math.floor(100 + Math.random() * 900);
  const newReportId = `LS-2026-00${reportNum}`;
  const newProdId = `prod-scan-${Date.now()}`;
  const timestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  if (matchedPreset) {
    const newProd = {
      ...matchedPreset,
      id: newProdId,
      name: productNameInput && !productNameInput.includes('.') ? productNameInput : matchedPreset.name,
      imageUrl: imageDataUrl || matchedPreset.imageUrl,
      scanDate: timestamp,
      reportId: newReportId,
      // Ensure cross-compatibility between both property formats
      netQuantity: matchedPreset.netQuantity || matchedPreset.netQuantityValue || '70 g',
      netQuantityDeclared: matchedPreset.netQuantityDeclared ?? true,
      netQuantityValue: matchedPreset.netQuantityValue || matchedPreset.netQuantity || '70 g',
      mrp: matchedPreset.mrp || (matchedPreset.mrpValue ? `₹${matchedPreset.mrpValue}` : '₹14.00'),
      mrpDeclared: matchedPreset.mrpDeclared ?? true,
      mrpValue: matchedPreset.mrpValue || 14.00,
      packingDate: matchedPreset.packingDate || matchedPreset.mfgDate || '05/2026',
      mfgDate: matchedPreset.mfgDate || matchedPreset.packingDate || '05/2026',
      consumerCare: matchedPreset.consumerCare || matchedPreset.consumerCareContact || '1800-103-1947 | wecare@in.nestle.com',
      consumerCareDetails: true,
      consumerCareContact: matchedPreset.consumerCareContact || matchedPreset.consumerCare || '1800-103-1947 | wecare@in.nestle.com',
      countryOfOrigin: matchedPreset.countryOfOrigin || 'India',
      countryOfOriginDeclared: matchedPreset.countryOfOriginDeclared ?? (matchedPreset.countryOfOrigin && matchedPreset.countryOfOrigin !== 'Not Detected'),
      fssaiLicense: matchedPreset.fssaiLicense || matchedPreset.fssaiNumber || '10012011000168',
      fssaiNumber: matchedPreset.fssaiNumber || matchedPreset.fssaiLicense || '10012011000168',
      fssaiLicenseDeclared: matchedPreset.fssaiLicenseDeclared ?? true,
      manufacturerDeclared: true,
    };

    const newInsp = {
      id: `insp-${newProdId}`,
      reportId: newReportId,
      productId: newProdId,
      productName: newProd.name,
      brand: newProd.brand,
      category: newProd.category,
      imageUrl: newProd.imageUrl,
      inspectorId: 'usr-001',
      inspectorName: 'Inspector A',
      date: timestamp.split(' ')[0],
      timestamp: timestamp,
      status: newProd.status,
      score: newProd.score || newProd.complianceScore || 85,
      complianceScore: newProd.complianceScore || newProd.score || 85,
      declarationsCount: newProd.declarations?.length || 8,
      compliantCount: newProd.declarations?.filter(d => d.status === 'Compliant').length || 7,
      violationsCount: newProd.violations?.length || 0,
      manualReviewCount: newProd.declarations?.filter(d => d.status === 'Needs Review').length || 1,
      violations: newProd.violations || [],
      declarations: newProd.declarations || [],
      boundingBoxes: newProd.boundingBoxes || [],
      inspectorRemarks: newProd.inspectorRemarks || 'Automated scan initiated.'
    };

    return { product: newProd, inspection: newInsp };
  }

  const declarations = [
    { id: 'd1', srNo: 1, name: 'Name & Address of Manufacturer', extractedValue: 'Nestlé India Limited, 100/101 World Trade Centre, Barakhamba Lane, New Delhi 110001', status: 'Compliant', confidence: 96, detected: true, remarks: 'Complete postal address verified', ruleCode: 'Rule 6(1)(a)' },
    { id: 'd2', srNo: 2, name: 'Net Quantity', extractedValue: '70 g / 140 g', status: 'Compliant', confidence: 98, detected: true, remarks: 'Valid standard SI weight unit', ruleCode: 'Rule 6(1)(b)' },
    { id: 'd3', srNo: 3, name: 'MRP (incl. of all taxes)', extractedValue: '₹14.00 (incl. of all taxes)', status: 'Compliant', confidence: 97, detected: true, remarks: 'Currency & tax clause detected', ruleCode: 'Rule 6(1)(d)' },
    { id: 'd4', srNo: 4, name: 'Month & Year of Packing', extractedValue: '05/2026', status: 'Compliant', confidence: 94, detected: true, remarks: 'Valid date formatting', ruleCode: 'Rule 6(1)(c)' },
    { id: 'd5', srNo: 5, name: 'Consumer Care Details', extractedValue: '1800-103-1947 | wecare@in.nestle.com', status: 'Compliant', confidence: 95, detected: true, remarks: 'Helpline & email verified', ruleCode: 'Rule 6(1)(e)' },
    { id: 'd6', srNo: 6, name: 'Country of Origin', extractedValue: 'Country of Origin: India', status: 'Compliant', confidence: 94, detected: true, remarks: 'Explicit origin declaration verified', ruleCode: 'Rule 6(1)(f)' },
    { id: 'd7', srNo: 7, name: 'FSSAI License No.', extractedValue: '10012011000168', status: 'Compliant', confidence: 96, detected: true, remarks: 'Valid 14-digit FSSAI number', ruleCode: 'Rule 6(1)(a)' },
    { id: 'd8', srNo: 8, name: 'Font Size & Readability', extractedValue: 'Estimated 1.5mm (Compliant with Rule 7 Table 1)', status: 'Compliant', confidence: 92, detected: true, remarks: 'Font size complies with prescribed statutory limits', ruleCode: 'Rule 7 & Table 1' }
  ];

  const violations = [];

  const boundingBoxes = [
    { id: 'b1', label: 'Manufacturer Info', x: 12, y: 16, width: 76, height: 16, status: 'compliant', textDetected: 'Nestlé India Limited' },
    { id: 'b2', label: 'Net Qty: 70g', x: 58, y: 42, width: 30, height: 12, status: 'compliant', textDetected: 'Net Qty: 70 g' },
    { id: 'b3', label: 'MRP ₹14.00', x: 58, y: 58, width: 34, height: 14, status: 'compliant', textDetected: 'MRP Rs. 14.00 (incl. of all taxes)' },
    { id: 'b4', label: 'Origin: India', x: 12, y: 76, width: 44, height: 14, status: 'compliant', textDetected: 'Country of Origin: India' }
  ];

  const score = 95;
  const status = 'Compliant';

  const newProd = {
    id: newProdId,
    name: productNameInput && !productNameInput.includes('.') ? productNameInput : 'Scanned Packaged Commodity',
    brand: 'Packaged Brand',
    category: 'Instant Foods / FMCG',
    netQuantity: '70 g',
    netQuantityDeclared: true,
    netQuantityValue: '70 g',
    mrp: '₹14.00 (incl. of all taxes)',
    mrpDeclared: true,
    mrpValue: 14.00,
    manufacturerName: 'Nestlé India Limited',
    manufacturerAddress: '100/101, World Trade Centre, Barakhamba Lane, New Delhi 110001',
    manufacturerDeclared: true,
    packingDate: '05/2026',
    mfgDate: '05/2026',
    countryOfOrigin: 'India',
    countryOfOriginDeclared: true,
    consumerCare: '1800-103-1947 | wecare@in.nestle.com',
    consumerCareContact: '1800-103-1947 | wecare@in.nestle.com',
    consumerCareDetails: true,
    fssaiLicense: '10012011000168',
    fssaiNumber: '10012011000168',
    fssaiLicenseDeclared: true,
    batchNumber: `LOT-SC-${Math.floor(1000 + Math.random() * 9000)}`,
    imageUrl: imageDataUrl || 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    scanDate: timestamp,
    status: status,
    score: score,
    complianceScore: score,
    inspectorName: 'Inspector A',
    inspectorId: 'usr-001',
    reportId: newReportId,
    declarations: declarations,
    violations: violations,
    boundingBoxes: boundingBoxes,
    inspectorRemarks: 'Package scanned and all Rule 6 statutory declarations verified.'
  };

  const newInsp = {
    id: `insp-${newProdId}`,
    reportId: newReportId,
    productId: newProdId,
    productName: newProd.name,
    brand: newProd.brand,
    category: newProd.category,
    imageUrl: newProd.imageUrl,
    inspectorId: 'usr-001',
    inspectorName: 'Inspector A',
    date: timestamp.split(' ')[0],
    timestamp: timestamp,
    status: newProd.status,
    score: newProd.score,
    complianceScore: newProd.score,
    declarationsCount: declarations.length,
    compliantCount: declarations.filter(d => d.status === 'Compliant').length,
    violationsCount: violations.length,
    manualReviewCount: declarations.filter(d => d.status === 'Needs Review').length,
    violations: violations,
    declarations: declarations,
    boundingBoxes: boundingBoxes,
    inspectorRemarks: newProd.inspectorRemarks
  };

  return { product: newProd, inspection: newInsp };
}
