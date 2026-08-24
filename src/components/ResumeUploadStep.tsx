import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Zap,
  ArrowRight,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { ParsedResumeData, CandidateDetails } from '../types';
import { SAMPLE_PROFILES } from '../data/samples';
import { parseUploadedFile } from '../utils/fileParsers';

interface ResumeUploadStepProps {
  resumeText: string;
  onChangeResumeText: (text: string) => void;
  candidateDetails: CandidateDetails;
  onChangeCandidateDetails: (details: CandidateDetails) => void;
  parsedResume: ParsedResumeData | null;
  onSetParsedResume: (data: ParsedResumeData | null) => void;
  onNext: () => void;
}

export const ResumeUploadStep: React.FC<ResumeUploadStepProps> = ({
  resumeText,
  onChangeResumeText,
  candidateDetails,
  onChangeCandidateDetails,
  parsedResume,
  onSetParsedResume,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isAiExtracting, setIsAiExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const characterCount = resumeText.length;

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    setIsParsingFile(true);
    try {
      const result = await parseUploadedFile(file);
      onChangeResumeText(result.text);
      setUploadedFileName(file.name);

      // Auto trigger AI extraction for structure
      await triggerAiExtraction(result.text);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to read file. Please paste your resume text below.');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const triggerAiExtraction = async (textToExtract: string) => {
    if (!textToExtract || textToExtract.trim().length < 50) return;
    setIsAiExtracting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/parse-resume-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: textToExtract }),
      });

      if (!res.ok) {
        throw new Error('Could not analyze resume with AI');
      }

      const data: ParsedResumeData = await res.json();
      onSetParsedResume(data);

      // Auto-update candidate contact info if present
      onChangeCandidateDetails({
        name: data.candidateName || candidateDetails.name,
        email: data.email || candidateDetails.email,
        phone: data.phone || candidateDetails.phone,
        location: data.location || candidateDetails.location,
        links: data.linkedin || data.github || data.portfolio || candidateDetails.links,
        currentRole: data.currentRole || candidateDetails.currentRole,
        yearsOfExp: data.yearsOfExperience || candidateDetails.yearsOfExp,
      });
    } catch (err: any) {
      console.warn('AI extraction warning:', err);
    } finally {
      setIsAiExtracting(false);
    }
  };

  const loadSample = (sampleId: string) => {
    const profile = SAMPLE_PROFILES.find((p) => p.id === sampleId);
    if (!profile) return;
    onChangeResumeText(profile.resumeText);
    setUploadedFileName(`Sample - ${profile.candidateName}.pdf`);
    onChangeCandidateDetails({
      name: profile.candidateName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      links: profile.links,
      currentRole: profile.title,
    });
    triggerAiExtraction(profile.resumeText);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          Step 1 of 5 • Resume Knowledge Base
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Upload Your Resume
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The app will parse your resume into a personalized knowledge base of skills, metrics, and verified achievements so your cover letter contains 0% hallucinations.
        </p>
      </div>

      {/* Quick Presets / Try Sample */}
      <div className="bg-zinc-100/70 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Want to test quickly? Load a sample profile:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_PROFILES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample.id)}
              id={`load-sample-${sample.id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              {sample.candidateName} ({sample.category})
            </button>
          ))}
        </div>
      </div>

      {/* Upload Box / Input Tabs */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Tab switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-1.5">
          <button
            onClick={() => setActiveTab('upload')}
            id="tab-resume-upload"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            File Upload (PDF, DOCX, TXT)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            id="tab-resume-text"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'text'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Direct Text Editor {resumeText && `(${wordCount} words)`}
          </button>
        </div>

        {/* Tab 1: File Dropzone */}
        {activeTab === 'upload' && (
          <div className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={handleFileChange}
              id="resume-file-input"
            />
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              id="resume-dropzone"
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]'
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
                  ? 'Extracting and parsing document...'
                  : uploadedFileName
                  ? `Uploaded: ${uploadedFileName}`
                  : 'Drag and drop your Resume here, or browse'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                Supports Adobe PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) files up to 10MB.
              </p>

              <button
                type="button"
                id="browse-resume-btn"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
              >
                Select Resume File
              </button>
            </div>

            {uploadedFileName && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Resume loaded successfully ({wordCount} words, {characterCount} chars)</span>
                </div>
                <button
                  onClick={() => setActiveTab('text')}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 underline"
                >
                  View/Edit Text
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Text Area Editor */}
        {activeTab === 'text' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="resume-textarea"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Paste or Edit Your Full Resume Text:
              </label>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {wordCount} words • {characterCount} characters
              </span>
            </div>

            <textarea
              id="resume-textarea"
              rows={12}
              value={resumeText}
              onChange={(e) => onChangeResumeText(e.target.value)}
              placeholder="Paste your full resume here (Contact, Experience, Achievements, Skills, Education)..."
              className="w-full p-4 text-xs sm:text-sm font-mono rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-y"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => triggerAiExtraction(resumeText)}
                disabled={isAiExtracting || !resumeText.trim()}
                id="btn-re-extract-ai"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiExtracting ? 'animate-spin' : ''}`} />
                {isAiExtracting ? 'Extracting with Gemini...' : 'Re-Analyze Resume with AI'}
              </button>

              {resumeText && (
                <button
                  onClick={() => onChangeResumeText('')}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear Resume
                </button>
              )}
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

      {/* Candidate Contact & Header Details */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Applicant Contact Details
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              These details will be used in your cover letter header. Edit if needed.
            </p>
          </div>
          {isAiExtracting && (
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Auto-extracting from resume...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-candidate-name"
                value={candidateDetails.name}
                onChange={(e) =>
                  onChangeCandidateDetails({ ...candidateDetails, name: e.target.value })
                }
                placeholder="e.g. Alex Mercer"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                id="input-candidate-email"
                value={candidateDetails.email}
                onChange={(e) =>
                  onChangeCandidateDetails({ ...candidateDetails, email: e.target.value })
                }
                placeholder="e.g. alex@example.com"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-candidate-phone"
                value={candidateDetails.phone}
                onChange={(e) =>
                  onChangeCandidateDetails({ ...candidateDetails, phone: e.target.value })
                }
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Location / City
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-candidate-location"
                value={candidateDetails.location}
                onChange={(e) =>
                  onChangeCandidateDetails({ ...candidateDetails, location: e.target.value })
                }
                placeholder="e.g. San Francisco, CA / London, UK"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              LinkedIn / Portfolio / GitHub Links
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                id="input-candidate-links"
                value={candidateDetails.links}
                onChange={(e) =>
                  onChangeCandidateDetails({ ...candidateDetails, links: e.target.value })
                }
                placeholder="e.g. linkedin.com/in/alex • github.com/alex"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Knowledge Base preview (if available) */}
      {parsedResume && (
        <div className="bg-gradient-to-br from-indigo-50/50 to-zinc-50 dark:from-indigo-950/20 dark:to-zinc-900/50 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Verified Resume Knowledge Base
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {parsedResume.currentRole || 'Professional Profile'} • {parsedResume.yearsOfExperience || 'Experienced'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Ground Truth Active
            </span>
          </div>

          {/* Key Skills Tags */}
          {parsedResume.skills && parsedResume.skills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                Extracted Skills & Competencies ({parsedResume.skills.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {parsedResume.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Achievements & Quantifiable Metrics */}
          {parsedResume.keyAchievements && parsedResume.keyAchievements.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Quantifiable Achievements & Metrics:
              </span>
              <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                {parsedResume.keyAchievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Navigation Next CTA */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!resumeText.trim()}
          id="btn-resume-next"
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Continue to Job Description</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
