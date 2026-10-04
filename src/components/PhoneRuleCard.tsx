import React from 'react';
import { Smartphone, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { getPhoneStatus, PHONE_WINDOWS } from '../utils/timeUtils';

interface PhoneRuleCardProps {
  currentMinutes: number;
}

export const PhoneRuleCard: React.FC<PhoneRuleCardProps> = ({ currentMinutes }) => {
  const phoneStatus = getPhoneStatus(currentMinutes);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Smartphone size={16} />
          </div>
          <span className="text-[12px] font-bold tracking-wider text-slate-500 uppercase">
            PHONE RULE
          </span>
        </div>

        {/* Live contextual status badge */}
        {phoneStatus.isPhoneAllowed ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Window Open
          </span>
        ) : phoneStatus.isBefore11AM ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <ShieldAlert size={12} />
            Morning Shield
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Focus Mode
          </span>
        )}
      </div>

      {/* Primary rule callout */}
      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100/80 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-amber-900">Before 11:00 AM:</span>
          <span className="text-sm font-bold text-rose-700">🚫 No recreational phone</span>
        </div>
        <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
          Protect your morning energy after tuition and workout. No social media or aimless scrolling.
        </p>
      </div>

      {/* Allowed windows */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Allowed recreational phone windows:
        </p>
        <div className="space-y-1.5">
          {PHONE_WINDOWS.map((win, idx) => {
            const isCurrentlyIn =
              currentMinutes >= win.start && currentMinutes < win.end;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl transition-colors ${
                  isCurrentlyIn
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/50'
                    : 'bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCurrentlyIn ? (
                    <CheckCircle size={14} className="text-emerald-600" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                  <span>{win.label}</span>
                </div>
                {isCurrentlyIn && (
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gentle feedback banner */}
      {!phoneStatus.isPhoneAllowed && phoneStatus.nextWindowText && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-teal-600" />
            Stay present in your current task
          </span>
          <span className="font-medium text-slate-600 tabular-nums">
            {phoneStatus.nextWindowText}
          </span>
        </div>
      )}
    </div>
  );
};
