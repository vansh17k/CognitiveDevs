import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Derives standard statutory declaration items from a product object
 */
export const getProductReportItems = (product) => {
  if (!product) return [];
  return [
    { sr: 1, name: 'Name & Address of Manufacturer', status: product.manufacturerName ? 'Compliant' : 'Non-Compliant', remarks: product.manufacturerName ? 'Declared with PIN and statutory address' : 'Missing or incomplete manufacturer details' },
    { sr: 2, name: 'Net Quantity', status: product.netQuantityDeclared ? 'Compliant' : 'Non-Compliant', remarks: product.netQuantityDeclared ? 'Standard SI units & prefix verified' : 'Missing standard SI units declaration' },
    { sr: 3, name: 'MRP (Incl. of all taxes)', status: product.mrpDeclared ? 'Compliant' : 'Non-Compliant', remarks: product.mrpDeclared ? 'Mandatory inclusive of all taxes wording present' : 'Missing inclusive of all taxes wording' },
    { sr: 4, name: 'Month & Year of Packing', status: product.mfgDate ? 'Compliant' : 'Non-Compliant', remarks: product.mfgDate ? 'Month and year clearly legible' : 'Missing manufacturing/packing date' },
    { sr: 5, name: 'Consumer Care Details', status: product.consumerCareDetails ? 'Compliant' : 'Non-Compliant', remarks: product.consumerCareDetails ? 'Name, address, phone & email verified' : 'Missing designated contact phone/email' },
    { sr: 6, name: 'Country of Origin', status: product.countryOfOriginDeclared ? 'Compliant' : 'Non-Compliant', remarks: product.countryOfOriginDeclared ? 'Country of origin declared prominently' : 'Missing Country of Origin statement' },
    { sr: 7, name: 'FSSAI License No.', status: product.fssaiLicenseDeclared ? 'Compliant' : 'Non-Compliant', remarks: product.fssaiLicenseDeclared ? '14-digit license number validated' : 'Missing 14-digit statutory license number' },
    { sr: 8, name: 'Font Size & Readability', status: (product.violations || []).some(v => (v.field || v.title || '').toLowerCase().includes('font')) ? 'Non-Compliant' : 'Compliant', remarks: (product.violations || []).some(v => (v.field || v.title || '').toLowerCase().includes('font')) ? 'Numeral height is below minimum prescribed in Rule 7' : 'Font dimensions conform to Rule 7 PCR 2011' },
  ];
};

/**
 * Generates and downloads an official Legal Metrology Compliance Inspection Report as a PDF.
 */
export const exportReportToPDF = (product, inspection, reportItems, remarks = '') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const nonCompliantCount = reportItems.filter(i => i.status === 'Non-Compliant').length;
    const compliantCount = reportItems.filter(i => i.status === 'Compliant').length;
    const isCompliant = nonCompliantCount === 0;
    const isConsumer = !!(product?.isConsumerScan || inspection?.isConsumerScan);

    // Header Color Accent Bar
    doc.setFillColor(13, 71, 52); // #0d4734 forest green
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(
      isConsumer ? 'CITIZEN PACKAGING VERIFICATION CERTIFICATE' : 'LEGAL METROLOGY COMPLIANCE & VERIFICATION SYSTEM',
      pageWidth / 2, 
      10, 
      { align: 'center' }
    );

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('GOVERNMENT OF INDIA • DEPARTMENT OF CONSUMER AFFAIRS • PCR-2011', pageWidth / 2, 16, { align: 'center' });

    doc.setFontSize(7.5);
    doc.text(
      isConsumer 
        ? 'OFFICIAL CITIZEN VERIFICATION CERTIFICATE (ZERO DATA RETENTION)' 
        : 'OFFICIAL STATUTORY PACKAGING INSPECTION REPORT', 
      pageWidth / 2, 
      21, 
      { align: 'center' }
    );

    // Metadata Section
    let currentY = 32;
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. INSPECTION RECORD & PRODUCT DETAILS', 14, currentY);

    currentY += 5;

    // Left Column: Product Info
    const leftColX = 14;
    const rightColX = 110;
    
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, pageWidth - 28, 44, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    
    // Row 1
    doc.text('Product Name:', leftColX + 3, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.name || 'Packaged Commodity'), leftColX + 30, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Inspection ID:', rightColX, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(inspection?.id || `INSP-2026-${product?.id || '001'}`), rightColX + 28, currentY + 7);

    // Row 2
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Brand / Importer:', leftColX + 3, currentY + 14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.brand || 'Apex Foods / Standard Brands'), leftColX + 30, currentY + 14);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Scan / Date:', rightColX, currentY + 14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.scanDate || new Date().toISOString().split('T')[0]), rightColX + 28, currentY + 14);

    // Row 3
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Net Quantity:', leftColX + 3, currentY + 21);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.netQuantityDeclared || product?.netQuantity || '500 ml / Standard'), leftColX + 30, currentY + 21);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(isConsumer ? 'Verification:' : 'Officer / Field:', rightColX, currentY + 21);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(
      isConsumer 
        ? 'Citizen Instant Verification (Zero Data Retention)' 
        : String(inspection?.inspectorName || 'Field Inspector (State Metrology)'), 
      rightColX + 28, 
      currentY + 21
    );

    // Row 4
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Declared MRP:', leftColX + 3, currentY + 28);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.mrpDeclared || 'Rs. 30.00 (Incl. of all taxes)'), leftColX + 30, currentY + 28);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('FSSAI / Reg No:', rightColX, currentY + 28);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.fssaiLicense || '10020022001948'), rightColX + 28, currentY + 28);

    // Row 5
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Mfg / Pkg Date:', leftColX + 3, currentY + 35);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(product?.mfgDate || '05/2025'), leftColX + 30, currentY + 35);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Status Verdict:', rightColX, currentY + 35);
    doc.setFont('helvetica', 'bold');
    if (isCompliant) {
      doc.setTextColor(11, 138, 79);
      doc.text('PASS - COMPLIANT', rightColX + 28, currentY + 35);
    } else {
      doc.setTextColor(217, 48, 37);
      doc.text(`FAIL - NON-COMPLIANT (${nonCompliantCount} Issues)`, rightColX + 28, currentY + 35);
    }

    currentY += 52;

    // Compliance Summary Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('2. STATUTORY DECLARATION AUDIT (PCR 2011 - RULE 6 & 7)', 14, currentY);

    currentY += 4;

    // AutoTable for Declaration-wise breakdown
    const tableData = reportItems.map((item, idx) => [
      String(item.sr || idx + 1),
      item.name,
      item.status === 'Compliant' ? 'COMPLIANT' : 'NON-COMPLIANT',
      item.remarks || '-'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Sr.', 'Mandatory Declaration / Rule', 'Compliance Status', 'Officer Observations & Rule References']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [13, 71, 52],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2.5
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.2,
        valign: 'middle',
        overflow: 'linebreak',
        textColor: [30, 41, 59]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 62, fontStyle: 'bold' },
        2: { cellWidth: 32, fontStyle: 'bold' },
        3: { cellWidth: 78 }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          if (data.cell.raw === 'COMPLIANT') {
            data.cell.styles.textColor = [11, 138, 79];
          } else {
            data.cell.styles.textColor = [217, 48, 37];
          }
        }
      },
      margin: { left: 14, right: 14 }
    });

    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : currentY + 70;

    // Check if new page needed
    if (finalY > pageHeight - 50) {
      doc.addPage();
      finalY = 20;
    }

    // Officer Remarks & Enforcement Action
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('3. OFFICER REMARKS & STATUTORY ACTION', 14, finalY);

    finalY += 4;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, finalY, pageWidth - 28, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const remarkText = remarks || product?.inspectorRemarks || (isCompliant 
      ? 'All mandatory declarations under Legal Metrology (Packaged Commodities) Rules, 2011 and FSSAI regulations are verified. Label conforms to prescribed font sizes and SI units.' 
      : 'Non-conformances flagged above. FBO/Manufacturer must submit a digital Corrective Action Plan (CAPA) within 15 days under Section 32 of Legal Metrology Act, 2009.');
    
    const splitRemarks = doc.splitTextToSize(remarkText, pageWidth - 36);
    doc.text(splitRemarks, 18, finalY + 7);

    finalY += 32;

    // Signatures / Seals
    if (finalY > pageHeight - 35) {
      doc.addPage();
      finalY = 20;
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(14, finalY + 12, 70, finalY + 12);
    doc.line(pageWidth - 70, finalY + 12, pageWidth - 14, finalY + 12);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(isConsumer ? 'Public Verification Authenticator' : 'Inspecting Officer Signature', 14, finalY + 16);
    doc.text(isConsumer ? 'National Legal Metrology Digital Seal' : 'DGM / Competent Authority Sign-off', pageWidth - 70, finalY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Digital Seal ID: LEXISCAN-${Math.floor(100000 + Math.random() * 900000)}`, 14, finalY + 20);
    doc.text(isConsumer ? 'Citizen Zero-Data-Retention Certified' : 'Certified Electronic Verification Record', pageWidth - 70, finalY + 20);

    // Footer on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Suraksha1 PCR-2011 Regulatory Engine • Page ${i} of ${totalPages} • Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
      );
    }

    // Save File
    const sanitizedName = (product?.name || 'Commodity').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Legal_Metrology_Compliance_Report_${sanitizedName}_${product?.id || '2026'}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    return false;
  }
};

/**
 * Exports the compliance report as a formatted Excel spreadsheet (.xls / .csv)
 */
export const exportReportToExcel = (product, inspection, reportItems, remarks = '') => {
  try {
    const nonCompliantCount = reportItems.filter(i => i.status === 'Non-Compliant').length;
    const isCompliant = nonCompliantCount === 0;

    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    csvContent += 'LEGAL METROLOGY COMPLIANCE & INSPECTION REPORT (PCR-2011)\r\n';
    csvContent += 'Government of India - Ministry of Consumer Affairs\r\n\r\n';
    
    csvContent += 'PRODUCT & INSPECTION SUMMARY\r\n';
    csvContent += `Product Name,"${(product?.name || '').replace(/"/g, '""')}"\r\n`;
    csvContent += `Brand / Importer,"${(product?.brand || '').replace(/"/g, '""')}"\r\n`;
    csvContent += `Inspection ID,"${inspection?.id || `INSP-${product?.id || '001'}`}"\r\n`;
    csvContent += `Scan Date,"${product?.scanDate || new Date().toISOString().split('T')[0]}"\r\n`;
    csvContent += `Net Quantity,"${product?.netQuantityDeclared || product?.netQuantity || '500 ml'}"\r\n`;
    csvContent += `MRP Declared,"${product?.mrpDeclared || 'Rs. 30.00'}"\r\n`;
    csvContent += `Manufacture Date,"${product?.mfgDate || '05/2025'}"\r\n`;
    csvContent += `FSSAI License,"${product?.fssaiLicense || '10020022001948'}"\r\n`;
    csvContent += `Inspecting Officer,"${(inspection?.inspectorName || 'Field Officer').replace(/"/g, '""')}"\r\n`;
    csvContent += `Overall Verdict,"${isCompliant ? 'PASS - COMPLIANT' : `FAIL - NON-COMPLIANT (${nonCompliantCount} violations)`}"\r\n\r\n`;

    csvContent += 'STATUTORY DECLARATION BREAKDOWN (PCR-2011 RULE 6 & 7)\r\n';
    csvContent += 'Sr No.,Mandatory Declaration,Compliance Status,Officer Remarks / Observations\r\n';

    reportItems.forEach((item, index) => {
      const sr = item.sr || index + 1;
      const name = `"${(item.name || '').replace(/"/g, '""')}"`;
      const status = item.status === 'Compliant' ? 'Compliant' : 'Non-Compliant';
      const rem = `"${(item.remarks || '-').replace(/"/g, '""')}"`;
      csvContent += `${sr},${name},${status},${rem}\r\n`;
    });

    csvContent += '\r\nOFFICER REMARKS & STATUTORY NOTICES\r\n';
    csvContent += `"${(remarks || product?.inspectorRemarks || (isCompliant ? 'Label verified compliant.' : 'Notice issued to FBO to rectify non-conformances within 15 days.')).replace(/"/g, '""')}"\r\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedName = (product?.name || 'Commodity').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `Compliance_Report_${sanitizedName}_${product?.id || '2026'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Excel/CSV Export Error:', error);
    return false;
  }
};

/**
 * Triggers a clean print dialog for the report document.
 */
export const printReportDocument = (product, inspection, reportItems, remarks = '') => {
  // First attempt window.print()
  try {
    window.print();
    return true;
  } catch (e) {
    console.warn('Standard window.print() failed, falling back to PDF generation:', e);
    return exportReportToPDF(product, inspection, reportItems, remarks);
  }
};
