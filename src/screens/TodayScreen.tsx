import React, { useState } from 'react';
import { RoutineTask, DayProgress, UserSettings } from '../types/routine';
import {
  findNowAndUpNextTasks,
  getGreeting,
  getFormattedToday,
  getTaskStatus,
} from '../utils/timeUtils';
import { ProgressCard } from '../components/ProgressCard';
import { NowCard } from '../components/NowCard';
import { UpNextCard } from '../components/UpNextCard';
import { PhoneRuleCard } from '../components/PhoneRuleCard';
import { TimelineTaskRow } from '../components/TimelineTaskRow';
import { LayoutGrid, Rows3 } from 'lucide-react';

interface TodayScreenProps {
  tasks: RoutineTask[];
  dayProgress: DayProgress;
  settings: UserSettings;
  currentMinutes: number;
  liveTimeString?: string;
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: RoutineTask) => void;
}

type CategoryFilter = 'all' | 'study' | 'phone' | 'morning' | 'pending';

export const TodayScreen: React.FC<TodayScreenProps> = ({
  tasks,
  dayProgress,
  settings,
  currentMinutes,
  liveTimeString,
  onToggleComplete,
  onOpenDetails,
}) => {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [sideBySideView, setSideBySideView] = useState<boolean>(true); // Habits side by side

  // Filter active tasks (excluding disabled tasks)
  const activeTasks = tasks.filter(
    (t) => !settings.disabledTaskIds.includes(t.id)
  );

  const completedCount = activeTasks.filter(
    (t) => dayProgress.records[t.id]?.completed
  ).length;

  const totalActiveCount = activeTasks.length;

  const { nowTask, upNextTask, isBeforeFirstTask } = findNowAndUpNextTasks(
    activeTasks,
    currentMinutes
  );

  const isNowCompleted = nowTask
    ? !!dayProgress.records[nowTask.id]?.completed
    : false;

  // Timeline filtered tasks
  const filteredTasks = activeTasks.filter((task) => {
    const isCompleted = !!dayProgress.records[task.id]?.completed;
    if (filter === 'pending') return !isCompleted;
    if (filter === 'study') return task.category === 'study' || task.category === 'coding';
    if (filter === 'phone') return task.isPhoneTime;
    if (filter === 'morning') return task.startMinutes < 540; // before 9:00 AM
    return true;
  });

  return (
    <div className="space-y-6 pb-28">
      {/* 1. Greeting & 2. Date */}
      <header className="pt-2 px-1 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-sm font-semibold text-teal-800 tracking-tight block">
            {getGreeting(currentMinutes)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            Today's Routine
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            {getFormattedToday()}
          </p>
        </div>

        {/* Live Real-Time Clock Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold tabular-nums shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Clock: {liveTimeString || 'Active'}</span>
          </div>
        </div>
      </header>

      {/* 
        Tablet & Desktop Optimized Top Cards (Side By Side on sm/md/lg screens):
        - On Mobile: stacked
        - On Tablet (sm/md): 2-column balanced grid
        - On Large Desktop (lg): 2-column workstation layout
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Progress Card & UP NEXT Card */}
        <div className="space-y-4">
          <section aria-label="Today's Progress">
            <ProgressCard
              completedCount={completedCount}
              totalActiveCount={totalActiveCount}
            />
          </section>

          <section aria-label="Next Scheduled Task">
            <UpNextCard
              task={upNextTask}
              onOpenDetails={onOpenDetails}
            />
          </section>
        </div>

        {/* Right Column: NOW Card & Phone Rule Card */}
        <div className="space-y-4">
          <section aria-label="Current Scheduled Task">
            <NowCard
              task={nowTask}
              isBeforeFirstTask={isBeforeFirstTask}
              isCompleted={isNowCompleted}
              onToggleComplete={onToggleComplete}
              onOpenDetails={onOpenDetails}
            />
          </section>

          <section aria-label="Phone Rule Accountability">
            <PhoneRuleCard currentMinutes={currentMinutes} />
          </section>
        </div>
      </div>

      {/* 
        7. Full Daily Timeline & Habits:
        Displayed Side By Side as requested!
      */}
      <section aria-label="Daily Routine Habits" className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Daily Routine Habits
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                Side by Side
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTasks.length} scheduled habits · Real-time schedule tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View layout toggle: Side by Side vs Single Column */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setSideBySideView(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  sideBySideView
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Side by Side Grid"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Side by Side</span>
              </button>
              <button
                type="button"
                onClick={() => setSideBySideView(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  !sideBySideView
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Single Column List"
              >
                <Rows3 size={14} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full tabular-nums">
              {completedCount}/{totalActiveCount} Done
            </span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            All Habits ({activeTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === 'pending'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            Pending ({activeTasks.length - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('study')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === 'study'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            Study & Tuition
          </button>
          <button
            type="button"
            onClick={() => setFilter('phone')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === 'phone'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            Phone Windows
          </button>
          <button
            type="button"
            onClick={() => setFilter('morning')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === 'morning'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            Morning Routine
          </button>
        </div>

        {/* 
          Habits Side by Side Grid:
          When sideBySideView is true, uses 2 columns on tablet and desktop (grid-cols-1 sm:grid-cols-2)
          When false, single column
        */}
        <div
          className={
            sideBySideView
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3'
              : 'space-y-1'
          }
        >
          {filteredTasks.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-500 text-xs">
              No habits match this filter.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = !!dayProgress.records[task.id]?.completed;
              const status = getTaskStatus(task, currentMinutes, isCompleted);
              const hasNote = !!dayProgress.records[task.id]?.note;

              return (
                <TimelineTaskRow
                  key={task.id}
                  task={task}
                  status={status}
                  hasNote={hasNote}
                  slowMode={settings.slowMode}
                  onToggleComplete={onToggleComplete}
                  onOpenDetails={onOpenDetails}
                />
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
