import React, { useState } from 'react';
import { RoutineTask, UserSettings } from '../types/routine';
import { TaskIcon } from '../components/TaskIcon';
import { formatMinutesToTime } from '../utils/timeUtils';
import {
  ShieldCheck,
  Clock,
  RotateCcw,
  Smartphone,
  Sliders,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface SettingsScreenProps {
  tasks: RoutineTask[];
  settings: UserSettings;
  currentMinutes: number;
  onUpdateSettings: (settings: UserSettings) => void;
  onResetToday: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  tasks,
  settings,
  currentMinutes,
  onUpdateSettings,
  onResetToday,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const toggleSlowMode = () => {
    onUpdateSettings({
      ...settings,
      slowMode: !settings.slowMode,
    });
  };

  const toggleTaskDisabled = (taskId: string) => {
    const isCurrentlyDisabled = settings.disabledTaskIds.includes(taskId);
    let updated: string[];
    if (isCurrentlyDisabled) {
      updated = settings.disabledTaskIds.filter((id) => id !== taskId);
    } else {
      updated = [...settings.disabledTaskIds, taskId];
    }
    onUpdateSettings({
      ...settings,
      disabledTaskIds: updated,
    });
  };

  const setSimulatedMinutes = (minutes: number | null) => {
    onUpdateSettings({
      ...settings,
      simulatedTimeMinutes: minutes,
    });
  };

  const handleConfirmReset = () => {
    onResetToday();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  // Quick preset test times
  const timePresets = [
    { label: '5:05 AM (Morning)', minutes: 305 },
    { label: '6:00 AM (Tuition)', minutes: 360 },
    { label: '7:05 AM (Workout)', minutes: 425 },
    { label: '8:45 AM (Study 1)', minutes: 525 },
    { label: '11:15 AM (Phone Time)', minutes: 675 },
    { label: '1:15 PM (Power Nap)', minutes: 795 },
    { label: '2:30 PM (Phone Time)', minutes: 870 },
    { label: '8:25 PM (Dinner+Phone)', minutes: 1225 },
    { label: '10:00 PM (Sleep)', minutes: 1320 },
  ];

  return (
    <div className="space-y-6 pb-28">
      <header className="pt-2 px-1">
        <span className="text-sm font-medium text-teal-800 tracking-tight block">
          Preferences & Routine
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
          Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Customize routine pacing, active schedule items, and slow-mode tone.
        </p>
      </header>

      {/* Responsive Grid on Tablet & PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Slow Mode Section */}
          <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Slow Mode
                    </h2>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Prevents guilt and shame. Never displays "FAILED" banners. Reassures you that delayed or missed tasks can still be completed later in the day.
                  </p>
                </div>
              </div>

              {/* Accessible Switch */}
              <button
                onClick={toggleSlowMode}
                type="button"
                role="switch"
                aria-checked={settings.slowMode}
                className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-teal-500/20 shrink-0 ${
                  settings.slowMode ? 'bg-teal-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle Slow Mode"
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                    settings.slowMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Routine Core Rules Card */}
          <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Smartphone size={16} />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Fixed Routine Anchors
              </h2>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Your schedule is built around four daily pillars designed to eliminate morning phone distraction:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-800">Wake up</span>
                <span className="font-bold text-teal-700 tabular-nums">5:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-800">Tuition</span>
                <span className="font-bold text-teal-700 tabular-nums">5:45–6:35 AM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-800">Workout</span>
                <span className="font-bold text-teal-700 tabular-nums">7:00–7:15 AM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-800">Sleep</span>
                <span className="font-bold text-teal-700 tabular-nums">10:00 PM</span>
              </div>
            </div>
          </section>

          {/* Reset Today's Routine */}
          <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <RotateCcw size={16} />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Reset Today's Checks
                </h2>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Clear today's checked tasks and start fresh. Notes are preserved.
            </p>

            {resetSuccess && (
              <div className="mb-3 p-3 bg-teal-50 text-teal-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <Check size={14} className="text-teal-600" />
                Today's routine progress has been reset.
              </div>
            )}

            {showResetConfirm ? (
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                <div className="flex items-start gap-2 text-xs text-rose-800">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>Are you sure you want to uncheck all completed tasks for today?</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    type="button"
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    type="button"
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Yes, Reset Today
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                type="button"
                className="w-full py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Today's Routine
              </button>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Time Simulation / Clock preview */}
          <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Clock & Testing Preview
                </h2>
              </div>
              {settings.simulatedTimeMinutes !== null && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Simulated: {formatMinutesToTime(settings.simulatedTimeMinutes)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              The app uses your device's real clock. You can also preview routine states across different hours.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setSimulatedMinutes(null)}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  settings.simulatedTimeMinutes === null
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Live Device Time
              </button>
              {timePresets.map((preset) => {
                const isActive = settings.simulatedTimeMinutes === preset.minutes;
                return (
                  <button
                    key={preset.minutes}
                    onClick={() => setSimulatedMinutes(preset.minutes)}
                    type="button"
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active Schedule Tasks Management */}
          <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Sliders size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Active Routine Blocks
                  </h2>
                  <p className="text-xs text-slate-500">
                    {tasks.length - settings.disabledTaskIds.length} of {tasks.length} active
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Disabled tasks are excluded from today's progress calculation and timeline.
            </p>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {tasks.map((task) => {
                const isDisabled = settings.disabledTaskIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <TaskIcon name={task.iconName} size={13} />
                      </div>
                      <div className="min-w-0">
                        <span className={`block font-medium truncate ${isDisabled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {task.name}
                        </span>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {task.timeDisplay}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTaskDisabled(task.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        isDisabled
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {isDisabled ? 'Disabled' : 'Active'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
