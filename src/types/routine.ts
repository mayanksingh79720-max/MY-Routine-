export type TaskStatus = 'pending' | 'current' | 'completed' | 'incomplete';

export interface RoutineTask {
  id: string;
  order: number;
  name: string;
  timeDisplay: string;
  startMinutes: number; // minutes from midnight (e.g. 5:00 AM = 300)
  endMinutes: number | null; // null for point-in-time milestones like 10:00 PM SLEEP
  isPhoneTime?: boolean;
  isMilestone?: boolean;
  category: 'morning' | 'study' | 'fitness' | 'meal' | 'break' | 'phone' | 'rest' | 'coding' | 'family' | 'wind_down' | 'sleep';
  iconName: string;
  enabled?: boolean; // whether task is active in schedule (default true)
}

export interface DayTaskRecord {
  completed: boolean;
  completedAt?: string; // ISO timestamp
  note?: string;
}

export interface DayProgress {
  date: string; // YYYY-MM-DD
  records: Record<string, DayTaskRecord>; // taskId -> record
}

export interface UserSettings {
  slowMode: boolean; // default true
  simulatedTimeMinutes: number | null; // null means use real device time
  disabledTaskIds: string[];
}
