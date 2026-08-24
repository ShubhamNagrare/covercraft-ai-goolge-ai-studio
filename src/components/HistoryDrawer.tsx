import React, { useState } from 'react';
import {
  X,
  History,
  Trash2,
  Download,
  FolderOpen,
  Calendar,
  Building,
  Briefcase,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { SavedHistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedHistoryItem[];
  onLoadItem: (item: SavedHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.templateName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800 animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Saved Cover Letters
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {history.length} letter{history.length === 1 ? '' : 's'} saved locally
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

        {/* Search */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by job title, company, or template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-2">
              <FolderOpen className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-700" />
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                No saved cover letters found
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Generate a cover letter and click the save bookmark icon to store it for future review.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-900 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {item.title || 'Untitled Application'}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-zinc-400" />
                      <span>{item.company || 'Company'}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {item.templateName}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 italic font-serif">
                  "{item.coverLetter.openingParagraph || item.coverLetter.fullFormattedLetter.slice(0, 100)}..."
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <button
                    onClick={() => {
                      onLoadItem(item);
                      onClose();
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open in Editor</span>
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    title="Delete item"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-500 hover:underline font-medium"
            >
              Clear All Saved
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:opacity-90"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
