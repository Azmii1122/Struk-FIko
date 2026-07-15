import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- Perubahan cara import di sini

// Fungsi format Rupiah mandiri agar tidak error
const formatRupiah = (number) => {
  if (number === undefined || number === null || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

export const downloadReceiptPDF = (data) => {
  const {
    idStruk,
    tanggalServis,
    namaCustomer,
    jenisKendaraan,
    modelKendaraan,
    nopol,
    tahunKendaraan,
    items
  } = data;

  const grandTotal = items.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5'
  });

  const leftMargin = 15;
  const rightMargin = 195;
  const topMargin = 15;

  // --- HEADER SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor('#0f172a');
  doc.text('Fiko Modifikasi', leftMargin, topMargin);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#64748b');
  doc.text('Jln. Menteng VII Gg. Cempaka No. 20 Kota Medan', leftMargin, topMargin + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor('#0f172a');
  doc.text(`ID Struk: ${idStruk}`, rightMargin, topMargin, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#64748b');
  doc.text(`Tanggal Servis: ${tanggalServis}`, rightMargin, topMargin + 5.5, { align: 'right' });

  doc.setDrawColor('#e2e8f0');
  doc.setLineWidth(0.3);
  doc.line(leftMargin, topMargin + 10, rightMargin, topMargin + 10);

  // --- SUB-HEADER ---
  const subHeaderY = topMargin + 16;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#64748b');
  doc.text('Pelanggan:', leftMargin, subHeaderY);
  
  doc.setFont('helvetica', 'bold'); // diganti dari semibold ke bold
  doc.setFontSize(9);
  doc.setTextColor('#0f172a');
  doc.text(namaCustomer || '-', leftMargin + 25, subHeaderY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#64748b');
  doc.text('No. Polisi:', leftMargin, subHeaderY + 6);
  
  doc.setFont('helvetica', 'bold'); // diganti dari semibold ke bold
  doc.setFontSize(9);
  doc.setTextColor('#0f172a');
  doc.text(nopol || '-', leftMargin + 25, subHeaderY + 6);

  const rightColumnX = 110;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#64748b');
  doc.text('Kendaraan:', rightColumnX, subHeaderY);
  
  doc.setFont('helvetica', 'bold'); // diganti dari semibold ke bold
  doc.setFontSize(9);
  doc.setTextColor('#0f172a');
  doc.text(jenisKendaraan || '-', rightColumnX + 25, subHeaderY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#64748b');
  doc.text('Model / Tahun:', rightColumnX, subHeaderY + 6);
  
  doc.setFont('helvetica', 'bold'); // diganti dari semibold ke bold
  doc.setFontSize(9);
  doc.setTextColor('#0f172a');
  const vehicleModel = modelKendaraan || '-';
  const vehicleYear = tahunKendaraan ? `(${tahunKendaraan})` : '';
  doc.text(`${vehicleModel} ${vehicleYear}`.trim(), rightColumnX + 25, subHeaderY + 6);

  // --- ITEMS TABLE ---
  const tableStartY = subHeaderY + 12;

  // <-- Perubahan cara panggil tabel di sini agar tidak crash
  autoTable(doc, {
    startY: tableStartY,
    head: [['DESKRIPSI', 'HARGA', 'QTY', 'TOTAL']],
    body: items.map((item) => [
      item.nama || '-',
      formatRupiah(item.harga),
      item.qty.toString(),
      formatRupiah(item.harga * item.qty)
    ]),
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      textColor: '#334155',
    },
    headStyles: {
      fillColor: '#f8fafc',
      textColor: '#64748b',
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 35 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 40, fontStyle: 'bold', textColor: '#0f172a' }
    },
    didParseCell: function (data) {
      if (data.section === 'head') {
        if (data.column.index === 1 || data.column.index === 2) data.cell.styles.halign = 'center';
        if (data.column.index === 3) data.cell.styles.halign = 'right';
      }
    },
    margin: { left: leftMargin, right: 210 - rightMargin, top: 15, bottom: 25 },
  });

  // --- FOOTER & TOTAL ---
  // Mengambil posisi akhir tabel dengan cara yang aman
  let footerY = doc.lastAutoTable.finalY + 10;
  
  if (footerY > 126) {
    doc.addPage();
    footerY = 25;
  }

  doc.setFillColor(15, 23, 42); 
  doc.roundedRect(leftMargin, footerY - 5, rightMargin - leftMargin, 14, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); 
  doc.text('TOTAL AKHIR', leftMargin + 5, footerY + 3.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255); 
  doc.text(formatRupiah(grandTotal), rightMargin - 5, footerY + 4, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor('#94a3b8');
  doc.text('Terima kasih atas kunjungan Anda', 210 / 2, footerY + 18, { align: 'center' });

  // --- FILE DOWNLOAD ACTION ---
  const sanitizedCustomer = (namaCustomer || 'Pelanggan').trim().replace(/[\s\W]+/g, '_');
  const sanitizedDate = tanggalServis.replace(/[\s\W]+/g, '_');
  const filename = `Struk_${sanitizedCustomer}_${sanitizedDate}.pdf`;
  
  doc.save(filename);
};