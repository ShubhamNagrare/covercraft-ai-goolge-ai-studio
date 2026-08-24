import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import {
  GeneratedCoverLetter,
  CandidateDetails,
  CompanyDetails,
  VisualTheme,
  FontFamily,
} from '../types';

export interface ExportDocxOptions {
  fontFamily?: FontFamily;
  visualTheme?: VisualTheme;
  fontSize?: 'compact' | 'standard' | 'spacious';
  customFileName?: string;
}

// DOCX Theme Colors (HEX string without #)
const DOCX_THEME_COLORS: Record<VisualTheme, { primary: string; accent: string }> = {
  'modern-indigo': { primary: '4F46E5', accent: '6366F1' },
  'executive-navy': { primary: '1E293B', accent: '334155' },
  'emerald-growth': { primary: '059669', accent: '10B981' },
  'crimson-bold': { primary: 'E11D48', accent: 'F43F5E' },
  'slate-elegant': { primary: '475569', accent: '64748B' },
  'amber-warm': { primary: 'D97706', accent: 'F59E0B' },
  'minimal-monochrome': { primary: '18181B', accent: '3F3F46' },
};

// DOCX Font names
const DOCX_FONTS: Record<FontFamily, string> = {
  sans: 'Calibri',
  serif: 'Georgia',
  mono: 'Consolas',
};

export async function exportToDocx(
  coverLetter: GeneratedCoverLetter,
  candidate: CandidateDetails,
  company: CompanyDetails,
  options?: ExportDocxOptions | string
): Promise<void> {
  const opts: ExportDocxOptions =
    typeof options === 'string'
      ? { customFileName: options }
      : options || {};

  const fontFamilyKey: FontFamily = opts.fontFamily || 'sans';
  const themeKey: VisualTheme = opts.visualTheme || 'modern-indigo';
  const sizeDensity = opts.fontSize || 'standard';

  const docFont = DOCX_FONTS[fontFamilyKey] || 'Calibri';
  const colors = DOCX_THEME_COLORS[themeKey] || DOCX_THEME_COLORS['modern-indigo'];

  // Font size scale in half-points (e.g. 22 = 11pt, 20 = 10pt, 24 = 12pt)
  let nameSize = 34; // 17pt
  let bodySize = 22; // 11pt
  let contactSize = 19; // 9.5pt
  let lineSpacing = 276; // 1.15 line spacing

  if (sizeDensity === 'compact') {
    nameSize = 30;
    bodySize = 20;
    contactSize = 18;
    lineSpacing = 240;
  } else if (sizeDensity === 'spacious') {
    nameSize = 38;
    bodySize = 24;
    contactSize = 21;
    lineSpacing = 310;
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const paragraphs: Paragraph[] = [];
  const candidateName = candidate.name || coverLetter.candidateName || 'Applicant Name';

  // 1. Candidate Name Header (Styled with theme primary color and selected font)
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: candidateName,
          bold: true,
          font: docFont,
          size: nameSize,
          color: colors.primary,
        }),
      ],
      spacing: { after: 120, before: 60 },
      alignment: AlignmentType.LEFT,
    })
  );

  // 2. Candidate Contact Line
  const contactParts = [
    candidate.email,
    candidate.phone,
    candidate.location,
    candidate.linkedin,
    candidate.portfolio || candidate.links,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join('   •   '),
            font: docFont,
            color: '64748B',
            size: contactSize,
          }),
        ],
        spacing: { after: 280 },
        border: {
          bottom: {
            color: colors.accent,
            space: 6,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      })
    );
  }

  // 3. Date (if enabled)
  if (candidate.includeDate !== false) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: dateStr,
            font: docFont,
            size: bodySize,
            color: '475569',
          }),
        ],
        spacing: { after: 180, before: 60 },
      })
    );
  }

  // 4. Recipient Details
  const recipientName = candidate.recipientTo || company.recipientName || 'Hiring Manager';
  if (recipientName || company.companyName || company.jobTitle) {
    if (recipientName) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: recipientName,
              font: docFont,
              bold: true,
              size: bodySize,
              color: '18181B',
            }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    if (company.companyName) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: company.companyName,
              font: docFont,
              size: bodySize,
              color: '334155',
            }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    if (company.jobTitle) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Regarding: Application for ${company.jobTitle}`,
              font: docFont,
              italics: true,
              color: '64748B',
              size: bodySize,
            }),
          ],
          spacing: { after: 60 },
        })
      );
    }
    paragraphs.push(new Paragraph({ text: '', spacing: { after: 120 } }));
  }

  // 5. Body Paragraphs (Respect live fullFormattedLetter edits)
  const rawParagraphs = (coverLetter.fullFormattedLetter || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (rawParagraphs.length > 0) {
    for (const p of rawParagraphs) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p,
              font: docFont,
              size: bodySize,
              color: '27272A',
            }),
          ],
          spacing: { after: 200, line: lineSpacing },
        })
      );
    }
  } else {
    // Fallback if fullFormattedLetter is empty
    if (coverLetter.salutation) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: coverLetter.salutation,
              font: docFont,
              bold: true,
              size: bodySize,
            }),
          ],
          spacing: { after: 180 },
        })
      );
    }
    if (coverLetter.openingParagraph) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: coverLetter.openingParagraph,
              font: docFont,
              size: bodySize,
            }),
          ],
          spacing: { after: 200, line: lineSpacing },
        })
      );
    }
    if (coverLetter.bodyParagraphs) {
      for (const bp of coverLetter.bodyParagraphs) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: bp,
                font: docFont,
                size: bodySize,
              }),
            ],
            spacing: { after: 200, line: lineSpacing },
          })
        );
      }
    }
    if (coverLetter.closingParagraph) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: coverLetter.closingParagraph,
              font: docFont,
              size: bodySize,
            }),
          ],
          spacing: { after: 220, line: lineSpacing },
        })
      );
    }
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: coverLetter.signOff || 'Sincerely,',
            font: docFont,
            size: bodySize,
          }),
        ],
        spacing: { after: 140, before: 80 },
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: candidateName,
            font: docFont,
            bold: true,
            size: bodySize,
            color: colors.primary,
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName =
    opts.customFileName ||
    `Cover_Letter_${candidateName.replace(/\s+/g, '_')}_${(company.companyName || 'Application').replace(/\s+/g, '_')}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

