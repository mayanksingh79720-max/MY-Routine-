import React, { useState } from 'react';
import { RoutineTask } from '../types/routine';
import { getAllHistory } from '../utils/storage';
import { getTodayKey } from '../utils/timeUtils';
import { CheckCircle2, Calendar, FileText, Sparkles, BarChart2, ListChecks } from 'lucide-react';
import { UpsAndDownsGraph } from '../components/UpsAndDownsGraph';
import { ProgressStatsOverview } from '../components/ProgressStatsOverview';

interface HistoryScreenProps {
  tasks: RoutineTask[];
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ tasks }) => {
  const history = getAllHistory();
  const todayKey = getTodayKey();
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [activeSubTab, setActiveSubTab] = useState<'trends' | 'daily'>('trends');

  // List of last 14 days for the selector
  const dateKeys: string[] = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dateKeys.push(`${y}-${m}-${day}`);
  }

  const selectedProgress = history[selectedDate] || { date: selectedDate, records: {} };
  const completedTaskCount = Object.values(selectedProgress.records).filter((r) => r.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTaskCount / totalTasks) * 100) : 0;

  // Notes written for selected date
  const tasksWithNotes = tasks
    .filter((t) => selectedProgress.records[t.id]?.note)
    .map((t) => ({
      task: t,
      record: selectedProgress.records[t.id],
    }));

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <header className="pt-2 px-1 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-sm font-medium text-teal-800 tracking-tight block">
            Routine Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            Progress Stats & History
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Track consistency curves, ups and down patterns, and past reflections.
          </p>
        </div>

        {/* View Switcher: Trends & Stats vs Daily Logs */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'trends'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 size={14} />
            <span>Ups & Downs Graph</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'daily'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListChecks size={14} />
            <span>Daily Log</span>
          </button>
        </div>
      </header>

      {/* Main Trends & Stats Content */}
      {activeSubTab === 'trends' && (
        <div className="space-y-6">
          {/* Ups and Downs Graph Component */}
          <section aria-label="Routine Ups and Downs Curve">
            <UpsAndDownsGraph
              history={history}
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setActiveSubTab('daily');
              }}
            />
          </section>

          {/* Progress Stats Overview (4 key metrics + Time-of-day consistency) */}
          <section aria-label="Progress Statistics">
            <ProgressStatsOverview history={history} tasks={tasks} />
          </section>
        </div>
      )}

      {/* Daily Log & Inspection View */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6">
          {/* Date Carousel */}
          <section aria-label="Recent Days Carousel">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Day
              </span>
              <span className="text-xs text-slate-400">
                14-day history window
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {dateKeys.map((dateKey) => {
                const d = new Date(dateKey + 'T00:00:00');
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const isToday = dateKey === todayKey;
                const isSelected = dateKey === selectedDate;
                const dayRecord = history[dateKey];
                const count = dayRecord
                  ? Object.values(dayRecord.records).filter((r) => r.completed).length
                  : 0;

                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    type="button"
                    className={`flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                      {isToday ? 'Today' : dayName}
                    </span>
                    <span className="text-base font-bold my-0.5 tabular-nums">
                      {dayNum}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${
                        isSelected
                          ? 'bg-teal-800 text-teal-100'
                          : count > 0
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {count}/{totalTasks}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected Day Overview Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-teal-700" />
                <h2 className="text-base font-bold text-slate-900">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h2>
              </div>
              <span className="text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full tabular-nums">
                {completionPercentage}% Done
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Completed Blocks
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block tabular-nums">
                  {completedTaskCount} <span className="text-xs font-normal text-slate-500">/ {totalTasks}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Notes & Reflections
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block tabular-nums">
                  {tasksWithNotes.length} <span className="text-xs font-normal text-slate-500">blocks</span>
                </span>
              </div>
            </div>

            {completedTaskCount === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-2">
                No completed routine tasks logged for this day yet.
              </p>
            ) : (
              <div className="text-xs text-teal-800 bg-teal-50/70 p-3 rounded-2xl flex items-center gap-2">
                <Sparkles size={14} className="text-teal-600 shrink-0" />
                <span>
                  Every routine action completed anchored your focus and reduced mindless phone distractions.
                </span>
              </div>
            )}
          </div>

          {/* Notes & Reflections list for that day */}
          {tasksWithNotes.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 px-1 flex items-center gap-1.5">
                <FileText size={16} className="text-teal-700" />
                Notes Logged on this Day
              </h3>
              <div className="space-y-2">
                {tasksWithNotes.map(({ task, record }) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {task.name}
                      </span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {task.timeDisplay}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{record.note}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Routine list for selected date */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 px-1">
              Routine Checklist for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {tasks.map((task) => {
                const isDone = !!selectedProgress.records[task.id]?.completed;
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                      isDone
                        ? 'bg-teal-50/30 border-teal-100 text-teal-900'
                        : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-teal-600 text-white'
                            : 'border border-slate-300'
                        }`}
                      >
                        {isDone && <CheckCircle2 size={13} />}
                      </div>
                      <span className={`truncate font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {task.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400 tabular-nums ml-2">
                      {task.timeDisplay}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
