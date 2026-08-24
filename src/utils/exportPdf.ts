import { jsPDF } from 'jspdf';
import {
  GeneratedCoverLetter,
  CandidateDetails,
  CompanyDetails,
  VisualTheme,
  FontFamily,
} from '../types';

export interface ExportPdfOptions {
  fontFamily?: FontFamily;
  visualTheme?: VisualTheme;
  fontSize?: 'compact' | 'standard' | 'spacious';
  customFileName?: string;
}

// Color palettes for PDF theme rendering [R, G, B]
const THEME_COLORS: Record<VisualTheme, { primary: [number, number, number]; accent: [number, number, number] }> = {
  'modern-indigo': { primary: [79, 70, 229], accent: [99, 102, 241] }, // Indigo-600
  'executive-navy': { primary: [30, 41, 59], accent: [51, 65, 85] }, // Slate-800
  'emerald-growth': { primary: [5, 150, 105], accent: [16, 185, 129] }, // Emerald-600
  'crimson-bold': { primary: [225, 29, 72], accent: [244, 63, 94] }, // Rose-600
  'slate-elegant': { primary: [71, 85, 105], accent: [100, 116, 139] }, // Slate-600
  'amber-warm': { primary: [217, 119, 6], accent: [245, 158, 11] }, // Amber-600
  'minimal-monochrome': { primary: [24, 24, 27], accent: [63, 63, 70] }, // Zinc-900
};

export function exportToPdf(
  coverLetter: GeneratedCoverLetter,
  candidate: CandidateDetails,
  company: CompanyDetails,
  options?: ExportPdfOptions | string
): void {
  // Normalize options
  const opts: ExportPdfOptions =
    typeof options === 'string'
      ? { customFileName: options }
      : options || {};

  const fontFamilyKey: FontFamily = opts.fontFamily || 'sans';
  const themeKey: VisualTheme = opts.visualTheme || 'modern-indigo';
  const sizeDensity = opts.fontSize || 'standard';

  // Map font families to standard PDF built-in fonts
  const pdfFontFamily =
    fontFamilyKey === 'serif' ? 'times' : fontFamilyKey === 'mono' ? 'courier' : 'helvetica';

  const themeColors = THEME_COLORS[themeKey] || THEME_COLORS['modern-indigo'];

  // Font size scale
  let nameSize = 18;
  let bodySize = 10.5;
  let contactSize = 9.5;
  let lineHeight = 15;

  if (sizeDensity === 'compact') {
    nameSize = 16;
    bodySize = 9.5;
    contactSize = 8.5;
    lineHeight = 13.5;
  } else if (sizeDensity === 'spacious') {
    nameSize = 20;
    bodySize = 11.5;
    contactSize = 10;
    lineHeight = 17;
  }

  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75 inch
  const maxContentWidth = pageWidth - margin * 2;

  // 1. Draw Top Accent Bar with selected Theme Color
  doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
  doc.rect(0, 0, pageWidth, 6, 'F');

  let y = margin + 12;

  // 2. Candidate Name (Header with Theme Primary Color)
  doc.setFont(pdfFontFamily, 'bold');
  doc.setFontSize(nameSize);
  doc.setTextColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
  const candidateName = candidate.name || coverLetter.candidateName || 'Applicant Name';
  doc.text(candidateName, margin, y);
  y += nameSize + 2;

  // 3. Candidate Contact details
  const contactItems = [
    candidate.email,
    candidate.phone,
    candidate.location,
    candidate.linkedin,
    candidate.portfolio || candidate.links,
  ].filter(Boolean);

  if (contactItems.length > 0) {
    doc.setFont(pdfFontFamily, 'normal');
    doc.setFontSize(contactSize);
    doc.setTextColor(100, 116, 139); // Slate-500
    const contactLine = contactItems.join('  •  ');
    doc.text(contactLine, margin, y);
    y += contactSize + 6;

    // Theme-tinted divider rule
    doc.setDrawColor(themeColors.accent[0], themeColors.accent[1], themeColors.accent[2]);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 22;
  } else {
    y += 12;
  }

  // 4. Date (if enabled)
  if (candidate.includeDate !== false) {
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFont(pdfFontFamily, 'normal');
    doc.setFontSize(bodySize);
    doc.setTextColor(71, 85, 105);
    doc.text(dateFormatted, margin, y);
    y += bodySize + 8;
  }

  // 5. Recipient info
  const recipientName = candidate.recipientTo || company.recipientName || 'Hiring Manager';
  if (recipientName || company.companyName || company.jobTitle) {
    doc.setFont(pdfFontFamily, 'bold');
    doc.setFontSize(bodySize);
    doc.setTextColor(24, 24, 27);

    if (recipientName) {
      doc.text(recipientName, margin, y);
      y += bodySize + 4;
    }

    doc.setFont(pdfFontFamily, 'normal');
    if (company.companyName) {
      doc.text(company.companyName, margin, y);
      y += bodySize + 4;
    }

    if (company.jobTitle) {
      doc.setFont(pdfFontFamily, 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text(`Regarding: Application for ${company.jobTitle}`, margin, y);
      y += bodySize + 4;
    }
    y += 8;
  }

  // 6. Body Paragraphs (Respect live fullFormattedLetter edits)
  doc.setFont(pdfFontFamily, 'normal');
  doc.setFontSize(bodySize);
  doc.setTextColor(39, 39, 42); // Zinc-800

  // Always use the live fullFormattedLetter so user text edits are 100% honored
  const rawParagraphs = (coverLetter.fullFormattedLetter || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // If splitting gave nothing, fallback to structured parts
  if (rawParagraphs.length === 0) {
    if (coverLetter.salutation) rawParagraphs.push(coverLetter.salutation);
    if (coverLetter.openingParagraph) rawParagraphs.push(coverLetter.openingParagraph);
    if (coverLetter.bodyParagraphs) rawParagraphs.push(...coverLetter.bodyParagraphs);
    if (coverLetter.closingParagraph) rawParagraphs.push(coverLetter.closingParagraph);
    if (coverLetter.signOff) rawParagraphs.push(`${coverLetter.signOff}\n\n${candidateName}`);
  }

  for (const para of rawParagraphs) {
    const wrappedLines = doc.splitTextToSize(para, maxContentWidth);
    const paraHeight = wrappedLines.length * lineHeight;

    // Check if we need a new page
    if (y + paraHeight > pageHeight - margin) {
      doc.addPage();
      // Draw top accent bar on next page too
      doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
      doc.rect(0, 0, pageWidth, 4, 'F');
      y = margin;
    }

    doc.text(wrappedLines, margin, y);
    y += paraHeight + 12; // Paragraph gap
  }

  const fileName =
    opts.customFileName ||
    `Cover_Letter_${candidateName.replace(/\s+/g, '_')}_${(company.companyName || 'Application').replace(/\s+/g, '_')}.pdf`;

  doc.save(fileName);
}

