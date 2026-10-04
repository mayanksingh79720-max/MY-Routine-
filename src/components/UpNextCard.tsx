import React from 'react';
import { RoutineTask } from '../types/routine';
import { TaskIcon } from './TaskIcon';
import { ChevronRight } from 'lucide-react';

interface UpNextCardProps {
  task: RoutineTask | null;
  onOpenDetails: (task: RoutineTask) => void;
}

export const UpNextCard: React.FC<UpNextCardProps> = ({ task, onOpenDetails }) => {
  if (!task) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            UP NEXT
          </span>
          <p className="text-sm font-medium text-slate-700 mt-0.5">
            Routine completed for today
          </p>
        </div>
        <span className="text-xs text-slate-400">Rest well</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenDetails(task)}
      className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/90 hover:border-slate-200 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-3 group"
      role="button"
      tabIndex={0}
      aria-label={`Up next: ${task.name} at ${task.timeDisplay}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
          <TaskIcon name={task.iconName} size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              UP NEXT
            </span>
            {task.isPhoneTime && (
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                Phone Time
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
            {task.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 text-right">
        <span className="text-xs font-medium text-slate-500 tabular-nums">
          {task.timeDisplay}
        </span>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
};
