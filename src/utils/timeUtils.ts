import { RoutineTask, TaskStatus } from '../types/routine';

export interface PhoneStatus {
  isPhoneAllowed: boolean;
  isBefore11AM: boolean;
  currentWindowName?: string;
  nextWindowText?: string;
}

export const PHONE_WINDOWS = [
  { start: 660, end: 690, label: '11:00–11:30 AM' },
  { start: 860, end: 890, label: '2:20–2:50 PM' },
  { start: 1215, end: 1245, label: '8:15–8:45 PM — Dinner + Phone' },
];

export function getCurrentMinutes(simulatedMinutes?: number | null): number {
  if (simulatedMinutes !== null && simulatedMinutes !== undefined) {
    return simulatedMinutes;
  }
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function formatMinutesToTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${period}`;
}

export function getTaskStatus(
  task: RoutineTask,
  currentMinutes: number,
  isCompleted: boolean
): TaskStatus {
  if (isCompleted) {
    return 'completed';
  }

  const isMilestone = task.isMilestone || task.endMinutes === null;
  const taskEnd = isMilestone ? task.startMinutes + 30 : (task.endMinutes ?? task.startMinutes + 30);

  if (currentMinutes >= task.startMinutes && currentMinutes < taskEnd) {
    return 'current';
  }

  if (currentMinutes >= taskEnd) {
    return 'incomplete';
  }

  return 'pending';
}

export function findNowAndUpNextTasks(
  tasks: RoutineTask[],
  currentMinutes: number
): {
  nowTask: RoutineTask | null;
  upNextTask: RoutineTask | null;
  isBeforeFirstTask: boolean;
} {
  const activeTasks = tasks.filter((t) => t.enabled !== false);
  if (activeTasks.length === 0) {
    return { nowTask: null, upNextTask: null, isBeforeFirstTask: false };
  }

  const firstTask = activeTasks[0];
  const isBeforeFirstTask = currentMinutes < firstTask.startMinutes;

  // Find currently active task
  let nowTask: RoutineTask | null = null;
  for (const task of activeTasks) {
    const isMilestone = task.isMilestone || task.endMinutes === null;
    const taskEnd = isMilestone ? task.startMinutes + 30 : (task.endMinutes ?? task.startMinutes + 30);
    if (currentMinutes >= task.startMinutes && currentMinutes < taskEnd) {
      nowTask = task;
      break;
    }
  }

  // Find UP NEXT task: the first task starting after current time
  // (or if inside nowTask, the first task starting after nowTask's start)
  let upNextTask: RoutineTask | null = null;
  for (const task of activeTasks) {
    if (task.startMinutes > currentMinutes) {
      upNextTask = task;
      break;
    }
  }

  return {
    nowTask,
    upNextTask,
    isBeforeFirstTask,
  };
}

export function getPhoneStatus(currentMinutes: number): PhoneStatus {
  const isBefore11AM = currentMinutes < 660; // 11:00 AM is 660 mins

  // Check if currently inside any allowed phone window
  const activeWindow = PHONE_WINDOWS.find(
    (w) => currentMinutes >= w.start && currentMinutes < w.end
  );

  if (activeWindow) {
    return {
      isPhoneAllowed: true,
      isBefore11AM: false,
      currentWindowName: activeWindow.label,
    };
  }

  // Find next window
  const nextWindow = PHONE_WINDOWS.find((w) => w.start > currentMinutes);
  let nextWindowText: string | undefined;

  if (nextWindow) {
    const diff = nextWindow.start - currentMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    nextWindowText = `Next window in ${timeStr} (${nextWindow.label})`;
  } else {
    nextWindowText = 'Next window tomorrow at 11:00 AM';
  }

  return {
    isPhoneAllowed: false,
    isBefore11AM,
    nextWindowText,
  };
}

export function getLiveTimeString(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minsStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${hours}:${minsStr}:${secsStr} ${period}`;
}

export function getGreeting(currentMinutes?: number): string {
  let hour: number;
  if (currentMinutes !== undefined && currentMinutes !== null) {
    hour = Math.floor(currentMinutes / 60);
  } else {
    hour = new Date().getHours();
  }
  if (hour < 12) return 'Good Morning 👋';
  if (hour < 17) return 'Good Afternoon 👋';
  return 'Good Evening 👋';
}

export function getFormattedToday(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
