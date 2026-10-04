import { DayProgress, UserSettings } from '../types/routine';
import { getTodayKey } from './timeUtils';

const PROGRESS_KEY = 'ritual_daily_progress_v2'; // Bumped key to completely flush old synthetic demo data
const SETTINGS_KEY = 'ritual_user_settings_v2';

export const DEFAULT_SETTINGS: UserSettings = {
  slowMode: true,
  simulatedTimeMinutes: null,
  disabledTaskIds: [],
};

// Purely real user data, zero demo or synthetic data
export function getAllHistory(): Record<string, DayProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse history from localStorage', e);
    return {};
  }
}

export function getDayProgress(dateKey: string = getTodayKey()): DayProgress {
  const history = getAllHistory();
  if (history[dateKey]) {
    return history[dateKey];
  }
  return {
    date: dateKey,
    records: {},
  };
}

export function saveDayProgress(dayProgress: DayProgress): void {
  try {
    const history = getAllHistory();
    history[dayProgress.date] = dayProgress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save day progress', e);
  }
}

export function toggleTaskCompletion(dateKey: string, taskId: string): DayProgress {
  const dayProgress = getDayProgress(dateKey);
  const currentRecord = dayProgress.records[taskId];
  const newCompleted = !currentRecord?.completed;

  dayProgress.records[taskId] = {
    ...currentRecord,
    completed: newCompleted,
    completedAt: newCompleted ? new Date().toISOString() : undefined,
  };

  saveDayProgress(dayProgress);
  return dayProgress;
}

export function saveTaskNote(dateKey: string, taskId: string, note: string): DayProgress {
  const dayProgress = getDayProgress(dateKey);
  const currentRecord = dayProgress.records[taskId] || { completed: false };

  dayProgress.records[taskId] = {
    ...currentRecord,
    note: note.trim(),
  };

  saveDayProgress(dayProgress);
  return dayProgress;
}

export function resetDayProgress(dateKey: string): DayProgress {
  const newProgress: DayProgress = {
    date: dateKey,
    records: {},
  };
  saveDayProgress(newProgress);
  return newProgress;
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
