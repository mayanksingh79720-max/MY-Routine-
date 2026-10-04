import React from 'react';
import { RoutineTask } from '../types/routine';
import { TaskIcon } from './TaskIcon';
import { Check, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface NowCardProps {
  task: RoutineTask | null;
  isBeforeFirstTask: boolean;
  isCompleted: boolean;
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: RoutineTask) => void;
}

export const NowCard: React.FC<NowCardProps> = ({
  task,
  isBeforeFirstTask,
  isCompleted,
  onToggleComplete,
  onOpenDetails,
}) => {
  if (isBeforeFirstTask) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-bold tracking-wider text-slate-400 uppercase">
            NOW
          </span>
        </div>
        <p className="text-base font-semibold text-slate-800">
          Early morning silence
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Your daily routine starts at 5:00 AM with Wake up + water. Rest well.
        </p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-bold tracking-wider text-slate-400 uppercase">
            NOW
          </span>
        </div>
        <p className="text-base font-medium text-slate-700">
          No scheduled task right now.
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Take a deep breath or check what is coming up next.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl p-5 shadow-[0_4px_16px_rgba(13,148,136,0.08)] border transition-all ${
        isCompleted
          ? 'bg-teal-50/40 border-teal-200'
          : 'bg-white border-teal-500/30 ring-1 ring-teal-500/20'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-600 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            NOW
          </span>
          {task.isPhoneTime && (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Phone Window
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 font-medium tabular-nums">
          {task.timeDisplay}
        </span>
      </div>

      <div
        onClick={() => onOpenDetails(task)}
        className="cursor-pointer group flex items-start justify-between gap-3 mb-4"
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${task.name}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              isCompleted
                ? 'bg-teal-100 text-teal-700'
                : 'bg-teal-50 text-teal-700 group-hover:bg-teal-100'
            }`}
          >
            <TaskIcon name={task.iconName} size={20} />
          </div>
          <div>
            <h3
              className={`text-lg font-semibold tracking-tight text-slate-900 leading-snug ${
                isCompleted ? 'line-through text-slate-500' : ''
              }`}
            >
              {task.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isCompleted ? 'Completed for today' : 'Scheduled right now · Tap for note'}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <button
          onClick={() => onToggleComplete(task.id)}
          type="button"
          className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isCompleted
              ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
              : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-700/20'
          }`}
          aria-label={isCompleted ? `Mark ${task.name} incomplete` : `Complete ${task.name}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={18} className="text-teal-700" />
              <span>Completed ✓</span>
            </>
          ) : (
            <>
              <Check size={18} strokeWidth={2.5} />
              <span>Complete Task</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
