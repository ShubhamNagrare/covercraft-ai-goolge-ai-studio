export type TemplateCategory =
  | 'industry'
  | 'geography'
  | 'company_style'
  | 'tone';

export type ToneType =
  | 'Formal'
  | 'Direct'
  | 'Warm'
  | 'Confident'
  | 'Concise'
  | 'Executive'
  | 'Enthusiastic'
  | 'Technical';

export interface CoverLetterTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  subcategory: string; // e.g. "Engineering", "US Style", "Startup", "Healthcare"
  tone: ToneType;
  description: string;
  emphasis: string;
  structureDescription: string;
  greetingStyle: string;
  closingStyle: string;
  sampleHook: string;
  badgeColor: string;
  recommendedFor: string[];
}

export interface CandidateDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  linkedin: string;
  github: string;
  portfolio: string;
  leetcode?: string;
  medium?: string;
  currentRole?: string;
  yearsOfExp?: string;
  recipientTo: string; // "TO" section - whom the letter is addressed to, e.g. "Hiring Manager"
  includeSignature: boolean;
  includeDate: boolean;
  customDraftCommand?: string; // Additional user prompt (max 100 words)
}

export interface CompanyDetails {
  jobTitle: string;
  companyName: string;
  recipientName: string;
  recipientTitle?: string;
  department?: string;
  location?: string;
}

export interface ParsedResumeData {
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  leetcode?: string;
  medium?: string;
  currentRole: string;
  yearsOfExperience: string;
  summary: string;
  skills: string[];
  keyAchievements: string[];
  atsScore?: number;
  atsImprovements?: string[];
  topRoles: {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }[];
  education: string[];
}

export interface MatchAnalysisResult {
  targetJobTitle: string;
  targetCompany: string;
  matchScore: number;
  matchingSkills: string[];
  missingOrGapSkills: string[];
  keyStrengthsToHighlight: string[];
  suggestedTone: string;
  suggestedIndustryCategory: string;
  recommendedTemplateId: string;
  customAdvice: string;
}

export interface GeneratedCoverLetter {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateId: string;
  templateName: string;
  tone: string;
  subjectLine: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signOff: string;
  candidateName: string;
  fullFormattedLetter: string;
  highlightsUsed: string[];
  wordCount: number;
  readingTimeMinutes: number;
  matchScore?: number;
  jobTitle?: string;
  companyName?: string;
}

export interface SavedHistoryItem {
  id: string;
  title: string;
  company: string;
  date: string;
  templateId: string;
  templateName: string;
  matchScore?: number;
  coverLetter: GeneratedCoverLetter;
  resumeSnippet?: string;
  jdSnippet?: string;
}

export type VisualTheme =
  | 'modern-indigo'
  | 'executive-navy'
  | 'minimal-monochrome'
  | 'emerald-growth'
  | 'crimson-bold'
  | 'slate-elegant'
  | 'amber-warm';

export type FontFamily = 'sans' | 'serif' | 'mono';
