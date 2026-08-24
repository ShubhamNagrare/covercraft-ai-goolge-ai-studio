import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
} from 'lucide-react';
import {
  CandidateDetails,
  CompanyDetails,
  CoverLetterTemplate,
  GeneratedCoverLetter,
  MatchAnalysisResult,
  ParsedResumeData,
  SavedHistoryItem,
  ToneType,
} from './types';
import { COVER_LETTER_TEMPLATES } from './data/templates';
import { storage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { StepProgress } from './components/StepProgress';
import { ProfileAndJobStep } from './components/ProfileAndJobStep';
import { TemplateGalleryStep } from './components/TemplateGalleryStep';
import { CoverLetterEditor } from './components/CoverLetterEditor';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AuthorSection } from './components/AuthorSection';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';

export default function App() {
  // Dark mode state (persisted)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('postcraft_darkmode');
    return saved !== null ? saved === 'true' : true;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('postcraft_darkmode', String(isDarkMode));
  }, [isDarkMode]);

  // Stepper state (1: Profile & Job Match, 2: Template & Tone Catalog, 3: Studio & Instant Export)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Resume Data State
  const [resumeText, setResumeText] = useState<string>(() => storage.getLastResume());
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails>(() => {
    return (
      storage.getCandidate() || {
        name: '',
        email: '',
        phone: '',
        location: '',
        links: '',
        linkedin: '',
        github: '',
        portfolio: '',
        leetcode: '',
        medium: '',
        currentRole: '',
        yearsOfExp: '',
        recipientTo: 'Hiring Manager',
        includeSignature: true,
        includeDate: true,
        customDraftCommand: '',
      }
    );
  });
  const [parsedResume, setParsedResume] = useState<ParsedResumeData | null>(null);

  // Job Description State
  const [jobDescriptionText, setJobDescriptionText] = useState<string>(() =>
    storage.getLastJD()
  );
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>(() => {
    return (
      storage.getCompany() || {
        jobTitle: '',
        companyName: '',
        recipientName: 'Hiring Team',
        recipientTitle: 'Hiring Manager',
        department: '',
      }
    );
  });
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);

  // Template & Tone State
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate>(
    COVER_LETTER_TEMPLATES[0]
  );
  const [selectedTone, setSelectedTone] = useState<ToneType>('Confident');

  // Generated Cover Letter State
  const [coverLetter, setCoverLetter] = useState<GeneratedCoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Modals state
  const [savedHistory, setSavedHistory] = useState<SavedHistoryItem[]>(() =>
    storage.getHistory()
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Storage persistence
  useEffect(() => {
    if (resumeText) storage.saveLastResume(resumeText);
  }, [resumeText]);

  useEffect(() => {
    if (jobDescriptionText) storage.saveLastJD(jobDescriptionText);
  }, [jobDescriptionText]);

  useEffect(() => {
    storage.saveCandidate(candidateDetails);
  }, [candidateDetails]);

  useEffect(() => {
    storage.saveCompany(companyDetails);
  }, [companyDetails]);

  // Main Generation Handler
  const handleGenerateCoverLetter = async () => {
    if (!resumeText.trim()) {
      setCurrentStep(1);
      return;
    }
    if (!jobDescriptionText.trim()) {
      setCurrentStep(1);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText,
          template: selectedTemplate,
          tone: selectedTone,
          customInstructions: candidateDetails.customDraftCommand || '',
          candidateDetails,
          companyDetails,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const newCoverLetter: GeneratedCoverLetter = {
        id: 'cl_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        tone: selectedTone,
        subjectLine: data.subjectLine || `Application for ${companyDetails.jobTitle || 'Target Role'}`,
        salutation: data.salutation || selectedTemplate.greetingStyle,
        openingParagraph: data.openingParagraph || '',
        bodyParagraphs: data.bodyParagraphs || [],
        closingParagraph: data.closingParagraph || '',
        signOff: data.signOff || selectedTemplate.closingStyle,
        candidateName: candidateDetails.name || data.candidateName || 'Applicant',
        fullFormattedLetter: data.fullFormattedLetter || '',
        highlightsUsed: data.highlightsUsed || [],
        wordCount: data.wordCount || 0,
        readingTimeMinutes: data.readingTimeMinutes || 1,
        matchScore: matchResult?.matchScore || 90,
        jobTitle: companyDetails.jobTitle,
        companyName: companyDetails.companyName,
      };

      setCoverLetter(newCoverLetter);
      setCurrentStep(3); // Navigate to AI Studio & Instant Export
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationError(
        err.message || 'Failed to generate tailored cover letter. Please retry.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Save to history
  const handleSaveToHistory = () => {
    if (!coverLetter) return;
    const historyItem: SavedHistoryItem = {
      id: coverLetter.id,
      title: companyDetails.jobTitle || 'Cover Letter Application',
      company: companyDetails.companyName || 'Target Company',
      date: coverLetter.updatedAt || coverLetter.createdAt,
      templateId: coverLetter.templateId,
      templateName: coverLetter.templateName,
      matchScore: coverLetter.matchScore,
      coverLetter,
      resumeSnippet: resumeText.slice(0, 150),
      jdSnippet: jobDescriptionText.slice(0, 150),
    };
    storage.saveHistoryItem(historyItem);
    setSavedHistory(storage.getHistory());
  };

  // Load from history
  const handleLoadHistoryItem = (item: SavedHistoryItem) => {
    setCoverLetter(item.coverLetter);
    const tpl = COVER_LETTER_TEMPLATES.find((t) => t.id === item.coverLetter.templateId);
    if (tpl) setSelectedTemplate(tpl);
    if (item.coverLetter.jobTitle) {
      setCompanyDetails((prev) => ({
        ...prev,
        jobTitle: item.coverLetter.jobTitle || prev.jobTitle,
        companyName: item.coverLetter.companyName || prev.companyName,
      }));
    }
    setCurrentStep(3); // Open in Editor & Export
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    storage.deleteHistoryItem(id);
    setSavedHistory(storage.getHistory());
  };

  const handleClearAllHistory = () => {
    storage.clearHistory();
    setSavedHistory([]);
  };

  // Reset to fresh start
  const handleResetAll = () => {
    if (confirm('Start a new cover letter? Your saved history will be preserved.')) {
      setResumeText('');
      setJobDescriptionText('');
      setParsedResume(null);
      setMatchResult(null);
      setCoverLetter(null);
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Navigation */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onResetAll={handleResetAll}
        savedCount={savedHistory.length}
      />

      {/* Stepper Progress Indicator */}
      <StepProgress
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        hasResume={Boolean(resumeText.trim())}
        hasJD={Boolean(jobDescriptionText.trim())}
        hasCoverLetter={Boolean(coverLetter)}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full">
        {/* Error banner if any */}
        {generationError && (
          <div className="max-w-5xl mx-auto px-4 mt-6 print:hidden">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{generationError}</span>
            </div>
          </div>
        )}

        {/* Step 1: Profile & Opportunity Match (Unified side-by-side, no tab switching) */}
        {currentStep === 1 && (
          <ProfileAndJobStep
            resumeText={resumeText}
            onChangeResumeText={setResumeText}
            candidateDetails={candidateDetails}
            onChangeCandidateDetails={setCandidateDetails}
            parsedResume={parsedResume}
            onSetParsedResume={setParsedResume}
            jobDescriptionText={jobDescriptionText}
            onChangeJobDescriptionText={setJobDescriptionText}
            companyDetails={companyDetails}
            onChangeCompanyDetails={setCompanyDetails}
            matchResult={matchResult}
            onSetMatchResult={setMatchResult}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onNextToTemplates={() => setCurrentStep(2)}
            isGenerating={isGenerating}
            onSelectRecommendedTemplate={(tplId) => {
              const tpl = COVER_LETTER_TEMPLATES.find((t) => t.id === tplId);
              if (tpl) setSelectedTemplate(tpl);
            }}
          />
        )}

        {/* Step 2: Template & Tone Catalog (Live preview on top + rich catalog below) */}
        {currentStep === 2 && (
          <TemplateGalleryStep
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            selectedTone={selectedTone}
            onChangeTone={setSelectedTone}
            candidateDetails={candidateDetails}
            companyDetails={companyDetails}
            matchResult={matchResult}
            onGenerate={handleGenerateCoverLetter}
            onBack={() => setCurrentStep(1)}
            isGenerating={isGenerating}
          />
        )}

        {/* Step 3: AI Studio & Instant Export (Working print, PDF, DOCX, copy, rewrite) */}
        {currentStep === 3 && coverLetter && (
          <CoverLetterEditor
            coverLetter={coverLetter}
            onChangeCoverLetter={setCoverLetter}
            candidateDetails={candidateDetails}
            companyDetails={companyDetails}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onRegenerate={handleGenerateCoverLetter}
            onSaveToHistory={handleSaveToHistory}
            onBackToTemplates={() => setCurrentStep(2)}
            resumeContext={resumeText}
            jobDescriptionContext={jobDescriptionText}
            isRegenerating={isGenerating}
          />
        )}
      </main>

      {/* Footer Section */}
      <AuthorSection
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={savedHistory}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
