import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  Check,
  RotateCcw,
  ArrowRight,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { GeneratedCoverLetter } from '../types';

interface RewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverLetter: GeneratedCoverLetter;
  onApplyRewrite: (newFullText: string) => void;
  resumeContext: string;
  jobDescriptionContext: string;
}

export const RewriteModal: React.FC<RewriteModalProps> = ({
  isOpen,
  onClose,
  coverLetter,
  onApplyRewrite,
  resumeContext,
  jobDescriptionContext,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('punchy');
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('Confident');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewrittenOutput, setRewrittenOutput] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'punchy',
      title: 'Make It Punchier & More Concise',
      instruction: 'Cut out any filler words, tighten paragraph flow, and highlight hard numbers and impact metrics more directly.',
      tone: 'Concise',
    },
    {
      id: 'confident',
      title: 'Elevate Executive Confidence & Leadership',
      instruction: 'Elevate the vocabulary, project decisive authority and cross-team leadership, and frame accomplishments as strategic business wins.',
      tone: 'Confident',
    },
    {
      id: 'formal',
      title: 'Make It Highly Formal & Traditional',
      instruction: 'Convert phrasing to classic formal corporate decorum, with polite elevated salutations and respectful professional structure.',
      tone: 'Formal',
    },
    {
      id: 'warm',
      title: 'Make It Warm, Human & Collaborative',
      instruction: 'Inject genuine enthusiasm for team culture, mentorship, shared mission, and approachable human empathy.',
      tone: 'Warm',
    },
    {
      id: 'metric-driven',
      title: 'Emphasize Hard Metrics & Technical Results',
      instruction: 'Focus heavily on verified quantifiable results, performance benchmarks, and specific technical architectures from the resume.',
      tone: 'Direct',
    },
    {
      id: 'hook-overhaul',
      title: 'Write a More Captivating Opening Hook',
      instruction: 'Create an irresistible, unique opening paragraph that grabs the recruiter’s attention within the first 3 seconds.',
      tone: 'Confident',
    },
  ];

  const handleRunRewrite = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const activePreset = presets.find((p) => p.id === selectedPreset);
    const instruction =
      customInstruction.trim() ||
      activePreset?.instruction ||
      'Improve the clarity, impact, and phrasing of this cover letter.';

    const toneToUse = selectedTone || activePreset?.tone || 'Confident';

    try {
      const res = await fetch('/api/rewrite-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentText: coverLetter.fullFormattedLetter,
          instruction,
          tone: toneToUse,
          resumeContext,
          jobDescriptionContext,
        }),
      });

      if (!res.ok) {
        throw new Error('Rewrite request failed. Please try again.');
      }

      const data = await res.json();
      setRewrittenOutput(data.rewrittenText);
      setSummaryText(data.changesMadeSummary || 'Rewritten with enhanced phrasing and impact.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error executing rewrite.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (rewrittenOutput) {
      onApplyRewrite(rewrittenOutput);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                AI Rewrite & Rephrase Assistant
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Refine wording, adjust tone, or inject high-impact phrasing effortlessly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block">
              Choose an AI Polish Goal:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      setSelectedTone(preset.tone);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                        : 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{preset.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 font-semibold border border-zinc-200 dark:border-zinc-700">
                        {preset.tone}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {preset.instruction}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Instruction override */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block">
              Or Custom Rephrase Instruction:
            </label>
            <input
              type="text"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g. 'Make the 2nd paragraph emphasize my distributed systems experience more aggressively'..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Run button */}
          <button
            onClick={handleRunRewrite}
            disabled={isLoading}
            id="btn-run-rewrite"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Rephrasing with Gemini...' : 'Generate Rephrased Version'}</span>
          </button>

          {errorMessage && (
            <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
          )}

          {/* Output Comparison View */}
          {rewrittenOutput && (
            <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-4 h-4" />
                  {summaryText || 'Enhanced Result Ready'}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {rewrittenOutput.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-h-60 overflow-y-auto text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                {rewrittenOutput}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>

          {rewrittenOutput && (
            <button
              onClick={handleApply}
              id="btn-apply-rewritten-text"
              className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Replace Current Text in Editor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
