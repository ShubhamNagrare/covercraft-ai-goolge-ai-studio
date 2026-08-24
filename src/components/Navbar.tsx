import React from 'react';
import {
  History,
  Sun,
  Moon,
  RotateCcw,
  HelpCircle,
  Mail,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenHistory: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onResetAll: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onSelectStep,
  isDarkMode,
  onToggleDarkMode,
  onOpenHistory,
  onOpenAbout,
  onOpenContact,
  onResetAll,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name: Creative Postman-inspired mark */}
        <div
          onClick={() => onSelectStep(1)}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="navbar-brand"
        >
          {/* Postman-Type Supersonic Postal Badge */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all duration-200">
            {/* Custom Postmark Vector Icon */}
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-5 h-5 drop-shadow-xs"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Envelope Body */}
              <path
                d="M4 8.5C4 7.11929 5.11929 6 6.5 6H25.5C26.8807 6 28 7.11929 28 8.5V23.5C28 24.8807 26.8807 26 25.5 26H6.5C5.11929 26 4 24.8807 4 23.5V8.5Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Fold lines */}
              <path
                d="M4.5 8L16 17.5L27.5 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Supersonic speed paper plane / postman dispatch accent */}
              <path
                d="M17 14L28 9.5L21.5 20.5L18 16.5L17 14Z"
                fill="#38BDF8"
                opacity="0.9"
              />
              <circle cx="23" cy="10" r="1.5" fill="white" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-zinc-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-white flex items-center font-sans">
                Cover<span className="text-indigo-600 dark:text-indigo-400">Craft</span>
                <span className="ml-1 text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80">
                  .ai
                </span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 hidden sm:inline-block">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium hidden sm:block">
              Precision Cover Letter Studio &amp; ATS Optimizer
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Reset */}
          <button
            onClick={onResetAll}
            title="Start New Cover Letter"
            id="nav-reset-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200/80 dark:border-zinc-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Letter</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            id="nav-history-btn"
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200/80 dark:border-zinc-800"
          >
            <History className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center px-1.5 min-w-4 h-4 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="nav-theme-toggle"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200/80 dark:border-zinc-800"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>

          {/* Top Right "Contact" Button */}
          <button
            onClick={onOpenContact}
            id="nav-contact-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/80 dark:border-zinc-700/80"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Contact</span>
          </button>

          {/* Top Right "ABOUT" Section Button */}
          <button
            onClick={onOpenAbout}
            id="nav-about-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ABOUT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
