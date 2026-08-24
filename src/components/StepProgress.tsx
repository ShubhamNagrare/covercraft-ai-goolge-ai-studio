import React from 'react';
import {
  FileText,
  LayoutGrid,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  hasResume: boolean;
  hasJD: boolean;
  hasCoverLetter: boolean;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onSelectStep,
  hasResume,
  hasJD,
  hasCoverLetter,
}) => {
  const steps = [
    {
      step: 1,
      title: 'Profile & Match',
      subtitle: 'Resume + Job Match',
      icon: FileText,
      isCompleted: hasResume && hasJD,
    },
    {
      step: 2,
      title: 'Templates & Tone',
      subtitle: 'Style & Strategy',
      icon: LayoutGrid,
      isCompleted: currentStep > 2 || hasCoverLetter,
    },
    {
      step: 3,
      title: 'Studio & Export',
      subtitle: 'PDF, DOCX & AI Tools',
      icon: Sparkles,
      isCompleted: hasCoverLetter,
    },
  ];

  return (
    <div
      id="app-stepper"
      className="w-full bg-slate-50/90 dark:bg-zinc-900/60 border-b border-slate-200/90 dark:border-zinc-800 py-3 px-4 sm:px-6 print:hidden shadow-xs"
    >
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress" className="w-full">
          <ol className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {steps.map((item) => {
              const Icon = item.icon;
              const isActive = currentStep === item.step;
              const isPast = currentStep > item.step || (item.isCompleted && !isActive);
              const isClickable =
                item.step <= currentStep ||
                (item.step === 2 && hasResume && hasJD) ||
                (item.step === 3 && hasCoverLetter);

              return (
                <li key={item.step} className="w-full">
                  <button
                    onClick={() => isClickable && onSelectStep(item.step)}
                    disabled={!isClickable}
                    id={`step-indicator-${item.step}`}
                    className={`w-full flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400 dark:ring-indigo-500 border border-indigo-400/50 scale-[1.01]'
                        : isPast
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/40 cursor-pointer shadow-xs'
                        : isClickable
                        ? 'bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-xs'
                        : 'bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 opacity-50 cursor-not-allowed text-zinc-500'
                    }`}
                  >
                    {/* Icon Badge */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/40 shadow-xs'
                          : isPast
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {isPast && !isActive ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="truncate min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            isActive
                              ? 'text-indigo-100'
                              : isPast
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          Step 0{item.step}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-xs">
                            Active
                          </span>
                        )}
                        {isPast && !isActive && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 hidden sm:inline-block">
                            Done
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${
                          isActive
                            ? 'text-white font-black'
                            : isPast
                            ? 'text-emerald-950 dark:text-emerald-100'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`text-[11px] truncate hidden sm:block ${
                          isActive
                            ? 'text-indigo-100/90'
                            : isPast
                            ? 'text-emerald-700/90 dark:text-emerald-400/90'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

