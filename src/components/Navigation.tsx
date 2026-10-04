import React from 'react';
import { Calendar, CheckCircle2, Settings } from 'lucide-react';

export type NavTab = 'today' | 'history' | 'settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav
      className="fixed bottom-0 sm:bottom-5 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md bg-white/95 backdrop-blur-md border-t sm:border border-slate-200/90 sm:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)] sm:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="px-4 h-16 sm:h-14 flex items-center justify-around">
        <button
          onClick={() => onSelectTab('today')}
          type="button"
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] rounded-xl transition-all duration-150 ${
            currentTab === 'today'
              ? 'text-teal-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Today Screen"
          aria-current={currentTab === 'today' ? 'page' : undefined}
        >
          <div
            className={`w-10 h-7 flex items-center justify-center rounded-lg transition-colors ${
              currentTab === 'today' ? 'bg-teal-50 text-teal-700' : 'text-slate-500'
            }`}
          >
            <CheckCircle2 size={20} strokeWidth={currentTab === 'today' ? 2.2 : 1.75} />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Today</span>
        </button>

        <button
          onClick={() => onSelectTab('history')}
          type="button"
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] rounded-xl transition-all duration-150 ${
            currentTab === 'history'
              ? 'text-teal-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="History Screen"
          aria-current={currentTab === 'history' ? 'page' : undefined}
        >
          <div
            className={`w-10 h-7 flex items-center justify-center rounded-lg transition-colors ${
              currentTab === 'history' ? 'bg-teal-50 text-teal-700' : 'text-slate-500'
            }`}
          >
            <Calendar size={20} strokeWidth={currentTab === 'history' ? 2.2 : 1.75} />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">History</span>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          type="button"
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] rounded-xl transition-all duration-150 ${
            currentTab === 'settings'
              ? 'text-teal-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Settings Screen"
          aria-current={currentTab === 'settings' ? 'page' : undefined}
        >
          <div
            className={`w-10 h-7 flex items-center justify-center rounded-lg transition-colors ${
              currentTab === 'settings' ? 'bg-teal-50 text-teal-700' : 'text-slate-500'
            }`}
          >
            <Settings size={20} strokeWidth={currentTab === 'settings' ? 2.2 : 1.75} />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Settings</span>
        </button>
      </div>
    </nav>
  );
};
