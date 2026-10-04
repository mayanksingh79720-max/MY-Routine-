import React from 'react';
import { motion } from 'motion/react';

interface ProgressCardProps {
  completedCount: number;
  totalActiveCount: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  completedCount,
  totalActiveCount,
}) => {
  const percentage =
    totalActiveCount > 0
      ? Math.round((completedCount / totalActiveCount) * 100)
      : 0;

  const getSubtext = () => {
    if (completedCount === 0) {
      return "Let's start with the first task.";
    }
    if (completedCount === totalActiveCount && totalActiveCount > 0) {
      return 'All routine tasks completed for today.';
    }
    return `${completedCount} of ${totalActiveCount} tasks completed`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
      {/* Subtle soft gradient background glow */}
      <div
        className="absolute -top-16 -right-16 w-40 h-40 bg-teal-50/70 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-36 h-36 bg-sky-50/60 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
            TODAY'S PROGRESS
          </span>
          <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            {completedCount}/{totalActiveCount} Done
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-600 font-medium">{getSubtext()}</p>
      </div>
    </div>
  );
};
