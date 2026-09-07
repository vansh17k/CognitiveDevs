/**
 * ============================================================================
 * LS HELPER UTILITIES & MOCK OCR GENERATOR
 * ============================================================================
 * 
 * Provides date formatting, INR currency formatting, dynamic OCR token bounding
 * generators, and sample label analysis synthesizers.
 */

import { INITIAL_PRODUCTS } from '../data/products.js';
import { evaluateProductCompliance } from './compliance.js';

/**
 * Formats a numerical value as Indian Rupee (INR) currency string.
 * e.g. 275 -> "₹275.00"
 */
export function formatINR(value) {
  if (value === undefined || value === null || isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formats standard ISO timestamp into readable officer format.
 * e.g. "2026-08-30 10:30 AM"
 */
export function formatInspectionDate(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Synthesizes automated OCR inspection result when an officer uploads a custom
 * package photo or selects a test preset.
 */
export function generateAnalysisForUpload(imageDataUrl, productNameInput, presetId) {
  const s = (productNameInput || '').trim().toLowerCase();
  const matchedPreset = (s ? INITIAL_PRODUCTS.find(p => (p.name || '').toLowerCase().includes(s)) : null)
    || (presetId ? INITIAL_PRODUCTS.find(p => p.id === presetId) : null);

  if (matchedPreset) {
    const freshId = `prod-${Date.now()}`;
    const newProduct = {
      ...matchedPreset,
      id: freshId,
      image: imageDataUrl || matchedPreset.image,
      createdAt: new Date().toISOString()
    };

    const newInspection = {
      id: `INSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: freshId,
      productName: newProduct.name,
      inspectorName: 'Inspector Rajesh Sharma',
      inspectorDivision: 'Central Zone - District 1',
      inspectionDate: formatInspectionDate(new Date()),
      location: 'Central Field Inspection Terminal, Zone 1',
      status: newProduct.status,
      complianceScore: newProduct.complianceScore,
      violationsCount: newProduct.violations.length,
      violations: newProduct.violations,
      inspectorRemarks: newProduct.status === 'Compliant'
        ? 'Verified all statutory declarations in accordance with PCR 2011.'
        : 'Automated screening detected non-compliance under Rule 6. Statutory Notice drafted.'
    };

    return { product: newProduct, inspection: newInspection };
  }

  // Generic custom uploaded package synthesis
  const cleanName = productNameInput && productNameInput.trim().length > 0 
    ? productNameInput.trim() 
    : 'Scanned Pre-Packaged Commodity';

  const mockProduct = {
    id: `prod-${Date.now()}`,
    name: cleanName,
    brand: cleanName.split(' ')[0] || 'Generic Brand',
    category: 'Packaged Food & Goods',
    barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    batchNumber: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
    mfgDate: '08/2026',
    expiryDate: '02/2027',
    netQuantityDeclared: true,
    netQuantityValue: '250 g',
    mrpDeclared: true,
    mrpValue: 95.00,
    uspDeclared: true,
    uspValue: '₹0.38 / g',
    manufacturerDeclared: true,
    manufacturerName: 'Universal Packaged Goods Industries Pvt. Ltd.',
    manufacturerAddress: 'Industrial Area Sector 4, Pithampur, MP - 454775',
    consumerCareDetails: true,
    consumerCareContact: '1800-419-0099 | support@upg-foods.in',
    countryOfOriginDeclared: true,
    countryOfOrigin: 'India',
    fssaiLicenseDeclared: true,
    fssaiNumber: '10019026000882',
    genericNameDeclared: true,
    genericName: 'Packaged Food Item',
    pdpAreaSqCm: 150,
    prescribedMinFontHeightMm: 2.0,
    actualFontHeightMm: 2.2,
    fontCompliance: true,
    image: imageDataUrl || '/images/products/amul.png',
    ocrTokens: [
      { id: 't1', text: cleanName, field: 'brand_generic', confidence: 0.97, box: [20, 20, 60, 20] },
      { id: 't2', text: 'Net Quantity: 250 g', field: 'net_quantity', confidence: 0.98, box: [30, 55, 40, 10] },
      { id: 't3', text: 'MRP Rs. 95.00 (Incl. of all taxes)', field: 'mrp', confidence: 0.96, box: [30, 68, 50, 10] },
      { id: 't4', text: 'Unit Sale Price: Rs. 0.38/g', field: 'usp', confidence: 0.94, box: [30, 80, 45, 8] }
    ]
  };

  const evalResult = evaluateProductCompliance(mockProduct);
  mockProduct.complianceScore = evalResult.complianceScore;
  mockProduct.status = evalResult.status;
  mockProduct.violations = evalResult.violations;

  const newInspection = {
    id: `INSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    productId: mockProduct.id,
    productName: mockProduct.name,
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorDivision: 'Central Zone - District 1',
    inspectionDate: formatInspectionDate(new Date()),
    location: 'Field Capture Terminal #4, District Inspection Depot',
    status: mockProduct.status,
    complianceScore: mockProduct.complianceScore,
    violationsCount: mockProduct.violations.length,
    violations: mockProduct.violations,
    inspectorRemarks: 'Custom package photographed and passed through Legal Metrology OCR engine.'
  };

  return { product: mockProduct, inspection: newInspection };
}
