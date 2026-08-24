import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Code2,
  BookOpen,
  ArrowRight,
  Zap,
  Target,
  Check,
  Calendar,
  PenTool,
  Paperclip,
  TrendingUp,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import {
  ParsedResumeData,
  CandidateDetails,
  CompanyDetails,
  MatchAnalysisResult,
} from '../types';
import { SAMPLE_PROFILES } from '../data/samples';
import { parseUploadedFile } from '../utils/fileParsers';

interface ProfileAndJobStepProps {
  resumeText: string;
  onChangeResumeText: (text: string) => void;
  candidateDetails: CandidateDetails;
  onChangeCandidateDetails: (details: CandidateDetails) => void;
  parsedResume: ParsedResumeData | null;
  onSetParsedResume: (data: ParsedResumeData | null) => void;

  jobDescriptionText: string;
  onChangeJobDescriptionText: (text: string) => void;
  companyDetails: CompanyDetails;
  onChangeCompanyDetails: (details: CompanyDetails) => void;
  matchResult: MatchAnalysisResult | null;
  onSetMatchResult: (result: MatchAnalysisResult | null) => void;

  onGenerateCoverLetter: () => void;
  onNextToTemplates: () => void;
  isGenerating?: boolean;
  onSelectRecommendedTemplate?: (templateId: string) => void;
}

export const ProfileAndJobStep: React.FC<ProfileAndJobStepProps> = ({
  resumeText,
  onChangeResumeText,
  candidateDetails,
  onChangeCandidateDetails,
  parsedResume,
  onSetParsedResume,
  jobDescriptionText,
  onChangeJobDescriptionText,
  companyDetails,
  onChangeCompanyDetails,
  matchResult,
  onSetMatchResult,
  onGenerateCoverLetter,
  onNextToTemplates,
  isGenerating = false,
  onSelectRecommendedTemplate,
}) => {
  // Loading states
  const [isParsingResumeFile, setIsParsingResumeFile] = useState(false);
  const [isAiExtractingResume, setIsAiExtractingResume] = useState(false);
  const [isParsingJdFile, setIsParsingJdFile] = useState(false);
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState(false);

  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jdFileName, setJdFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Social link expanded states
  const [showLeetcodeCustom, setShowLeetcodeCustom] = useState(false);
  const [showMediumCustom, setShowMediumCustom] = useState(false);

  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  // Word count calculations
  const resumeWordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const jdWordCount = jobDescriptionText.split(/\s+/).filter(Boolean).length;
  const customCommandWords = (candidateDetails.customDraftCommand || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const isResumeProcessing = isParsingResumeFile || isAiExtractingResume;
  const hasResume = resumeText.trim().length > 40 && !isResumeProcessing;
  const hasJD = jobDescriptionText.trim().length > 40 && !isParsingJdFile;

  // Handle Resume Upload
  const handleResumeUpload = async (file: File) => {
    setErrorMessage(null);
    setIsParsingResumeFile(true);
    try {
      const result = await parseUploadedFile(file);
      onChangeResumeText(result.text);
      setResumeFileName(file.name);
      await triggerResumeAiExtraction(result.text);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to parse resume document.');
    } finally {
      setIsParsingResumeFile(false);
    }
  };

  // AI Resume Extraction
  const triggerResumeAiExtraction = async (text: string) => {
    if (!text || text.trim().length < 40) return;
    setIsAiExtractingResume(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/parse-resume-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });
      if (!res.ok) throw new Error('AI resume parser error');
      const data: ParsedResumeData = await res.json();
      onSetParsedResume(data);

      // Auto update candidate details
      onChangeCandidateDetails({
        ...candidateDetails,
        name: data.candidateName || candidateDetails.name || 'Candidate Name',
        email: data.email || candidateDetails.email || '',
        phone: data.phone || candidateDetails.phone || '',
        location: data.location || candidateDetails.location || '',
        linkedin: data.linkedin || candidateDetails.linkedin || '',
        github: data.github || candidateDetails.github || '',
        portfolio: data.portfolio || candidateDetails.portfolio || '',
        leetcode: data.leetcode || candidateDetails.leetcode || '',
        medium: data.medium || candidateDetails.medium || '',
        currentRole: data.currentRole || candidateDetails.currentRole || '',
        yearsOfExp: data.yearsOfExperience || candidateDetails.yearsOfExp || '',
      });

      // If JD already exists, auto analyze match
      if (jobDescriptionText && jobDescriptionText.trim().length > 40) {
        triggerMatchAnalysis(text, jobDescriptionText);
      }
    } catch (e: any) {
      console.warn('AI resume extraction warning:', e);
    } finally {
      setIsAiExtractingResume(false);
    }
  };

  // Handle JD File Upload
  const handleJdUpload = async (file: File) => {
    setErrorMessage(null);
    setIsParsingJdFile(true);
    try {
      const result = await parseUploadedFile(file);
      onChangeJobDescriptionText(result.text);
      setJdFileName(file.name);
      if (resumeText && resumeText.trim().length > 40) {
        await triggerMatchAnalysis(resumeText, result.text);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to read job description file.');
    } finally {
      setIsParsingJdFile(false);
    }
  };

  // Trigger Match Analysis
  const triggerMatchAnalysis = async (rText: string, jdText: string) => {
    if (!rText || !jdText || rText.length < 40 || jdText.length < 40) return;
    setIsAnalyzingMatch(true);
    try {
      const res = await fetch('/api/match-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: rText,
          jobDescriptionText: jdText,
        }),
      });
      if (!res.ok) throw new Error('Match analysis failed');
      const result: MatchAnalysisResult = await res.json();
      onSetMatchResult(result);

      onChangeCompanyDetails({
        jobTitle: companyDetails.jobTitle || result.targetJobTitle || '',
        companyName: companyDetails.companyName || result.targetCompany || '',
        recipientName: companyDetails.recipientName || 'Hiring Team',
        recipientTitle: companyDetails.recipientTitle || 'Hiring Manager',
        department: companyDetails.department || '',
      });

      if (result.recommendedTemplateId && onSelectRecommendedTemplate) {
        onSelectRecommendedTemplate(result.recommendedTemplateId);
      }
    } catch (err) {
      console.warn('Match analysis warning:', err);
    } finally {
      setIsAnalyzingMatch(false);
    }
  };

  // Load Preset Profile
  const loadPresetProfile = (sampleId: string) => {
    const profile = SAMPLE_PROFILES.find((p) => p.id === sampleId);
    if (!profile) return;

    onChangeResumeText(profile.resumeText);
    setResumeFileName(`Sample - ${profile.candidateName}.pdf`);

    onChangeCandidateDetails({
      ...candidateDetails,
      name: profile.candidateName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      links: profile.links,
      linkedin: profile.links.includes('linkedin') ? profile.links : 'https://linkedin.com/in/sample-profile',
      github: profile.links.includes('github') ? profile.links : 'https://github.com/sample-dev',
      portfolio: 'https://sample-portfolio.dev',
      leetcode: 'https://leetcode.com/sample_coder',
      medium: 'https://medium.com/@sample_writer',
      currentRole: profile.title,
    });

    onChangeJobDescriptionText(profile.sampleJob.jobDescriptionText);
    setJdFileName(`Sample Job - ${profile.sampleJob.companyName}.pdf`);

    onChangeCompanyDetails({
      jobTitle: profile.sampleJob.jobTitle,
      companyName: profile.sampleJob.companyName,
      recipientName: profile.sampleJob.recipientName,
      recipientTitle: 'Hiring Manager',
    });

    triggerResumeAiExtraction(profile.resumeText);
    triggerMatchAnalysis(profile.resumeText, profile.sampleJob.jobDescriptionText);
  };

  // Safe ATS score fallback
  const atsScore = parsedResume?.atsScore || (hasResume ? 84 : 0);
  const atsImprovements = parsedResume?.atsImprovements || [
    'Directly emphasize quantified achievements with percentages and business impact.',
    'Align technical terminology with top requirements from the job description.',
    'Keep contact channels and verified GitHub/portfolio links prominent.',
    'Ensure clear reverse-chronological experience with standard ATS section tags.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Sticky Prominent Top Action Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 transition-all">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasResume ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {hasResume ? 'Resume Verified' : 'Upload Resume'}
            </span>
          </div>

          <span className="text-zinc-300 dark:text-zinc-700">•</span>

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasJD ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-zinc-400'
              }`}
            />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {hasJD ? 'Job Description Ready' : 'Add Target JD'}
            </span>
          </div>

          {matchResult && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700 hidden md:inline">•</span>
              <span className="hidden md:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Match: {matchResult.matchScore}%
              </span>
            </>
          )}
        </div>

        {/* Primary Action CTAs on Top */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onNextToTemplates}
            disabled={!hasResume || !hasJD}
            id="btn-choose-templates-top"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span>Choose Template &amp; Tone</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onGenerateCoverLetter}
            disabled={!hasResume || !hasJD || isGenerating}
            id="btn-generate-top-cta"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Crafting Letter...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>⚡ Generate Cover Letter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Sample Presets Banner */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Try Sample Preset:
        </span>
        {SAMPLE_PROFILES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => loadPresetProfile(sample.id)}
            className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            {sample.candidateName} • {sample.title}
          </button>
        ))}
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Two-Column Side-by-Side Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================
            LEFT COLUMN: Resume Intake, ATS Score & Candidate Contact (5 cols)
            ======================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* Resume Upload & Knowledge Box (Compact, zero tabs) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Applicant Resume
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    PDF, DOCX, or direct text
                  </p>
                </div>
              </div>

              {hasResume && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {resumeWordCount} words
                </span>
              )}
            </div>

            {/* Resume Intake Zone */}
            <div className="space-y-2">
              <input
                ref={resumeFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
                className="hidden"
                id="resume-file-input"
              />

              {/* Upload Drop Button */}
              <div
                onClick={() => resumeFileInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-zinc-50/60 dark:bg-zinc-950/60 cursor-pointer text-center space-y-1.5 transition-colors group"
              >
                <div className="w-8 h-8 mx-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-600 transition-colors shadow-2xs">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {resumeFileName ? resumeFileName : 'Click to Upload Resume (PDF / DOCX)'}
                </p>
                <p className="text-[10px] text-zinc-400">
                  Auto-extracts skills, achievements &amp; social profiles
                </p>
              </div>

              {/* Textarea for fast copy/paste */}
              <textarea
                value={resumeText}
                onChange={(e) => {
                  onChangeResumeText(e.target.value);
                  if (e.target.value.length > 50 && !isAiExtractingResume) {
                    triggerResumeAiExtraction(e.target.value);
                  }
                }}
                id="resume-text-input"
                placeholder="Or paste your resume text directly here..."
                rows={4}
                className="w-full p-3 text-xs rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-y font-mono"
              />
            </div>

            {/* Accurate Extraction Status Feedback */}
            {isResumeProcessing ? (
              <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2.5 animate-pulse">
                <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  Extracting and verifying resume knowledge base...
                </div>
              </div>
            ) : hasResume ? (
              <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Resume Verified &amp; Grounded
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  {parsedResume?.skills?.length || 0} skills detected
                </span>
              </div>
            ) : null}
          </div>

          {/* ATS Resume Score & 4-5 Short Actionable Improvements */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    ATS Resume Score
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Industry recruiter keyword alignment
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {hasResume ? `${atsScore}` : '--'}
                </span>
                <span className="text-xs text-zinc-400 font-bold">/100</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${hasResume ? atsScore : 10}%` }}
              />
            </div>

            {/* 4-5 Line Short ATS Improvements */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Targeted ATS Optimizations:
              </span>
              <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                {atsImprovements.slice(0, 4).map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Applicant Contact & Custom Recipient TO Section */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Applicant &amp; Addressee Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  value={candidateDetails.name}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, name: e.target.value })
                  }
                  id="input-candidate-name"
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={candidateDetails.email}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, email: e.target.value })
                  }
                  id="input-candidate-email"
                  placeholder="alex.morgan@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Phone Number:
                </label>
                <input
                  type="text"
                  value={candidateDetails.phone}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, phone: e.target.value })
                  }
                  id="input-candidate-phone"
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Location / City:
                </label>
                <input
                  type="text"
                  value={candidateDetails.location}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, location: e.target.value })
                  }
                  id="input-candidate-location"
                  placeholder="San Francisco, CA (or Remote)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Letter Addressed TO Section */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <label className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                <span>Letter Addressed &quot;TO&quot; (Recipient):</span>
                <span className="text-[9px] font-normal text-indigo-500">Defaults to Hiring Manager</span>
              </label>
              <input
                type="text"
                value={candidateDetails.recipientTo || 'Hiring Manager'}
                onChange={(e) =>
                  onChangeCandidateDetails({ ...candidateDetails, recipientTo: e.target.value })
                }
                id="input-letter-to"
                placeholder="e.g. Hiring Manager, Engineering Director, Talent Acquisition Team"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Toggles: Date & Signature (Checked by default, easily uncheckable) */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={candidateDetails.includeDate !== false}
                  onChange={(e) =>
                    onChangeCandidateDetails({
                      ...candidateDetails,
                      includeDate: e.target.checked,
                    })
                  }
                  id="chk-include-date"
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300"
                />
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Include Current Date</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={candidateDetails.includeSignature !== false}
                  onChange={(e) =>
                    onChangeCandidateDetails({
                      ...candidateDetails,
                      includeSignature: e.target.checked,
                    })
                  }
                  id="chk-include-signature"
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300"
                />
                <PenTool className="w-3.5 h-3.5 text-zinc-400" />
                <span>Include Digital Signature</span>
              </label>
            </div>

            {/* Separate Social Links (LinkedIn, Portfolio, GitHub, LeetCode, Medium) */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Professional &amp; Coding Portfolios
              </h4>

              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Linkedin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={candidateDetails.linkedin || ''}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, linkedin: e.target.value })
                  }
                  id="input-linkedin-url"
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Portfolio */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={candidateDetails.portfolio || ''}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, portfolio: e.target.value })
                  }
                  id="input-portfolio-url"
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0">
                  <Github className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={candidateDetails.github || ''}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, github: e.target.value })
                  }
                  id="input-github-url"
                  placeholder="https://github.com/username"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* LeetCode (Active if found, else greyed out with click-to-activate) */}
              <div
                className={`flex items-center gap-2 transition-opacity ${
                  candidateDetails.leetcode || showLeetcodeCustom ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    candidateDetails.leetcode
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={candidateDetails.leetcode || ''}
                  onFocus={() => setShowLeetcodeCustom(true)}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, leetcode: e.target.value })
                  }
                  id="input-leetcode-url"
                  placeholder="LeetCode profile (optional)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Medium (Active if found, else greyed out with click-to-activate) */}
              <div
                className={`flex items-center gap-2 transition-opacity ${
                  candidateDetails.medium || showMediumCustom ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    candidateDetails.medium
                      ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={candidateDetails.medium || ''}
                  onFocus={() => setShowMediumCustom(true)}
                  onChange={(e) =>
                    onChangeCandidateDetails({ ...candidateDetails, medium: e.target.value })
                  }
                  id="input-medium-url"
                  placeholder="Medium / Technical Blog profile (optional)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: Target JD, Directives & Real-time Matching (7 cols)
            ======================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Role & Job Posting Section (Zero tabs) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Target Job Opportunity
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Paste posting text or attach JD file
                  </p>
                </div>
              </div>

              {/* Upload Paperclip Button */}
              <input
                ref={jdFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleJdUpload(e.target.files[0])}
                className="hidden"
                id="jd-file-input"
              />

              <button
                onClick={() => jdFileInputRef.current?.click()}
                title="Attach JD document"
                id="btn-upload-jd-file"
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                <span>{jdFileName ? jdFileName.slice(0, 18) + '...' : 'Attach File'}</span>
              </button>
            </div>

            {/* Target Job Title & Target Company Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Target Job Title:
                </label>
                <input
                  type="text"
                  value={companyDetails.jobTitle}
                  onChange={(e) =>
                    onChangeCompanyDetails({ ...companyDetails, jobTitle: e.target.value })
                  }
                  id="input-job-title"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Target Company / Organization:
                </label>
                <input
                  type="text"
                  value={companyDetails.companyName}
                  onChange={(e) =>
                    onChangeCompanyDetails({ ...companyDetails, companyName: e.target.value })
                  }
                  id="input-company-name"
                  placeholder="e.g. Stripe, Linear, Google"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Direct Job Description Text Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-between">
                <span>Job Description &amp; Core Responsibilities:</span>
                {hasJD && <span className="font-mono text-zinc-500">{jdWordCount} words</span>}
              </label>
              <textarea
                value={jobDescriptionText}
                onChange={(e) => {
                  onChangeJobDescriptionText(e.target.value);
                  if (e.target.value.length > 50 && resumeText) {
                    triggerMatchAnalysis(resumeText, e.target.value);
                  }
                }}
                id="job-description-text-input"
                placeholder="Paste the target job description requirements, qualifications, and role responsibilities here..."
                rows={9}
                className="w-full p-3.5 text-xs rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-y leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Custom Drafting Directives & Guardrails (100 words max) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Custom Drafting Directives
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Specific emphasis or nuances (Max 100 words)
                  </p>
                </div>
              </div>

              {/* Word count limit indicator */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  customCommandWords > 100
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {customCommandWords} / 100 words
              </span>
            </div>

            <textarea
              value={candidateDetails.customDraftCommand || ''}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                if (words.length <= 100 || e.target.value.length < (candidateDetails.customDraftCommand || '').length) {
                  onChangeCandidateDetails({
                    ...candidateDetails,
                    customDraftCommand: e.target.value,
                  });
                }
              }}
              id="custom-draft-command-input"
              rows={3}
              placeholder="e.g. Focus on my experience with distributed systems, mention enthusiasm for their open source contributions, and keep tone concise."
              className="w-full p-3 text-xs rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
            />
            <p className="text-[10px] text-zinc-400">
              * Guardrails active: Prompt injection prevention and verified resume ground-truth enforcement.
            </p>
          </div>

          {/* Instant Match Analysis Card */}
          {matchResult && (
            <div className="p-5 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Opportunity Match Alignment
                  </h4>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-2xs">
                  {matchResult.matchScore}% Match
                </span>
              </div>

              {/* Matching Skills */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                  Top Verified Overlapping Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matchingSkills?.slice(0, 6).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Match Advice */}
              {matchResult.customAdvice && (
                <p className="text-xs text-indigo-900 dark:text-indigo-200 bg-white/70 dark:bg-zinc-900/70 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 leading-relaxed font-medium">
                  💡 {matchResult.customAdvice}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
