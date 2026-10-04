import React, { useState, useEffect } from 'react';
import { RoutineTask, TaskStatus } from '../types/routine';
import { TaskIcon } from './TaskIcon';
import { X, Check, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskDetailModalProps {
  task: RoutineTask | null;
  status: TaskStatus;
  initialNote?: string;
  slowMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (taskId: string, note: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  status,
  initialNote = '',
  slowMode,
  isOpen,
  onClose,
  onSaveNote,
  onToggleComplete,
}) => {
  const [note, setNote] = useState(initialNote);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  useEffect(() => {
    setNote(initialNote || '');
    setIsSavedFeedback(false);
  }, [task, initialNote, isOpen]);

  if (!isOpen || !task) return null;

  const isCompleted = status === 'completed';

  const handleSave = () => {
    onSaveNote(task.id, note);
    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
      onClose();
    }, 400);
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
          <CheckCircle2 size={14} />
          Completed
        </span>
      );
    }
    if (status === 'current') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Current Task (NOW)
        </span>
      );
    }
    if (status === 'incomplete') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
          {slowMode ? 'Incomplete — You can still finish this.' : 'Incomplete'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
        <Clock size={13} />
        Pending
      </span>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Bottom Sheet Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-task-title"
        >
          {/* Top grab bar affordance for mobile */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-teal-50 text-teal-700'
                }`}
              >
                <TaskIcon name={task.iconName} size={22} />
              </div>
              <div>
                <h2
                  id="modal-task-title"
                  className={`text-lg font-bold tracking-tight text-slate-900 ${
                    isCompleted ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {task.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium tabular-nums mt-0.5">
                  Scheduled: {task.timeDisplay}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Status section */}
          <div className="mt-4 mb-5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Status
            </label>
            <div className="flex items-center justify-between">
              {getStatusBadge()}

              {/* Quick toggle button inside modal */}
              <button
                type="button"
                onClick={() => onToggleComplete(task.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isCompleted
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Check size={14} strokeWidth={2.5} />
                <span>{isCompleted ? 'Mark Pending' : 'Mark as Done'}</span>
              </button>
            </div>
          </div>

          {/* Personal Note field */}
          <div className="mb-6">
            <label
              htmlFor="task-note"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2"
            >
              <span>Today's Note (Optional)</span>
              <span className="text-[10px] font-normal text-slate-400">
                Stored for today
              </span>
            </label>
            <textarea
              id="task-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. I was distracted during this block, finished 3 chapters..."
              rows={3}
              className="w-full text-sm p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 placeholder:text-slate-400 resize-none transition-all"
            />
          </div>

          {/* Slow mode forgiving reassurance note */}
          {slowMode && !isCompleted && (
            <div className="mb-6 p-3 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs text-teal-900 flex items-start gap-2">
              <Sparkles size={15} className="text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Slow Mode:</strong> It's completely okay if this was delayed. You can mark it whenever you finish it today without any penalty or stress.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-2xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-2xl font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm shadow-teal-700/20 transition-colors flex items-center justify-center gap-1.5"
            >
              {isSavedFeedback ? (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Note</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
