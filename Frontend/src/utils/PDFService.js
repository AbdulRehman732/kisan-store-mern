import * as jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api';

const getJSPDF = () => {
  return jspdf.jsPDF || jspdf.default || jspdf;
};

/**
 * Utility to generate professional PDF reports and statements
 */
export const generateOrderReport = async ({ orders, title, userName, dateRange }) => {
  try {
    const PDFConstructor = getJSPDF();
    const doc = new PDFConstructor();
    let settings = { storeName: 'KisanStore ERP', storeAddress: 'Industrial Estate', storePhone: '0300-1234567', logoUrl: '' };

  // 1. Fetch Branding Settings
  try {
    const res = await api.get('/admin/settings');
    if (res.data.settings) settings = res.data.settings;
  } catch (err) {
    console.warn('Using default branding');
  }

  // 2. Prepare Header
  const margin = 14;
  let currentY = 20;

  // Header Background
  doc.setFillColor(43, 57, 34); // Primary color #2b3922
  doc.rect(0, 0, 210, 45, 'F');

  // Business Name & Info (Text)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.storeName.toUpperCase(), margin, 25);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.storeAddress, margin, 32);
  doc.text(`Contact: ${settings.storePhone}`, margin, 37);

  // Logo (if exists)
  if (settings.logoUrl) {
    try {
      // Logic to convert image URL to base64 for jsPDF
      const img = await getBase64Image(`${window.location.origin}${settings.logoUrl}`);
      doc.addImage(img, 'WEBP', 160, 8, 35, 30);
    } catch (e) {
      console.error('Logo failed to load');
    }
  }

  currentY = 60;

  // Report Title & User info
  doc.setTextColor(43, 57, 34);
  doc.setFontSize(18);
  doc.text(title, margin, currentY);
  
  currentY += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated For: ${userName || 'System Report'}`, margin, currentY);
  doc.text(`Date Range: ${dateRange || 'All Time'}`, margin, currentY + 5);
  doc.text(`Generated At: ${new Date().toLocaleString()}`, margin, currentY + 10);

  currentY += 25;

  // 3. Generate Table
  const tableRows = [];
  let totalProcurement = 0;
  let totalPaid = 0;

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    const grandTotal = order.grandTotal || order.totalAmount || 0;
    const amountPaid = order.amountPaid || 0;
    
    totalProcurement += grandTotal;
    totalPaid += amountPaid;

    // Detailed Item List as a single string for the cell
    const itemsText = (order.items || []).map(i => 
      `${i.product?.name || 'Product'} (${i.quantity} x ${i.price})`
    ).join('\n');

    tableRows.push([
      orderDate,
      `#${order._id.slice(-8).toUpperCase()}`,
      order.status,
      itemsText,
      `Rs. ${grandTotal.toLocaleString()}`,
      order.paymentStatus || 'Unpaid'
    ]);
  });

  autoTable(doc, {
    startY: currentY,
    head: [['DATE', 'ORDER ID', 'STATUS', 'ITEMS (QTY x RATE)', 'AMOUNT', 'PAYMENT']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [43, 57, 34], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, cellPadding: 5 },
    columnStyles: {
      3: { cellWidth: 60 } // items column width
    },
  });

  currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : currentY + 30;

  // 4. Financial Summary Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY, 210 - margin, currentY);
  currentY += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(43, 57, 34);
  doc.text('FINANCIAL SUMMARY', margin, currentY);

  currentY += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Procurement Value: Rs. ${totalProcurement.toLocaleString()}`, margin, currentY);
  doc.text(`Total Amount Paid: Rs. ${totalPaid.toLocaleString()}`, margin, currentY + 6);
  
  const balance = totalProcurement - totalPaid;
  if (balance > 0) doc.setTextColor(212, 106, 79); // Red if due
  else doc.setTextColor(22, 101, 52); // Green if cleared
  doc.setFont('helvetica', 'bold');
  doc.text(`OUTSTANDING BALANCE DUE: Rs. ${balance.toLocaleString()}`, margin, currentY + 12);

  // Download
  doc.save(`${title.replace(/ /g, '_')}_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("System Error: Unable to generate PDF report. " + error.message);
  }
};

/**
 * Generate a specialized Institutional Invoice for a single order
 * Includes full payment history and balance reconciliation
 */
export const generateSingleInvoice = async (order) => {
  try {
    const PDFConstructor = getJSPDF();
    const doc = new PDFConstructor();
    let settings = { storeName: 'KisanStore ERP', storeAddress: 'Industrial Estate', storePhone: '0300-1234567', logoUrl: '' };

  try {
    const res = await api.get('/admin/settings');
    if (res.data.settings) settings = res.data.settings;
  } catch (err) { console.warn('Default branding'); }

  const margin = 14;
  let currentY = 20;

  // 1. Header (Agrotek Style)
  doc.setFillColor(43, 57, 34); 
  doc.rect(0, 0, 210, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.storeName.toUpperCase(), margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Institutional Procurement Invoice · #${order._id.slice(-8).toUpperCase()}`, margin, 32);
  doc.text(settings.storeAddress, margin, 38);
  doc.text(`Contact: ${settings.storePhone}`, margin, 43);

  // 2. Customer & Order Info
  currentY = 65;
  doc.setTextColor(43, 57, 34);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', margin, currentY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(`${order.farmer?.first_name} ${order.farmer?.last_name}`, margin, currentY + 7);
  doc.text(`Contact: ${order.farmerPhone || order.farmer?.phone?.[0] || 'N/A'}`, margin, currentY + 12);
  doc.text(`Authorized At: ${new Date(order.createdAt).toLocaleString()}`, margin, currentY + 17);

  doc.setTextColor(43, 57, 34);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS:', 140, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(order.status.toUpperCase(), 140, currentY + 7);
  doc.text(`Payment: ${order.paymentStatus}`, 140, currentY + 12);

  // 3. Itemized Table
  currentY = 100;
  const items = (order.items || []).map(i => [
    i.product?.name || 'Asset',
    i.quantity,
    `Rs. ${i.price.toLocaleString()}`,
    `Rs. ${(i.taxAmount || 0).toLocaleString()}`,
    `Rs. ${((i.price + (i.taxAmount || 0)) * i.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['SPECIFICATION', 'QTY', 'RATE', 'TAX', 'SUBTOTAL']],
    body: items,
    theme: 'striped',
    headStyles: { fillColor: [43, 57, 34], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : currentY + 20;

  // 4. Totals Summary
  const sub = order.totalAmount || 0;
  const tax = order.taxTotal || 0;
  const grand = order.grandTotal || sub + tax;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Base Subtotal: Rs. ${sub.toLocaleString()}`, 140, currentY);
  doc.text(`Institutional Tax: Rs. ${tax.toLocaleString()}`, 140, currentY + 7);
  
  doc.setFontSize(14);
  doc.setTextColor(43, 57, 34);
  doc.setFont('helvetica', 'bold');
  doc.text(`GRAND TOTAL: Rs. ${grand.toLocaleString()}`, 120, currentY + 18);

  // 5. Payment Reconciliation Table
  if (order.payments && order.payments.length > 0) {
    currentY += 35;
    doc.setFontSize(12);
    doc.text('RECONCILIATION & PAYMENT HISTORY', margin, currentY);
    
    const py = order.payments.map((p, i) => [
      i + 1,
      new Date(p.paidAt).toLocaleDateString(),
      p.method,
      p.reference || '—',
      `Rs. ${p.amount.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: currentY + 6,
      head: [['#', 'DATE', 'METHOD', 'REFERENCE', 'AMOUNT']],
      body: py,
      theme: 'grid',
      headStyles: { fillColor: [100, 100, 100], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : currentY + 20;
  } else {
    currentY += 40;
  }

  // 6. BALANCE DUE CALLOUT
  const paid = order.amountPaid || 0;
  const balance = grand - paid;

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, currentY, 182, 25, 'F');
  
  doc.setTextColor(43, 57, 34);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Authorized: Rs. ${grand.toLocaleString()}`, margin + 10, currentY + 10);
  doc.text(`Total Collections: Rs. ${paid.toLocaleString()}`, margin + 10, currentY + 17);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  if (balance > 0) doc.setTextColor(212, 106, 79);
  else doc.setTextColor(22, 101, 52);
  doc.text(`BALANCE DUE: Rs. ${balance.toLocaleString()}`, 110, currentY + 15);

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.text('This is an electronically generated institutional document. No physical signature required.', margin, 285);

  doc.save(`INVOICE_${order._id.slice(-8).toUpperCase()}.pdf`);
  } catch (error) {
    console.error("Single Invoice Error:", error);
    alert("System Error: Unable to generate invoice. " + error.message);
  }
};

// Helper to load image as base64
function getBase64Image(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/webp');
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = url;
  });
}
