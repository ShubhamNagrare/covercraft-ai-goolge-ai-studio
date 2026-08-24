import { jsPDF } from 'jspdf';
import { GeneratedCoverLetter, CandidateDetails, CompanyDetails } from '../types';

export function exportToPdf(
  coverLetter: GeneratedCoverLetter,
  candidate: CandidateDetails,
  company: CompanyDetails,
  customFileName?: string
): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75 inch
  const maxContentWidth = pageWidth - margin * 2;

  let y = margin + 10;

  // 1. Candidate Name (Header)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27); // Zinc-900
  const candidateName = candidate.name || coverLetter.candidateName || 'Applicant Name';
  doc.text(candidateName, margin, y);
  y += 18;

  // 2. Candidate Contact details
  const contactItems = [
    candidate.email,
    candidate.phone,
    candidate.location,
    candidate.links,
  ].filter(Boolean);

  if (contactItems.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(113, 113, 122); // Zinc-500
    const contactLine = contactItems.join('  •  ');
    doc.text(contactLine, margin, y);
    y += 14;

    // Subtle divider rule
    doc.setDrawColor(228, 228, 231); // Zinc-200
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;
  } else {
    y += 10;
  }

  // 3. Date
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(39, 39, 42);
  doc.text(dateFormatted, margin, y);
  y += 20;

  // 4. Recipient info
  if (company.recipientName || company.companyName || company.jobTitle) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(24, 24, 27);

    if (company.recipientName) {
      doc.text(company.recipientName, margin, y);
      y += 14;
    }

    doc.setFont('helvetica', 'normal');
    if (company.companyName) {
      doc.text(company.companyName, margin, y);
      y += 14;
    }

    if (company.jobTitle) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(82, 82, 91);
      doc.text(`Re: Application for ${company.jobTitle}`, margin, y);
      y += 14;
    }
    y += 8;
  }

  // 5. Salutation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 24, 27);
  const salutation = coverLetter.salutation || 'Dear Hiring Team,';
  doc.text(salutation, margin, y);
  y += 18;

  // 6. Body Paragraphs with Auto-Wrap & Pagination
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(39, 39, 42); // Zinc-800
  const lineHeight = 15;

  const rawParagraphs: string[] = [];

  if (coverLetter.openingParagraph) {
    rawParagraphs.push(coverLetter.openingParagraph);
  }
  if (coverLetter.bodyParagraphs && coverLetter.bodyParagraphs.length > 0) {
    rawParagraphs.push(...coverLetter.bodyParagraphs);
  }
  if (coverLetter.closingParagraph) {
    rawParagraphs.push(coverLetter.closingParagraph);
  }

  // Fallback if structured pieces are empty
  if (rawParagraphs.length === 0 && coverLetter.fullFormattedLetter) {
    rawParagraphs.push(
      ...coverLetter.fullFormattedLetter
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    );
  }

  for (const para of rawParagraphs) {
    const wrappedLines = doc.splitTextToSize(para, maxContentWidth);
    const paraHeight = wrappedLines.length * lineHeight;

    // Check if we need a new page
    if (y + paraHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    doc.text(wrappedLines, margin, y);
    y += paraHeight + 14; // Paragraph gap
  }

  // 7. Sign-off & Name
  if (y + 50 > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }

  y += 6;
  doc.text(coverLetter.signOff || 'Sincerely,', margin, y);
  y += 24;

  doc.setFont('helvetica', 'bold');
  doc.text(candidateName, margin, y);

  const fileName =
    customFileName ||
    `Cover_Letter_${candidateName.replace(/\s+/g, '_')}_${(company.companyName || 'Application').replace(/\s+/g, '_')}.pdf`;

  doc.save(fileName);
}
