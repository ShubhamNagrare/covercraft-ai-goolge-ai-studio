import React from 'react';
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  Heart,
  Sparkles,
  ExternalLink,
  MapPin,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import shubhamAvatar from '../assets/shubham.jpg';

interface AuthorSectionProps {
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({
  onOpenAbout,
  onOpenContact,
}) => {
  const email = 'shubmnagrare@gmail.com';
  const linkedin = 'https://www.linkedin.com/in/snagrare/';
  const portfolio = 'https://shubhamnagrare.com';
  const github = 'https://github.com/ShubhamNagrare';

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md py-6 px-4 sm:px-6 mt-16 transition-colors print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand and Mission */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight">Cover<span className="text-indigo-600 dark:text-indigo-400">Craft</span>.ai</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                v2.5 Pro
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Grounded AI Letter Studio • Zero Hallucinations • 25+ Templates
            </p>
          </div>
        </div>

        {/* Center: Author Credit */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <img
            src={shubhamAvatar}
            alt="Shubham Nagrare"
            className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-500/50 shadow-2xs inline-block"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span>Designed &amp; built by</span>
          <button
            onClick={onOpenContact}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Shubham Nagrare
          </button>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-500 inline" />
            Bangalore, India
          </span>
        </div>

        {/* Right: Quick Action Buttons & Links */}
        <div className="flex items-center gap-2">
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              id="footer-contact-button"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          )}

          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              id="footer-about-button"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
          )}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {/* Social Links */}
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="p-1.5 rounded-lg hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio Website"
              className="p-1.5 rounded-lg hover:text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
