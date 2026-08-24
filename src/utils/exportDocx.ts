import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { GeneratedCoverLetter, CandidateDetails, CompanyDetails } from '../types';

export async function exportToDocx(
  coverLetter: GeneratedCoverLetter,
  candidate: CandidateDetails,
  company: CompanyDetails,
  customFileName?: string
): Promise<void> {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const paragraphs: Paragraph[] = [];

  // 1. Candidate Name Header
  paragraphs.push(
    new Paragraph({
      text: candidate.name || coverLetter.candidateName || 'Applicant Name',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 100 },
      alignment: AlignmentType.LEFT,
    })
  );

  // 2. Candidate Contact Line
  const contactParts = [
    candidate.email,
    candidate.phone,
    candidate.location,
    candidate.links,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            color: '666666',
            size: 20, // 10pt
          }),
        ],
        spacing: { after: 300 },
        border: {
          bottom: {
            color: 'CCCCCC',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
  }

  // 3. Date
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: dateStr,
          size: 22, // 11pt
        }),
      ],
      spacing: { after: 200, before: 100 },
    })
  );

  // 4. Recipient Details
  if (company.recipientName || company.companyName || company.jobTitle) {
    if (company.recipientName) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: company.recipientName,
              bold: true,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    }
    if (company.jobTitle && company.companyName) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Regarding: ${company.jobTitle} at ${company.companyName}`,
              italics: true,
              color: '444444',
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    } else if (company.companyName) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: company.companyName,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    }
    paragraphs.push(new Paragraph({ text: '', spacing: { after: 150 } }));
  }

  // 5. Salutation
  if (coverLetter.salutation) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: coverLetter.salutation,
            bold: true,
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // 6. Body Paragraphs (Break full letter or use structured paragraphs)
  if (coverLetter.bodyParagraphs && coverLetter.bodyParagraphs.length > 0) {
    // Opening
    if (coverLetter.openingParagraph) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: coverLetter.openingParagraph,
              size: 22,
            }),
          ],
          spacing: { after: 200, line: 276 },
        })
      );
    }

    // Body
    for (const p of coverLetter.bodyParagraphs) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p,
              size: 22,
            }),
          ],
          spacing: { after: 200, line: 276 },
        })
      );
    }

    // Closing
    if (coverLetter.closingParagraph) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: coverLetter.closingParagraph,
              size: 22,
            }),
          ],
          spacing: { after: 250, line: 276 },
        })
      );
    }
  } else {
    // Fallback to splitting fullFormattedLetter
    const rawParagraphs = coverLetter.fullFormattedLetter
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    for (const p of rawParagraphs) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p,
              size: 22,
            }),
          ],
          spacing: { after: 200, line: 276 },
        })
      );
    }
  }

  // 7. Sign-off & Name
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: coverLetter.signOff || 'Sincerely,',
          size: 22,
        }),
      ],
      spacing: { after: 150, before: 100 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: candidate.name || coverLetter.candidateName || 'Candidate Name',
          bold: true,
          size: 22,
        }),
      ],
      spacing: { after: 100 },
    })
  );

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
    customFileName ||
    `Cover_Letter_${(candidate.name || 'Candidate').replace(/\s+/g, '_')}_${(company.companyName || 'Application').replace(/\s+/g, '_')}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
