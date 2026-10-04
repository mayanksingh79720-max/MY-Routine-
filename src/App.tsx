import React, { useState, useEffect } from 'react';
import { DEFAULT_SCHEDULE } from './data/defaultSchedule';
import { RoutineTask, DayProgress, UserSettings } from './types/routine';
import {
  getDayProgress,
  toggleTaskCompletion,
  saveTaskNote,
  getUserSettings,
  saveUserSettings,
  resetDayProgress,
} from './utils/storage';
import {
  getCurrentMinutes,
  getTodayKey,
  getTaskStatus,
  getLiveTimeString,
} from './utils/timeUtils';
import { Navigation, NavTab } from './components/Navigation';
import { TodayScreen } from './screens/TodayScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TaskDetailModal } from './components/TaskDetailModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [todayKey] = useState<string>(getTodayKey());
  const [tasks] = useState<RoutineTask[]>(DEFAULT_SCHEDULE);
  const [dayProgress, setDayProgress] = useState<DayProgress>(() => getDayProgress(todayKey));
  const [settings, setSettings] = useState<UserSettings>(() => getUserSettings());
  const [deviceMinutes, setDeviceMinutes] = useState<number>(() => getCurrentMinutes(null));
  const [liveTimeStr, setLiveTimeStr] = useState<string>(() => getLiveTimeString());
  const [detailTask, setDetailTask] = useState<RoutineTask | null>(null);

  // Real-time ticking every second
  useEffect(() => {
    const updateTime = () => {
      setDeviceMinutes(getCurrentMinutes(null));
      setLiveTimeStr(getLiveTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMinutes = settings.simulatedTimeMinutes !== null
    ? settings.simulatedTimeMinutes
    : deviceMinutes;

  const handleToggleComplete = (taskId: string) => {
    const updated = toggleTaskCompletion(todayKey, taskId);
    setDayProgress({ ...updated });
  };

  const handleSaveNote = (taskId: string, note: string) => {
    const updated = saveTaskNote(todayKey, taskId, note);
    setDayProgress({ ...updated });
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  const handleResetToday = () => {
    const cleared = resetDayProgress(todayKey);
    setDayProgress({ ...cleared });
  };

  const handleOpenDetails = (task: RoutineTask) => {
    setDetailTask(task);
  };

  const handleCloseDetails = () => {
    setDetailTask(null);
  };

  // Determine current status of detailTask for the modal
  const detailTaskStatus = detailTask
    ? getTaskStatus(
        detailTask,
        currentMinutes,
        !!dayProgress.records[detailTask.id]?.completed
      )
    : 'pending';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col justify-between">
      {/* Top Banner if in Time Simulation mode */}
      {settings.simulatedTimeMinutes !== null && (
        <div className="bg-amber-100/90 text-amber-900 text-xs px-4 py-1.5 flex items-center justify-between border-b border-amber-200 sticky top-0 z-30">
          <span>
            Previewing at simulated time
          </span>
          <button
            onClick={() => handleUpdateSettings({ ...settings, simulatedTimeMinutes: null })}
            type="button"
            className="font-bold underline hover:text-amber-950 text-xs"
          >
            Switch to Live Clock
          </button>
        </div>
      )}

      {/* Desktop Top Header Bar (md:flex) */}
      <header className="hidden md:block bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Ritual
            </span>
            <span className="text-xs text-slate-400 font-medium">·</span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              Daily Companion
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrentTab('today')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  currentTab === 'today'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('history')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  currentTab === 'history'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                History & Stats
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('settings')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  currentTab === 'settings'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Settings
              </button>
            </nav>

            {/* Slow Mode Indicator */}
            {settings.slowMode && (
              <span className="text-xs text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-full font-medium border border-teal-200/50">
                Slow Mode Active
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive container across phone, tablet, and PC */}
      <main className="flex-1 w-full max-w-xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 pt-3 sm:pt-6">
        {currentTab === 'today' && (
          <TodayScreen
            tasks={tasks}
            dayProgress={dayProgress}
            settings={settings}
            currentMinutes={currentMinutes}
            liveTimeString={liveTimeStr}
            onToggleComplete={handleToggleComplete}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen tasks={tasks} />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            tasks={tasks}
            settings={settings}
            currentMinutes={currentMinutes}
            onUpdateSettings={handleUpdateSettings}
            onResetToday={handleResetToday}
          />
        )}
      </main>

      {/* Task Details Bottom Sheet Modal */}
      <TaskDetailModal
        task={detailTask}
        status={detailTaskStatus}
        initialNote={detailTask ? dayProgress.records[detailTask.id]?.note : ''}
        slowMode={settings.slowMode}
        isOpen={!!detailTask}
        onClose={handleCloseDetails}
        onSaveNote={handleSaveNote}
        onToggleComplete={handleToggleComplete}
      />

      {/* Fixed Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
