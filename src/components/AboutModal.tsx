import React from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  FileCheck,
  SlidersHorizontal,
  Download,
  MapPin,
  Heart,
  ExternalLink,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5l8-5" opacity="0.6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">About CoverCraft.ai</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
                  v2.5 Pro
                </span>
              </div>
              <p className="text-xs text-zinc-500">Precision Cover Letter Studio & ATS Optimizer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {/* Mission & Purpose */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              What is CoverCraft.ai?
            </h4>
            <p className="text-zinc-600 dark:text-zinc-300">
              CoverCraft.ai is a high-craft career studio created to solve modern job application fatigue. Instead of churning out generic, hallucinated AI summaries, CoverCraft.ai treats your uploaded resume as the strictly grounded single source of truth, performs semantic keyword matching against target job descriptions, and crafts tailored cover letters across 25+ industry templates.
            </p>
          </div>

          {/* Key Architectural Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Zero Hallucination Guardrails
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Only verified achievements and metrics from your resume are used in the generated letters. No fake degrees, invented employers, or false claims.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <Target className="w-4 h-4 text-indigo-500" />
                ATS Scoring & Optimization
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Real-time keyword gap analysis and 4-5 line actionable improvement pointers ensure your documents pass tier-1 applicant tracking systems.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                25+ Specialized Templates
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Tailored formats for Engineering, Product, Finance, Healthcare, Creative, Consulting, Startups, and regional requirements.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <Download className="w-4 h-4 text-purple-500" />
                Live Editor & Instant Export
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Full-featured document editor with font sizing, themes, digital signature toggles, and instant exports to PDF, Word DOCX, and Print.
              </p>
            </div>
          </div>

          {/* Creator Profile */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Engineering & Design
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Designed & built by Shubham Nagrare
              </h4>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-indigo-500" />
                <span>Bangalore, India</span>
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm shrink-0"
            >
              Contact Developer
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Crafted with craft & precision for job seekers</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
