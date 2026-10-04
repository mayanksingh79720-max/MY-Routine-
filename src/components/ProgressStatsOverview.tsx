import React from 'react';
import { DayProgress, RoutineTask } from '../types/routine';
import {
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  BookOpen,
  Clock,
  Sun,
  Coffee,
  Laptop,
  Moon,
  TrendingUp,
} from 'lucide-react';

interface ProgressStatsOverviewProps {
  history: Record<string, DayProgress>;
  tasks: RoutineTask[];
}

export const ProgressStatsOverview: React.FC<ProgressStatsOverviewProps> = ({
  history,
  tasks,
}) => {
  const historyList = Object.values(history);
  const totalTasks = tasks.length || 32;

  // Last 7 days records
  const recentDays = historyList.slice(-7);
  const totalCompletedInRecent = recentDays.reduce((acc, day) => {
    return acc + Object.values(day.records).filter((r) => r.completed).length;
  }, 0);
  const possibleInRecent = (recentDays.length || 1) * totalTasks;
  const rollingAvg = possibleInRecent > 0
    ? Math.round((totalCompletedInRecent / possibleInRecent) * 100)
    : 0;

  // 1. Morning Anchor Success Rate (Wake up 5:00 AM, Tuition 5:45 AM, Workout 7:00 AM, Sleep 10:00 PM)
  const anchorTaskIds = tasks
    .filter(
      (t) =>
        t.startMinutes === 300 || // Wake up
        t.startMinutes === 345 || // Tuition
        t.startMinutes === 420 || // Workout
        t.category === 'sleep' // Sleep
    )
    .map((t) => t.id);

  let totalAnchorsPossible = 0;
  let totalAnchorsDone = 0;

  historyList.forEach((day) => {
    anchorTaskIds.forEach((id) => {
      totalAnchorsPossible++;
      if (day.records[id]?.completed) {
        totalAnchorsDone++;
      }
    });
  });

  const anchorRate = totalAnchorsPossible > 0
    ? Math.round((totalAnchorsDone / totalAnchorsPossible) * 100)
    : 0;

  // 2. Phone Rule Morning Shield Adherence (Tasks before 11:00 AM)
  const morningTaskIds = tasks.filter((t) => t.startMinutes < 660).map((t) => t.id);
  let totalMorningPossible = 0;
  let totalMorningDone = 0;

  historyList.forEach((day) => {
    morningTaskIds.forEach((id) => {
      totalMorningPossible++;
      if (day.records[id]?.completed) {
        totalMorningDone++;
      }
    });
  });

  const morningAdherence = totalMorningPossible > 0
    ? Math.round((totalMorningDone / totalMorningPossible) * 100)
    : 0;

  // 3. Deep Study Hours (Study Block 1, 2, 3, Notes/Revision, Civics, English)
  // Total study minutes = 50 + 50 + 60 + 50 + 50 + 50 + 40 + 45 = ~345 mins per day
  const studyTaskIds = tasks
    .filter((t) => t.category === 'study' || t.category === 'coding')
    .map((t) => t.id);

  let totalStudyCompletedBlocks = 0;
  historyList.forEach((day) => {
    studyTaskIds.forEach((id) => {
      if (day.records[id]?.completed) {
        totalStudyCompletedBlocks++;
      }
    });
  });
  // Average block is ~50 mins = ~0.83 hours
  const totalStudyHours = Math.round(totalStudyCompletedBlocks * 0.8);

  // 4. Time-of-Day Rhythm Breakdown:
  // - Morning: 5:00 - 9:00 AM (300 to 540)
  // - Midday: 9:00 AM - 2:00 PM (540 to 840)
  // - Afternoon: 2:00 - 6:00 PM (840 to 1080)
  // - Evening: 6:00 - 10:00 PM (1080 to 1320)
  const timeBuckets = [
    {
      id: 'morning',
      label: 'Early Morning',
      timeRange: '5:00–9:00 AM',
      icon: Sun,
      tasks: tasks.filter((t) => t.startMinutes >= 300 && t.startMinutes < 540),
    },
    {
      id: 'midday',
      label: 'Midday Focus',
      timeRange: '9:00 AM–2:00 PM',
      icon: Coffee,
      tasks: tasks.filter((t) => t.startMinutes >= 540 && t.startMinutes < 840),
    },
    {
      id: 'afternoon',
      label: 'Afternoon Flow',
      timeRange: '2:00–6:00 PM',
      icon: Laptop,
      tasks: tasks.filter((t) => t.startMinutes >= 840 && t.startMinutes < 1080),
    },
    {
      id: 'evening',
      label: 'Evening & Night',
      timeRange: '6:00–10:00 PM',
      icon: Moon,
      tasks: tasks.filter((t) => t.startMinutes >= 1080),
    },
  ];

  const bucketStats = timeBuckets.map((bucket) => {
    let possible = 0;
    let done = 0;
    const bucketIds = bucket.tasks.map((t) => t.id);

    historyList.forEach((day) => {
      bucketIds.forEach((id) => {
        possible++;
        if (day.records[id]?.completed) {
          done++;
        }
      });
    });

    const rate = possible > 0 ? Math.round((done / possible) * 100) : 0;
    return {
      ...bucket,
      rate,
      taskCount: bucket.tasks.length,
    };
  });

  return (
    <div className="space-y-4">
      {/* 4 Primary Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Consistency Score */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Consistency Index
            </span>
            <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {rollingAvg}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            7-day rolling completion rate
          </p>
        </div>

        {/* Card 2: Morning Anchors */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Routine Anchors
            </span>
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {anchorRate}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Wake, Tuition, Gym, Sleep rate
          </p>
        </div>

        {/* Card 3: Phone Rule Adherence */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Phone Shield
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Smartphone size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {morningAdherence}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Pre-11 AM focus window rate
          </p>
        </div>

        {/* Card 4: Deep Study Hours */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Study Logged
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {totalStudyHours}h
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Revision & study blocks logged
          </p>
        </div>
      </div>

      {/* Time-of-Day Rhythm Breakdown Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[12px] font-bold tracking-wider text-slate-400 uppercase">
              RHYTHM ANALYSIS
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              Time-of-Day Consistency
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Across logged history
          </span>
        </div>

        <div className="space-y-3.5">
          {bucketStats.map((bucket) => {
            const Icon = bucket.icon;
            return (
              <div key={bucket.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Icon size={13} />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">
                        {bucket.label}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1.5 tabular-nums">
                        ({bucket.timeRange})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {bucket.taskCount} blocks
                    </span>
                    <span className="font-bold text-slate-800 tabular-nums min-w-[36px] text-right">
                      {bucket.rate}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, bucket.rate))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
