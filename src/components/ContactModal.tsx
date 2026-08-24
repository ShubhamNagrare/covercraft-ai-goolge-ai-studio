import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Globe,
  Github,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Sparkles,
  Send,
  X,
  Code2,
} from 'lucide-react';
import shubhamAvatar from '../assets/shubham.jpg';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const developer = {
    name: 'Shubham Nagrare',
    location: 'Bangalore, India',
    email: 'shubmnagrare@gmail.com',
    linkedin: 'https://www.linkedin.com/in/snagrare/',
    portfolio: 'https://shubhamnagrare.com',
    github: 'https://github.com/ShubhamNagrare',
    title: 'Frontend & Full-Stack Engineer • UI/UX Specialist',
    bio: 'Passionate about building highly intuitive, craft-first web applications with zero friction, beautiful micro-interactions, and robust AI integrations.',
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* User Profile Avatar */}
            <div className="relative">
              <img
                src={shubhamAvatar}
                alt="Shubham Nagrare"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/40 shadow-lg"
                onError={(e) => {
                  // Graceful fallback to stylized badge if image fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-indigo-600 flex items-center justify-center text-[9px]">
                ⚡
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">{developer.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Creator &amp; Lead
                </span>
              </div>
              <p className="text-xs text-indigo-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-indigo-200" />
                <span>{developer.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {developer.bio}
          </p>

          {/* Contact Channels Grid */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Get in Touch & Connect
            </h4>

            {/* Email */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 group hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Email</span>
                  <a
                    href={`mailto:${developer.email}`}
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                  >
                    {developer.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard(developer.email, 'email')}
                  title="Copy email"
                  className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`mailto:${developer.email}`}
                  className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 group hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">LinkedIn</span>
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                  >
                    {developer.linkedin}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard(developer.linkedin, 'linkedin')}
                  title="Copy LinkedIn URL"
                  className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copiedField === 'linkedin' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Portfolio */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 group hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Portfolio Website</span>
                  <a
                    href={developer.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate block"
                  >
                    {developer.portfolio}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard(developer.portfolio, 'portfolio')}
                  title="Copy Portfolio URL"
                  className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copiedField === 'portfolio' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={developer.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-zinc-200/70 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">GitHub Profile</span>
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                  >
                    {developer.github}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard(developer.github, 'github')}
                  title="Copy GitHub URL"
                  className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copiedField === 'github' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Designed & built by Shubham Nagrare</span>
          <span>Bangalore, India</span>
        </div>
      </div>
    </div>
  );
};
