import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Check,
  Globe,
  Briefcase,
  Building,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Zap,
  CheckCircle2,
  RefreshCw,
  Eye,
  Layers,
} from 'lucide-react';
import {
  CoverLetterTemplate,
  TemplateCategory,
  ToneType,
  MatchAnalysisResult,
  CandidateDetails,
  CompanyDetails,
} from '../types';
import { COVER_LETTER_TEMPLATES } from '../data/templates';

interface TemplateGalleryStepProps {
  selectedTemplate: CoverLetterTemplate;
  onSelectTemplate: (template: CoverLetterTemplate) => void;
  selectedTone: ToneType;
  onChangeTone: (tone: ToneType) => void;
  candidateDetails: CandidateDetails;
  companyDetails: CompanyDetails;
  matchResult: MatchAnalysisResult | null;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const TemplateGalleryStep: React.FC<TemplateGalleryStepProps> = ({
  selectedTemplate,
  onSelectTemplate,
  selectedTone,
  onChangeTone,
  candidateDetails,
  companyDetails,
  matchResult,
  onGenerate,
  onBack,
  isGenerating,
}) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tones: ToneType[] = [
    'Confident',
    'Direct',
    'Formal',
    'Warm',
    'Concise',
    'Executive',
    'Enthusiastic',
    'Technical',
  ];

  const categories = [
    { id: 'all', label: 'All Templates (25)', icon: Sparkles },
    { id: 'industry', label: 'Industry & Domain', icon: Briefcase },
    { id: 'company_style', label: 'Company & Culture', icon: Building },
    { id: 'geography', label: 'Regional Standards', icon: Globe },
    { id: 'tone', label: 'Tone Profiles', icon: SlidersHorizontal },
  ];

  const filteredTemplates = useMemo(() => {
    return COVER_LETTER_TEMPLATES.filter((tpl) => {
      const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.subcategory.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.recommendedFor.some((r) => r.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleAutoRecommend = () => {
    if (matchResult?.recommendedTemplateId) {
      const match = COVER_LETTER_TEMPLATES.find(
        (t) => t.id === matchResult.recommendedTemplateId
      );
      if (match) {
        onSelectTemplate(match);
        if (matchResult.suggestedTone) {
          onChangeTone(matchResult.suggestedTone as ToneType);
        }
      }
    }
  };

  const recipientDisplay =
    candidateDetails.recipientTo || companyDetails.recipientName || 'Hiring Manager';
  const roleDisplay = companyDetails.jobTitle || 'Target Role';
  const companyDisplay = companyDetails.companyName || 'Target Organization';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Sticky Prominent Top Action Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 transition-all">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
            title="Back to Step 1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Active Selection
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {selectedTemplate.name}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {selectedTone} Tone
              </span>
            </div>
          </div>
        </div>

        {/* Generate CTA Button on Top */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {matchResult && matchResult.recommendedTemplateId !== selectedTemplate.id && (
            <button
              onClick={handleAutoRecommend}
              id="btn-apply-recommended-top"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Use AI Recommendation</span>
            </button>
          )}

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            id="btn-generate-from-templates"
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Studio Letter...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>⚡ Generate Tailored Letter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TOP SECTION: Live Interactive Preview of Selected Template */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                Live Blueprint Preview
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs text-zinc-500">{selectedTemplate.subcategory}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              {selectedTemplate.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5 max-w-2xl">
              {selectedTemplate.description}
            </p>
          </div>

          {/* Tone Selector Carousel in Preview */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 block">
              Active Voice &amp; Tone:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeTone(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedTone === t
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Realistic Interactive Document Card Preview */}
        <div className="bg-zinc-50/80 dark:bg-zinc-950/80 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-4 font-sans text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed shadow-inner">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-white">
                {candidateDetails.name || 'Applicant Name'}
              </div>
              <div className="text-[11px] text-zinc-500">
                {[candidateDetails.email, candidateDetails.phone, candidateDetails.location]
                  .filter(Boolean)
                  .join(' • ') || 'email@example.com • +1 555-0199'}
              </div>
            </div>
            {candidateDetails.includeDate !== false && (
              <div className="text-[11px] text-zinc-400 font-mono">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            )}
          </div>

          {/* Addressee & Salutation */}
          <div className="space-y-0.5 text-zinc-700 dark:text-zinc-300 text-xs">
            <div className="font-semibold">{recipientDisplay}</div>
            <div className="text-zinc-500">{companyDisplay}</div>
            <div className="pt-2 font-bold text-indigo-600 dark:text-indigo-400">
              {selectedTemplate.greetingStyle.replace('Hiring Team', recipientDisplay)}
            </div>
          </div>

          {/* Blueprint Sample Hook */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 italic">
            &quot;{selectedTemplate.sampleHook}&quot;
          </div>

          {/* Structural Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="font-bold uppercase text-[10px] text-indigo-600 dark:text-indigo-400 block">
                Paragraph Strategy
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                {selectedTemplate.structureDescription}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="font-bold uppercase text-[10px] text-emerald-600 dark:text-emerald-400 block">
                Target Core Focus
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">{selectedTemplate.emphasis}</p>
            </div>
          </div>

          {/* Sign off */}
          <div className="pt-2 text-xs">
            <div>{selectedTemplate.closingStyle}</div>
            {candidateDetails.includeSignature !== false && (
              <div className="text-[10px] text-zinc-400 italic mt-0.5">[Digital Signature]</div>
            )}
            <div className="font-semibold text-zinc-900 dark:text-white">
              {candidateDetails.name || 'Applicant Name'}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Categorized Template Catalog (Click to preview instantly) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Browse 25+ Template Architectures
            </h3>
            <p className="text-xs text-zinc-500">
              Click any blueprint below to instantly update the live preview above.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Template Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            const isRecommended = matchResult?.recommendedTemplateId === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                id={`template-card-${tpl.id}`}
                className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-3 group ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-900 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]'
                    : 'bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {tpl.subcategory}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isRecommended && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                          AI Recommended
                        </span>
                      )}
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center group-hover:border-indigo-400" />
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Tone: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{tpl.tone}</strong></span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Preview
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
