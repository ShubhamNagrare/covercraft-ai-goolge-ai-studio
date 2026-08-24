import React, { useState, useRef } from 'react';
import {
  Briefcase,
  Building2,
  UserCheck,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Target,
} from 'lucide-react';
import { CompanyDetails, MatchAnalysisResult } from '../types';
import { SAMPLE_PROFILES } from '../data/samples';
import { parseUploadedFile } from '../utils/fileParsers';

interface JobDescriptionStepProps {
  jobDescriptionText: string;
  onChangeJobDescriptionText: (text: string) => void;
  companyDetails: CompanyDetails;
  onChangeCompanyDetails: (details: CompanyDetails) => void;
  resumeText: string;
  matchResult: MatchAnalysisResult | null;
  onSetMatchResult: (result: MatchAnalysisResult | null) => void;
  onNext: () => void;
  onBack: () => void;
  onSelectRecommendedTemplate?: (templateId: string) => void;
}

export const JobDescriptionStep: React.FC<JobDescriptionStepProps> = ({
  jobDescriptionText,
  onChangeJobDescriptionText,
  companyDetails,
  onChangeCompanyDetails,
  resumeText,
  matchResult,
  onSetMatchResult,
  onNext,
  onBack,
  onSelectRecommendedTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('text');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = jobDescriptionText.split(/\s+/).filter(Boolean).length;
  const characterCount = jobDescriptionText.length;

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    setIsParsingFile(true);
    try {
      const result = await parseUploadedFile(file);
      onChangeJobDescriptionText(result.text);
      setUploadedFileName(file.name);
      await triggerMatchAnalysis(result.text);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to read job description file.');
    } finally {
      setIsParsingFile(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerMatchAnalysis = async (jdTextToAnalyze: string) => {
    if (!jdTextToAnalyze || jdTextToAnalyze.trim().length < 40 || !resumeText) {
      return;
    }
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/match-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText: jdTextToAnalyze,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze match');
      }

      const result: MatchAnalysisResult = await res.json();
      onSetMatchResult(result);

      // Auto populate role & company if empty
      onChangeCompanyDetails({
        jobTitle: companyDetails.jobTitle || result.targetJobTitle || '',
        companyName: companyDetails.companyName || result.targetCompany || '',
        recipientName: companyDetails.recipientName || 'Hiring Team',
        department: companyDetails.department || '',
      });

      if (result.recommendedTemplateId && onSelectRecommendedTemplate) {
        onSelectRecommendedTemplate(result.recommendedTemplateId);
      }
    } catch (err: any) {
      console.warn('Match analysis issue:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleJob = (sampleId: string) => {
    const sample = SAMPLE_PROFILES.find((s) => s.id === sampleId);
    if (!sample) return;
    onChangeJobDescriptionText(sample.sampleJob.jobDescriptionText);
    setUploadedFileName(`Sample Job - ${sample.sampleJob.companyName}.pdf`);
    onChangeCompanyDetails({
      jobTitle: sample.sampleJob.jobTitle,
      companyName: sample.sampleJob.companyName,
      recipientName: sample.sampleJob.recipientName,
    });
    triggerMatchAnalysis(sample.sampleJob.jobDescriptionText);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          Step 2 of 5 • Target Job Description & Matching
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Add the Target Job Description
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Paste the job posting or upload a JD document. Our AI compares requirements directly against your verified resume to identify strengths and skill matches.
        </p>
      </div>

      {/* Quick Sample JD Presets */}
      <div className="bg-zinc-100/70 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Need a test JD? Load a sample:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_PROFILES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSampleJob(sample.id)}
              id={`load-sample-jd-${sample.id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              {sample.sampleJob.jobTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Target Details Form (Job Title, Company, Recipient) */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          Target Company & Position Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Target Job Title *
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-company-job-title"
                value={companyDetails.jobTitle}
                onChange={(e) =>
                  onChangeCompanyDetails({ ...companyDetails, jobTitle: e.target.value })
                }
                placeholder="e.g. Senior Software Engineer"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Company / Organization Name *
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-company-name"
                value={companyDetails.companyName}
                onChange={(e) =>
                  onChangeCompanyDetails({ ...companyDetails, companyName: e.target.value })
                }
                placeholder="e.g. Stripe, Acme Corp, NHS"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Hiring Manager / Team Salutation
            </label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-company-recipient"
                value={companyDetails.recipientName}
                onChange={(e) =>
                  onChangeCompanyDetails({ ...companyDetails, recipientName: e.target.value })
                }
                placeholder="e.g. Hiring Team, Jane Doe"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* JD Upload or Text Box */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Tab switch */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-1.5">
          <button
            onClick={() => setActiveTab('text')}
            id="tab-jd-text"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'text'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Plain Text / Job Posting {jobDescriptionText && `(${wordCount} words)`}
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            id="tab-jd-upload"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload File (PDF, DOCX, TXT)
          </button>
        </div>

        {activeTab === 'text' ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="jd-textarea"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Job Description Text (Responsibilities, Requirements, About Role):
              </label>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {wordCount} words • {characterCount} characters
              </span>
            </div>

            <textarea
              id="jd-textarea"
              rows={12}
              value={jobDescriptionText}
              onChange={(e) => onChangeJobDescriptionText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full p-4 text-xs sm:text-sm font-mono rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-y"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => triggerMatchAnalysis(jobDescriptionText)}
                disabled={isAnalyzing || !jobDescriptionText.trim() || !resumeText.trim()}
                id="btn-analyze-match"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing Resume vs JD Match...' : 'Analyze Resume-JD Match'}
              </button>

              {jobDescriptionText && (
                <button
                  onClick={() => onChangeJobDescriptionText('')}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear Job Description
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              id="jd-file-input"
            />
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              id="jd-dropzone"
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {isParsingFile ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                {isParsingFile
                  ? 'Extracting JD Document...'
                  : uploadedFileName
                  ? `Uploaded: ${uploadedFileName}`
                  : 'Upload Job Description Document'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                Supports PDF, DOCX, or TXT job specifications.
              </p>
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                Browse File
              </button>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real-time Match Breakdown Card */}
      {matchResult && (
        <div className="bg-gradient-to-br from-emerald-50/60 via-white to-indigo-50/40 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-indigo-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                <span className="text-base leading-none">{matchResult.matchScore}%</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-80">Match</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>Resume vs Role Match Analysis</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    High Compatibility
                  </span>
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Target: <strong className="text-zinc-800 dark:text-zinc-200">{matchResult.targetJobTitle}</strong> at <strong className="text-zinc-800 dark:text-zinc-200">{matchResult.targetCompany}</strong>
                </p>
              </div>
            </div>

            {matchResult.recommendedTemplateId && (
              <div className="text-right">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                  AI Recommended Template:
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {matchResult.suggestedIndustryCategory || 'Industry Specific'} ({matchResult.suggestedTone || 'Confident'})
                </span>
              </div>
            )}
          </div>

          {/* Strategic Advice */}
          {matchResult.customAdvice && (
            <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Tailoring Strategy: </strong>
                <span>{matchResult.customAdvice}</span>
              </div>
            </div>
          )}

          {/* Matched Skills vs Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="space-y-2 bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Matched Strengths & Skills ({matchResult.matchingSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Gap Skills / Safe Framing */}
            <div className="space-y-2 bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                JD Requirements to Frame Carefully ({matchResult.missingOrGapSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingOrGapSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          id="btn-jd-back"
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resume</span>
        </button>

        <button
          onClick={onNext}
          disabled={!jobDescriptionText.trim()}
          id="btn-jd-next"
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Choose Template & Tone (25+ Options)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
