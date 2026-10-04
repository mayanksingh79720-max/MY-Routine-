import React from 'react';
import { RoutineTask, TaskStatus } from '../types/routine';
import { TaskIcon } from './TaskIcon';
import { Check, Smartphone, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineTaskRowProps {
  task: RoutineTask;
  status: TaskStatus;
  hasNote?: boolean;
  slowMode: boolean;
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: RoutineTask) => void;
}

export const TimelineTaskRow: React.FC<TimelineTaskRowProps> = ({
  task,
  status,
  hasNote,
  slowMode,
  onToggleComplete,
  onOpenDetails,
}) => {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isIncomplete = status === 'incomplete';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  return (
    <div
      onClick={() => onOpenDetails(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails(task);
        }
      }}
      className={`group relative rounded-2xl transition-all duration-200 cursor-pointer p-3 sm:p-3.5 mb-2.5 flex items-center justify-between gap-3 border ${
        isCurrent
          ? 'bg-teal-50/30 border-teal-400/60 shadow-[0_2px_12px_rgba(13,148,136,0.06)] ring-1 ring-teal-400/20'
          : isCompleted
          ? 'bg-slate-50/70 border-slate-200/70 opacity-75'
          : isIncomplete
          ? 'bg-white border-amber-200/60'
          : 'bg-white border-slate-100 hover:border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
      }`}
      aria-label={`${task.name}, ${task.timeDisplay}, status: ${status}`}
    >
      {/* Left side: Checkbox + Icon + Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Checkbox button with accessible 44px tap target */}
        <button
          onClick={handleCheckboxClick}
          type="button"
          aria-checked={isCompleted}
          role="checkbox"
          className="min-w-[44px] min-h-[44px] -ml-2 -mr-1 flex items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label={isCompleted ? `Mark ${task.name} incomplete` : `Mark ${task.name} completed`}
        >
          <div
            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-teal-600 border-teal-600 text-white'
                : isIncomplete
                ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                : 'border-slate-300 bg-white hover:border-teal-500'
            }`}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              >
                <Check size={15} strokeWidth={3} />
              </motion.div>
            )}
          </div>
        </button>

        {/* Category Icon */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isCompleted
              ? 'bg-slate-100 text-slate-400'
              : task.isPhoneTime
              ? 'bg-amber-50 text-amber-700'
              : isCurrent
              ? 'bg-teal-100 text-teal-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <TaskIcon name={task.iconName} size={16} />
        </div>

        {/* Task Name & Schedule */}
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-semibold tracking-tight transition-all truncate max-w-[200px] sm:max-w-none ${
                isCompleted
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800'
              }`}
            >
              {task.name}
            </span>

            {/* Note indicator icon */}
            {hasNote && (
              <FileText size={13} className="text-teal-600 shrink-0" aria-label="Has personal note" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 tabular-nums">
            <span>{task.timeDisplay}</span>

            {task.isPhoneTime && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                  <Smartphone size={11} />
                  Phone Window
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Status Tag */}
      <div className="shrink-0 text-right">
        {isCompleted ? (
          <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
            Done
          </span>
        ) : isCurrent ? (
          <span className="text-[11px] font-bold text-white bg-teal-600 px-2 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            NOW
          </span>
        ) : isIncomplete ? (
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Incomplete
            </span>
            {slowMode && (
              <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline-block">
                Can finish later
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            Pending
          </span>
        )}
      </div>
    </div>
  );
};
