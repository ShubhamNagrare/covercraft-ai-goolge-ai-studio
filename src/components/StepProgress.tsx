import React from 'react';
import {
  FileText,
  LayoutGrid,
  Sparkles,
  Check,
  Zap,
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
      subtitle: 'Resume + JD Analysis',
      icon: FileText,
      isCompleted: hasResume && hasJD,
    },
    {
      step: 2,
      title: 'Templates',
      subtitle: '25+ Styles & Tone',
      icon: LayoutGrid,
      isCompleted: true,
    },
    {
      step: 3,
      title: 'Studio & Export',
      subtitle: 'PDF, DOCX & Print',
      icon: Sparkles,
      isCompleted: hasCoverLetter,
    },
  ];

  return (
    <div
      id="app-stepper"
      className="w-full bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800/80 py-2.5 px-4 sm:px-6 print:hidden"
    >
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress" className="w-full">
          <ol className="grid grid-cols-3 gap-2 sm:gap-4">
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
                    className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 shadow-sm border border-indigo-200 dark:border-indigo-800/80'
                        : isClickable
                        ? 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 cursor-pointer opacity-90'
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-300 dark:ring-indigo-700'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {isPast && !isActive ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Step 0{item.step}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate hidden sm:block">
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
