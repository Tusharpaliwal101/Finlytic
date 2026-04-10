import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatters';

export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Results') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (
  title: string,
  headers: string[][],
  data: any[][],
  fileName: string,
  summary?: { label: string; value: string }[]
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.text('Finlytic', 14, 15);
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(title, 14, 25);

  // Summary Grid
  if (summary) {
    let y = 35;
    doc.setFontSize(10);
    doc.setTextColor(50);
    summary.forEach((s) => {
      doc.text(`${s.label}: ${s.value}`, 14, y);
      y += 7;
    });
  }

  // Table
  autoTable(doc, {
    startY: summary ? 35 + summary.length * 7 + 10 : 35,
    head: headers,
    body: data,
    theme: 'striped',
    headStyles: { fillColor: [53, 87, 255] }, // Brand Blue
    styles: { font: 'helvetica', fontSize: 9 },
  });

  doc.save(`${fileName}.pdf`);
};
