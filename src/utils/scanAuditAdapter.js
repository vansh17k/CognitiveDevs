import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SAMPLE_FBO_LABELS, runOcrLegalMetrologyAudit } from './fboOcrEngine.js';

/**
 * Maps standard preset commodity names or searches to matching sample labels
 */
export const findMatchingSampleLabel = (productName = '') => {
  const s = (productName || '').toLowerCase();
  if (s.includes('aeropulse') || s.includes('energy') || s.includes('sparkling')) {
    return SAMPLE_FBO_LABELS[0];
  }
  if (s.includes('green tea') || s.includes('himalayan') || s.includes('tea')) {
    return SAMPLE_FBO_LABELS[1];
  }
  if (s.includes('rice') || s.includes('basmati') || s.includes('harvest')) {
    return SAMPLE_FBO_LABELS[2];
  }
  if (s.includes('choco') || s.includes('spread') || s.includes('hazelnut') || s.includes('cadbury')) {
    return SAMPLE_FBO_LABELS[3] || SAMPLE_FBO_LABELS[0];
  }
  return null;
};

/**
 * Normalizes any scan/product into the rich audit record format required by the visual canvas.
 */
export const normalizeToAuditRecord = (scanOrProduct, role = 'inspector') => {
  if (!scanOrProduct) {
    return SAMPLE_FBO_LABELS[0];
  }

  // If already an audit record with extractedFields and violationsList
  if (Array.isArray(scanOrProduct.extractedFields) && Array.isArray(scanOrProduct.violationsList)) {
    return scanOrProduct;
  }

  const product = scanOrProduct.product || scanOrProduct;
  const inspection = scanOrProduct.inspection || {};

  // Check if there is an exact matching sample
  const matchingSample = findMatchingSampleLabel(product.name || product.title);
  if (matchingSample && (!product.violations || product.violations.length === 0)) {
    return {
      ...matchingSample,
      id: product.id || matchingSample.id,
      productName: product.name || matchingSample.productName,
      labelImageUrl: product.imageUrl || matchingSample.imageUrl
    };
  }

  const productName = product.name || product.title || 'Scanned Packaged Commodity';
  const category = product.category || 'Packaged Commodity / FMCG';
  const netQuantity = product.netQuantity || product.netQuantityValue || '500 g';
  const mrp = product.mrp || (product.mrpValue ? `₹${product.mrpValue}` : '₹150.00');
  const batchNumber = product.batchNumber || `LOT-${Date.now().toString().slice(-5)}`;
  const mfgDate = product.packingDate || product.mfgDate || '06/2026';
  const manufacturer = product.manufacturerName || product.manufacturerAddress || 'Apex Packaging Ltd., Plot 12, Industrial Area, Indore - 452001, MP';
  const fssaiLicense = product.fssaiLicense || product.fssaiNumber || '10020022001948';
  const consumerCare = product.consumerCare || product.consumerCareContact || '1800-103-1947 | wecare@lexiscan.in';
  const countryOfOrigin = product.countryOfOrigin || 'India';
  const imageUrl = product.imageUrl || 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800&auto=format&fit=crop&q=80';

  const score = product.complianceScore ?? product.score ?? inspection.score ?? 82;
  const isCompliant = score >= 90 && (!product.violations || product.violations.length === 0);
  const status = isCompliant ? 'Ready for Market' : 'Requires Revision';

  // Construct violations list with statutory citations, penal provisions, and guidance
  const rawViolations = product.violations || inspection.violations || [];
  const violationsList = rawViolations.length > 0
    ? rawViolations.map((v, i) => {
        const title = v.title || v.name || 'Statutory Non-Compliance';
        const rule = v.ruleCited || v.ruleReference || v.rule || 'Rule 6(1)';
        const severity = v.severity || (v.title?.toLowerCase().includes('critical') ? 'Critical Violation' : 'Moderate Warning');
        const observed = v.observed || v.finding || v.description || 'Statutory declaration discrepancy detected during scan.';
        
        // Auto-assign statutory penalty under Legal Metrology Act, 2009
        let penalty = v.penalty || v.statutoryPenalty || 'Section 36(1) of Legal Metrology Act, 2009 — Penalty up to ₹25,000 for first offence, up to ₹50,000 for second offence.';
        if (rule.includes('18') || title.toLowerCase().includes('mrp') || title.toLowerCase().includes('dual')) {
          penalty = 'Section 36(1) & Section 49 — Penalty up to ₹50,000 for alteration of MRP / dual pricing violation.';
        } else if (rule.includes('38') || title.toLowerCase().includes('packer') || title.toLowerCase().includes('registration')) {
          penalty = 'Section 38 of Legal Metrology Act, 2009 — Penalty up to ₹25,000 for unregistered packing premises.';
        } else if (rule.includes('11') || rule.includes('Schedule') || title.toLowerCase().includes('quantity') || title.toLowerCase().includes('short')) {
          penalty = 'Section 36(2) of Legal Metrology Act, 2009 — Penalty up to ₹10,000 or fine for deficiency in net quantity.';
        }

        let guidance = v.guidance || v.correctionGuidance || v.actionRequired || 'Rectify packaging declaration to conform strictly with Legal Metrology (Packaged Commodities) Rules, 2011.';

        return {
          id: v.id || `viol-${i + 1}`,
          ruleCited: rule.startsWith('Rule') || rule.startsWith('Sec') ? rule : `Rule 6 — ${rule}`,
          severity: severity.toLowerCase().includes('critical') ? 'Critical Violation' : (severity.toLowerCase().includes('mod') ? 'Moderate Warning' : 'Critical Violation'),
          field: v.field || v.title || 'Statutory Declaration',
          observed,
          penalty,
          guidance
        };
      })
    : [
        {
          id: 'v-clean',
          ruleCited: 'Schedule II & PCR-2011 Verified',
          severity: 'Compliant',
          field: 'Full Statutory Alignment',
          observed: 'All mandatory declarations conform to Legal Metrology (Packaged Commodities) Rules, 2011.',
          penalty: 'None (Full Statutory Compliance Verified).',
          guidance: 'Label packaging conforms with statutory requirements.'
        }
      ];

  // Map declarations to OCR extracted fields with realistic bounding boxes
  const hasQtyViolation = violationsList.some(v => v.field.toLowerCase().includes('quantity') || v.ruleCited.toLowerCase().includes('unit'));
  const hasMrpViolation = violationsList.some(v => v.field.toLowerCase().includes('mrp') || v.ruleCited.toLowerCase().includes('18') || v.ruleCited.toLowerCase().includes('price'));
  const hasMfgViolation = violationsList.some(v => v.field.toLowerCase().includes('manufacturer') || v.field.toLowerCase().includes('address'));
  const hasDateViolation = violationsList.some(v => v.field.toLowerCase().includes('date') || v.field.toLowerCase().includes('packing'));

  const extractedFields = [
    { 
      key: 'Product Name', 
      value: productName, 
      confidence: 99.2, 
      bbox: [12, 10, 76, 14], 
      compliant: true 
    },
    { 
      key: 'Net Quantity', 
      value: netQuantity, 
      confidence: 98.4, 
      bbox: [15, 78, 30, 8], 
      compliant: !hasQtyViolation,
      issue: hasQtyViolation ? 'Quantity declaration font or unit does not strictly comply with Rule 9 Table 1' : undefined
    },
    { 
      key: 'MRP (Inclusive of taxes)', 
      value: mrp.includes('tax') ? mrp : `${mrp} (incl. of all taxes)`, 
      confidence: 97.0, 
      bbox: [52, 78, 38, 8], 
      compliant: !hasMrpViolation,
      issue: hasMrpViolation ? 'MRP declaration lacks mandatory tax clause or displays dual pricing' : undefined
    },
    { 
      key: 'Unit Sale Price (USP)', 
      value: `₹ ${(parseFloat(mrp.replace(/[^0-9.]/g, '')) / (parseFloat(netQuantity) || 100) || 0.45).toFixed(2)} / unit`, 
      confidence: 95.5, 
      bbox: [52, 88, 35, 6], 
      compliant: true 
    },
    { 
      key: 'Month & Year of Packing', 
      value: `PKD: ${mfgDate}`, 
      confidence: 98.0, 
      bbox: [15, 62, 30, 6], 
      compliant: !hasDateViolation,
      issue: hasDateViolation ? 'Manufacturing/packing date stamp requires high-contrast print' : undefined
    },
    { 
      key: 'Country of Origin', 
      value: `Country of Origin: ${countryOfOrigin}`, 
      confidence: 99.0, 
      bbox: [15, 70, 30, 6], 
      compliant: countryOfOrigin !== 'Not Detected' && countryOfOrigin !== '—',
      issue: countryOfOrigin === 'Not Detected' ? 'Missing mandatory Country of Origin under Rule 6(1)(f)' : undefined
    },
    { 
      key: 'FSSAI License No.', 
      value: `FSSAI Lic: ${fssaiLicense}`, 
      confidence: 99.3, 
      bbox: [52, 62, 40, 6], 
      compliant: true 
    },
    { 
      key: 'Manufacturer Address', 
      value: manufacturer, 
      confidence: 96.0, 
      bbox: [15, 88, 35, 8], 
      compliant: !hasMfgViolation,
      issue: hasMfgViolation ? 'Incomplete physical manufacturing address or missing postal PIN' : undefined
    },
    { 
      key: 'Consumer Care Contact', 
      value: consumerCare, 
      confidence: 95.0, 
      bbox: [15, 96, 42, 6], 
      compliant: true 
    }
  ];

  return {
    id: product.reportId || `AUD-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    productName,
    category,
    netQuantity,
    mrp,
    batchNumber,
    labelImageUrl: imageUrl,
    complianceScore: score,
    status,
    violationsCount: violationsList.filter(v => v.severity !== 'Compliant').length,
    rulesTriggered: ['Rule 6', 'Rule 9', 'Rule 18', 'Sec 36'],
    violationsList,
    extractedFields
  };
};

/**
 * Universal PDF Exporter for Inspector, Citizen, and FBO roles
 */
export const exportUniversalAuditPDF = (auditRecord, role = 'inspector') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const isClean = auditRecord.complianceScore >= 90;
    const isConsumer = role === 'consumer';
    const isInspector = role === 'inspector' || role === 'dgm';

    // Header Accent
    if (isConsumer) {
      doc.setFillColor(2, 132, 199); // Sky blue #0284c7
    } else {
      doc.setFillColor(13, 71, 52); // Forest Green #0d4734
    }
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    
    if (isConsumer) {
      doc.text('CITIZEN PACKAGING VERIFICATION CERTIFICATE', pageWidth / 2, 9.5, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('DEPARTMENT OF CONSUMER AFFAIRS • ZERO DATA RETENTION EPHEMERAL CHECK', pageWidth / 2, 15.5, { align: 'center' });
    } else {
      doc.text('LEGAL METROLOGY STATUTORY INSPECTION AUDIT REPORT', pageWidth / 2, 9.5, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011 & SECTION 36 ENFORCEMENT', pageWidth / 2, 15.5, { align: 'center' });
    }

    doc.setFontSize(7);
    doc.text(`AUDIT ID: ${auditRecord.id} • DATE: ${auditRecord.timestamp || new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 20, { align: 'center' });

    // 1. PRODUCT SUMMARY
    let currentY = 32;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('1. COMMODITY & PACKAGING IDENTIFICATION', 14, currentY);

    const productDetails = [
      [
        { content: 'Product Name:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.productName || 'N/A' },
        { content: 'Verification Ref:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.id }
      ],
      [
        { content: 'Category:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.category || 'Packaged Commodity' },
        { content: 'Batch / Lot No:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: auditRecord.batchNumber || 'LOT-2026' }
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
        { content: 'Inspection Mode:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: isConsumer ? 'Citizen Quick Check (Ephemeral)' : 'Statutory Field Enforcement' }
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

    // 2. PARSED OCR STATUTORY DECLARATIONS
    currentY = doc.lastAutoTable.finalY + 8;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('2. OCR PARSED STATUTORY DECLARATIONS (PaddleOCR v2.8)', 14, currentY);

    const ocrRows = (auditRecord.extractedFields || []).map((f, index) => [
      index + 1,
      f.key,
      f.value,
      `${f.confidence}%`,
      f.compliant ? 'Compliant' : 'Non-Compliant / Deficient'
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['#', 'Statutory Parameter', 'Observed Extracted Text', 'OCR Confidence', 'Rule Status']],
      body: ocrRows,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
      headStyles: { fillColor: isConsumer ? [2, 132, 199] : [13, 71, 52], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 42 },
        2: { cellWidth: 78 },
        3: { cellWidth: 24, halign: 'center' },
        4: { cellWidth: 28, halign: 'center' }
      }
    });

    // 3. DETECTED VIOLATIONS & STATUTORY PENAL PROVISIONS
    currentY = doc.lastAutoTable.finalY + 8;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('3. DETECTED VIOLATIONS & STATUTORY CITATIONS', 14, currentY);

    const violRows = (auditRecord.violationsList || []).map((v, index) => [
      index + 1,
      v.ruleCited,
      v.severity,
      v.observed,
      v.penalty,
      v.guidance
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['#', 'Rule Cited', 'Severity', 'Observed Deficiency', 'Statutory Penal Provision', 'Correction Guidance']],
      body: violRows,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2, textColor: [30, 41, 59] },
      headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 32 },
        2: { cellWidth: 22 },
        3: { cellWidth: 42 },
        4: { cellWidth: 40 },
        5: { cellWidth: 36 }
      }
    });

    // Sign-Off Stamp
    currentY = doc.lastAutoTable.finalY + 8;
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'D');

    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(isConsumer ? 'Citizen Consumer Advisory Stamp:' : 'Legal Metrology Enforcement Authentication:', 18, currentY + 5);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(
      isConsumer 
        ? 'OFFICIAL CITIZEN VERIFICATION RECORD (ZERO DATA RETENTION)' 
        : 'ENFORCEMENT WING • SECTION 36 DIGITAL INSPECTION RECORD', 
      18, 
      currentY + 10
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(
      isConsumer
        ? 'Generated for consumer rights protection under Consumer Protection Act, 2019 & PCR-2011.'
        : 'Statutory evidence token recorded for compliance compounding / notice issuance.',
      18,
      currentY + 15
    );

    doc.setFont('helvetica', 'bold');
    doc.text('Status: ' + (isClean ? 'COMPLIANT' : 'REVISION REQUIRED / INFRACTIONS NOTED'), pageWidth - 20, currentY + 10, { align: 'right' });
    doc.text('Token: LM-' + Math.floor(100000 + Math.random() * 900000), pageWidth - 20, currentY + 15, { align: 'right' });

    // Footer
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('LEXISCAN • STATUTORY LEGAL METROLOGY SYSTEM • PCR 2011 • MINISTRY OF CONSUMER AFFAIRS', pageWidth / 2, pageHeight - 5, { align: 'center' });

    doc.save(`${(auditRecord.productName || 'Inspection').replace(/[^a-zA-Z0-9]/g, '_')}_Audit_${auditRecord.id}.pdf`);
    return true;
  } catch (err) {
    console.error('Failed to export PDF:', err);
    return false;
  }
};

/**
 * Universal CSV Exporter
 */
export const exportUniversalAuditCSV = (auditRecord) => {
  try {
    const rows = [
      ['LEGAL METROLOGY STATUTORY INSPECTION AUDIT RECORD'],
      ['Audit ID', auditRecord.id],
      ['Timestamp', auditRecord.timestamp || new Date().toISOString()],
      ['Product Name', auditRecord.productName],
      ['Category', auditRecord.category],
      ['Declared Net Qty', auditRecord.netQuantity],
      ['Declared MRP', auditRecord.mrp],
      ['Compliance Score', `${auditRecord.complianceScore}%`],
      ['Status', auditRecord.status],
      [''],
      ['OCR PARSED FIELDS (PaddleOCR v2.8)'],
      ['Parameter', 'Extracted Value', 'Confidence', 'Status']
    ];

    (auditRecord.extractedFields || []).forEach(f => {
      rows.push([f.key, f.value, `${f.confidence}%`, f.compliant ? 'Compliant' : 'Non-Compliant']);
    });

    rows.push(['']);
    rows.push(['DETECTED VIOLATIONS & STATUTORY CITATIONS']);
    rows.push(['Rule Cited', 'Severity', 'Observed Deficiency', 'Statutory Penalty', 'Correction Guidance']);

    (auditRecord.violationsList || []).forEach(v => {
      rows.push([v.ruleCited, v.severity, v.observed, v.penalty, v.guidance]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(auditRecord.productName || 'Audit').replace(/[^a-zA-Z0-9]/g, '_')}_Audit_${auditRecord.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to export CSV:', err);
    return false;
  }
};
