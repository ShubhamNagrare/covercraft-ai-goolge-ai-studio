import React, { useState } from 'react';
import {
  Download,
  FileDown,
  Copy,
  Check,
  Sparkles,
  Wand2,
  RotateCcw,
  Printer,
  Sliders,
  Type,
  Palette,
  Eye,
  Edit3,
  Bookmark,
  Share2,
  FileText,
  Clock,
  Layers,
  ArrowLeft,
  ChevronDown,
  Calendar,
  PenTool,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  GeneratedCoverLetter,
  CandidateDetails,
  CompanyDetails,
  CoverLetterTemplate,
  VisualTheme,
  FontFamily,
  ToneType,
} from '../types';
import { COVER_LETTER_TEMPLATES } from '../data/templates';
import { exportToDocx } from '../utils/exportDocx';
import { exportToPdf } from '../utils/exportPdf';
import { RewriteModal } from './RewriteModal';

interface CoverLetterEditorProps {
  coverLetter: GeneratedCoverLetter;
  onChangeCoverLetter: (letter: GeneratedCoverLetter) => void;
  candidateDetails: CandidateDetails;
  companyDetails: CompanyDetails;
  selectedTemplate: CoverLetterTemplate;
  onSelectTemplate: (template: CoverLetterTemplate) => void;
  onRegenerate: () => void;
  onSaveToHistory: () => void;
  onBackToTemplates: () => void;
  resumeContext: string;
  jobDescriptionContext: string;
  isRegenerating: boolean;
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  coverLetter,
  onChangeCoverLetter,
  candidateDetails,
  companyDetails,
  selectedTemplate,
  onSelectTemplate,
  onRegenerate,
  onSaveToHistory,
  onBackToTemplates,
  resumeContext,
  jobDescriptionContext,
  isRegenerating,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRewriteModalOpen, setIsRewriteModalOpen] = useState(false);
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('modern-indigo');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [fontSize, setFontSize] = useState<'compact' | 'standard' | 'spacious'>('standard');
  const [isExporting, setIsExporting] = useState<'pdf' | 'docx' | null>(null);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);

  const wordCount = coverLetter.fullFormattedLetter.split(/\s+/).filter(Boolean).length;
  const charCount = coverLetter.fullFormattedLetter.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter.fullFormattedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b'],
    });
  };

  const handleDownloadPdf = () => {
    setIsExporting('pdf');
    try {
      exportToPdf(coverLetter, candidateDetails, companyDetails);
      fireConfetti();
    } catch (e) {
      console.error('PDF export error', e);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExporting('docx');
    try {
      await exportToDocx(coverLetter, candidateDetails, companyDetails);
      fireConfetti();
    } catch (e) {
      console.error('DOCX export error', e);
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSaveToHistory();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleApplyRewrite = (newText: string) => {
    onChangeCoverLetter({
      ...coverLetter,
      fullFormattedLetter: newText,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSwitchTemplate = (tpl: CoverLetterTemplate) => {
    onSelectTemplate(tpl);
    setTemplateDropdownOpen(false);
    onChangeCoverLetter({
      ...coverLetter,
      templateId: tpl.id,
      templateName: tpl.name,
      tone: tpl.tone,
    });
  };

  // Font styling class
  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  // Font size styling
  const getSizeClass = () => {
    switch (fontSize) {
      case 'compact':
        return 'text-xs sm:text-[13px] leading-relaxed';
      case 'spacious':
        return 'text-sm sm:text-base leading-loose';
      default:
        return 'text-xs sm:text-sm leading-relaxed';
    }
  };

  // Theme accent colors
  const getThemeAccentBorder = () => {
    switch (visualTheme) {
      case 'executive-navy':
        return 'border-t-4 border-t-slate-800 dark:border-t-slate-300';
      case 'emerald-growth':
        return 'border-t-4 border-t-emerald-600';
      case 'crimson-bold':
        return 'border-t-4 border-t-rose-600';
      case 'slate-elegant':
        return 'border-t-4 border-t-zinc-600';
      case 'amber-warm':
        return 'border-t-4 border-t-amber-600';
      case 'minimal-monochrome':
        return 'border-t-4 border-t-zinc-400';
      default:
        return 'border-t-4 border-t-indigo-600';
    }
  };

  const recipientDisplay =
    candidateDetails.recipientTo || companyDetails.recipientName || 'Hiring Manager';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Sticky Prominent Top Action Bar with Direct Export Options */}
      <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-lg print:hidden transition-all">
        {/* Left: Back & Template Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToTemplates}
            id="btn-back-to-templates"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          {/* Template Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
              id="btn-switch-template-dropdown"
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="max-w-[130px] sm:max-w-[180px] truncate">
                {selectedTemplate.name}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {templateDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-72 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 p-2 space-y-1">
                <div className="text-[10px] uppercase font-bold text-zinc-400 px-2 py-1">
                  Switch Template (25):
                </div>
                {COVER_LETTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSwitchTemplate(tpl)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedTemplate.id === tpl.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="truncate">{tpl.name}</span>
                    <span className="text-[10px] text-zinc-400 font-medium ml-2">
                      {tpl.tone}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: AI Rewrite & Regenerate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRewriteModalOpen(true)}
            id="btn-open-rewrite-modal"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Rewrite / Rephrase</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            id="btn-regenerate-letter"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </span>
          </button>
        </div>

        {/* Right: Direct Export Action Group */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Print Button (Fixed & working) */}
          <button
            onClick={handlePrint}
            title="Print Document"
            id="btn-print-cover-letter-top"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopy}
            id="btn-copy-cover-letter"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Save to History */}
          <button
            onClick={handleSave}
            title="Save to history"
            id="btn-save-to-history"
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              savedSuccess
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Download DOCX */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExporting !== null}
            id="btn-download-docx"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download DOCX</span>
            <span className="md:hidden">DOCX</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting !== null}
            id="btn-download-pdf"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download PDF</span>
            <span className="md:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Style, Typography & Highlights Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4 print:hidden">
          {/* Document Metrics Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Document Metrics
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                  {wordCount}
                </span>
                <span className="text-[10px] text-zinc-400">Words</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                  {charCount}
                </span>
                <span className="text-[10px] text-zinc-400">Chars</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block">
                  {readingTime}m
                </span>
                <span className="text-[10px] text-zinc-400">Read</span>
              </div>
            </div>
          </div>

          {/* Typography & Layout Controls */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-4 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Document Formatting
            </h4>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Typography:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['sans', 'serif', 'mono'] as FontFamily[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFontFamily(f)}
                    className={`py-1.5 text-xs font-semibold rounded-xl capitalize border transition-all ${
                      fontFamily === f
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Density:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'compact', label: 'Compact' },
                  { id: 'standard', label: 'Standard' },
                  { id: 'spacious', label: 'Spacious' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFontSize(s.id as any)}
                    className={`py-1.5 text-xs font-semibold rounded-xl capitalize border transition-all ${
                      fontSize === s.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Accent Theme */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Accent Theme:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'modern-indigo', color: 'bg-indigo-600', label: 'Indigo' },
                  { id: 'executive-navy', color: 'bg-slate-800', label: 'Navy' },
                  { id: 'emerald-growth', color: 'bg-emerald-600', label: 'Emerald' },
                  { id: 'crimson-bold', color: 'bg-rose-600', label: 'Crimson' },
                  { id: 'slate-elegant', color: 'bg-zinc-600', label: 'Slate' },
                  { id: 'amber-warm', color: 'bg-amber-600', label: 'Amber' },
                  { id: 'minimal-monochrome', color: 'bg-zinc-400', label: 'Minimal' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setVisualTheme(t.id as VisualTheme)}
                    title={t.label}
                    className={`h-7 rounded-lg ${t.color} flex items-center justify-center transition-all ${
                      visualTheme === t.id
                        ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {visualTheme === t.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Button (Full width) */}
            <button
              onClick={handlePrint}
              id="btn-print-cover-letter-side"
              className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document Sheet</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive Document Sheet (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 print:hidden">
            <span className="flex items-center gap-1.5 font-medium">
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
              Click inside the document to make live edits. Changes auto-save in session.
            </span>
          </div>

          {/* Interactive Screen Paper Canvas Container */}
          <div
            id="cover-letter-paper"
            className={`w-full bg-white text-zinc-900 rounded-3xl shadow-xl border border-zinc-200 p-8 sm:p-12 md:p-16 space-y-6 ${getFontClass()} ${getSizeClass()} ${getThemeAccentBorder()}`}
          >
            {/* Candidate Contact Header */}
            <div className="border-b border-zinc-200 pb-4 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                {candidateDetails.name || coverLetter.candidateName || 'Applicant Name'}
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                {[
                  candidateDetails.email,
                  candidateDetails.phone,
                  candidateDetails.location,
                  candidateDetails.linkedin,
                  candidateDetails.portfolio,
                ]
                  .filter(Boolean)
                  .join('  •  ')}
              </p>
            </div>

            {/* Date (if enabled) */}
            {candidateDetails.includeDate !== false && (
              <div className="text-zinc-600 text-xs sm:text-sm">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Recipient Addressee Info */}
            <div className="text-xs sm:text-sm text-zinc-800 space-y-0.5">
              <div className="font-bold">{recipientDisplay}</div>
              {companyDetails.companyName && <div>{companyDetails.companyName}</div>}
              {companyDetails.jobTitle && (
                <div className="italic text-zinc-600">
                  Regarding: {companyDetails.jobTitle}
                </div>
              )}
            </div>

            {/* Editable Full Body Textarea */}
            <div className="space-y-4">
              <textarea
                value={coverLetter.fullFormattedLetter}
                onChange={(e) =>
                  onChangeCoverLetter({
                    ...coverLetter,
                    fullFormattedLetter: e.target.value,
                    updatedAt: new Date().toISOString(),
                  })
                }
                id="cover-letter-editable-textarea"
                rows={20}
                className="w-full bg-transparent border-none outline-none resize-none text-zinc-900 placeholder-zinc-400 focus:ring-0 p-0 leading-relaxed font-inherit"
                style={{
                  minHeight: '440px',
                }}
              />
            </div>
          </div>

          {/* Dedicated Clean Printable Area (Hidden on screen, Visible on Print) */}
          <div
            id="cover-letter-printable-area"
            className="hidden print:block font-sans text-[11pt] leading-relaxed text-zinc-900 space-y-6"
          >
            <div className="border-b border-zinc-300 pb-3 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {candidateDetails.name || coverLetter.candidateName || 'Applicant Name'}
              </h1>
              <p className="text-xs text-zinc-600">
                {[
                  candidateDetails.email,
                  candidateDetails.phone,
                  candidateDetails.location,
                  candidateDetails.linkedin,
                  candidateDetails.portfolio,
                ]
                  .filter(Boolean)
                  .join('  •  ')}
              </p>
            </div>

            {candidateDetails.includeDate !== false && (
              <div className="text-xs text-zinc-600">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            <div className="text-xs text-zinc-800 space-y-0.5">
              <div className="font-bold">{recipientDisplay}</div>
              {companyDetails.companyName && <div>{companyDetails.companyName}</div>}
            </div>

            <div className="print-text-content whitespace-pre-wrap text-zinc-900 leading-relaxed">
              {coverLetter.fullFormattedLetter}
            </div>
          </div>
        </div>
      </div>

      {/* AI Rewrite & Rephrase Assistant Modal */}
      <RewriteModal
        isOpen={isRewriteModalOpen}
        onClose={() => setIsRewriteModalOpen(false)}
        coverLetter={coverLetter}
        onApplyRewrite={handleApplyRewrite}
        resumeContext={resumeContext}
        jobDescriptionContext={jobDescriptionContext}
      />
    </div>
  );
};
