import { SavedHistoryItem, CandidateDetails, CompanyDetails } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'clg_history_v1',
  CANDIDATE: 'clg_candidate_v1',
  COMPANY: 'clg_company_v1',
  THEME: 'clg_theme_v1',
  LAST_RESUME: 'clg_last_resume_v1',
  LAST_JD: 'clg_last_jd_v1',
};

export const storage = {
  getHistory(): SavedHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistoryItem(item: SavedHistoryItem): void {
    try {
      const history = this.getHistory();
      const existingIdx = history.findIndex((h) => h.id === item.id);
      if (existingIdx >= 0) {
        history[existingIdx] = item;
      } else {
        history.unshift(item);
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save to history', e);
    }
  },

  deleteHistoryItem(id: string): void {
    try {
      const history = this.getHistory().filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to delete history item', e);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  },

  getCandidate(): CandidateDetails | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCandidate(candidate: CandidateDetails): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATE, JSON.stringify(candidate));
    } catch (e) {
      console.error('Failed to save candidate', e);
    }
  },

  getCompany(): CompanyDetails | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCompany(company: CompanyDetails): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    } catch (e) {
      console.error('Failed to save company', e);
    }
  },

  getLastResume(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_RESUME) || '';
  },

  saveLastResume(text: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_RESUME, text);
    } catch (e) {
      console.error('Failed to save last resume', e);
    }
  },

  getLastJD(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_JD) || '';
  },

  saveLastJD(text: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_JD, text);
    } catch (e) {
      console.error('Failed to save last JD', e);
    }
  },
};
