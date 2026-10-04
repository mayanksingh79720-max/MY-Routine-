import React, { useState } from 'react';
import { DayProgress, RoutineTask } from '../types/routine';
import { TrendingUp, TrendingDown, Minus, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UpsAndDownsGraphProps {
  history: Record<string, DayProgress>;
  tasks: RoutineTask[];
  onSelectDate?: (dateKey: string) => void;
  selectedDate?: string;
}

interface DataPoint {
  dateKey: string;
  dayName: string;
  dayNum: number;
  percentage: number;
  completedCount: number;
  totalCount: number;
  note?: string;
  isToday: boolean;
}

export const UpsAndDownsGraph: React.FC<UpsAndDownsGraphProps> = ({
  history,
  tasks,
  onSelectDate,
  selectedDate,
}) => {
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(14);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Generate date points for the chosen range
  const now = new Date();
  const totalTasks = tasks.length || 32;
  const dataPoints: DataPoint[] = [];

  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const dayRecord = history[dateKey];
    const completedCount = dayRecord
      ? Object.values(dayRecord.records).filter((r) => r.completed).length
      : 0;

    const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    // Find any note for that day
    let note: string | undefined;
    if (dayRecord) {
      const foundWithNote = Object.values(dayRecord.records).find((r) => r.note);
      if (foundWithNote?.note) {
        note = foundWithNote.note;
      }
    }

    dataPoints.push({
      dateKey,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      percentage,
      completedCount,
      totalCount: totalTasks,
      note,
      isToday: i === 0,
    });
  }

  // Calculate statistics
  const percentages = dataPoints.map((p) => p.percentage);
  const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
  const max = Math.max(...percentages);
  const min = Math.min(...percentages);
  const peakPoint = dataPoints.find((p) => p.percentage === max);
  const dipPoint = dataPoints.find((p) => p.percentage === min);

  // Trend: Compare first half vs second half of the range
  const midIndex = Math.floor(percentages.length / 2);
  const firstHalfAvg =
    percentages.slice(0, midIndex).reduce((a, b) => a + b, 0) / (midIndex || 1);
  const secondHalfAvg =
    percentages.slice(midIndex).reduce((a, b) => a + b, 0) /
    (percentages.length - midIndex || 1);
  const trendDiff = Math.round(secondHalfAvg - firstHalfAvg);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 35;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert points to SVG coordinates
  const coords = dataPoints.map((pt, index) => {
    const x = paddingX + (index / (dataPoints.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (pt.percentage / 100) * chartHeight;
    return { x, y, pt };
  });

  // Build SVG path with cubic smoothing
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(coords);
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const avgY = paddingTop + chartHeight - (avg / 100) * chartHeight;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-slate-100">
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold tracking-wider text-slate-500 uppercase">
              ROUTINE MOMENTUM
            </span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Ups & Downs
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Routine Consistency Curve
          </h2>
          <p className="text-xs text-slate-500">
            Natural fluctuations in your daily adherence across time.
          </p>
        </div>

        {/* Range Segmented Buttons */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl self-start sm:self-auto">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setRangeDays(days)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                rangeDays === days
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Quick Summary Highlights (Ups & Downs indicators) */}
      {percentages.every((p) => p === 0) ? (
        <div className="p-3.5 mb-5 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-teal-600 shrink-0" />
            <span>
              <strong>Real-Time Tracking:</strong> All demo data has been cleared. Complete your routine habits on the Today tab to plot your real consistency curve!
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Average Consistency
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {avg}%
              </span>
              <span className="text-[11px] text-slate-500">done</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100/70 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Highest Up
              </span>
              <TrendingUp size={14} className="text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-emerald-900 tabular-nums">
                {max}%
              </span>
              <span className="text-[10px] text-emerald-700">
                {peakPoint?.dayName} {peakPoint?.dayNum}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-100/70 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Lowest Dip
              </span>
              <TrendingDown size={14} className="text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-amber-900 tabular-nums">
                {min}%
              </span>
              <span className="text-[10px] text-amber-700">
                {dipPoint?.dayName} {dipPoint?.dayNum}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Trend Momentum
              </span>
              {trendDiff > 3 ? (
                <TrendingUp size={14} className="text-teal-600" />
              ) : trendDiff < -3 ? (
                <TrendingDown size={14} className="text-amber-500" />
              ) : (
                <Minus size={14} className="text-slate-400" />
              )}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`text-xl font-bold tabular-nums ${
                  trendDiff > 0 ? 'text-teal-700' : trendDiff < 0 ? 'text-amber-700' : 'text-slate-800'
                }`}
              >
                {trendDiff > 0 ? `+${trendDiff}%` : `${trendDiff}%`}
              </span>
              <span className="text-[10px] text-slate-500">
                {trendDiff >= 0 ? 'Upward' : 'Rebound'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0d9488" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Grid lines (0%, 25%, 50%, 75%, 100%) */}
          {[100, 75, 50, 25, 0].map((level) => {
            const y = paddingTop + chartHeight - (level / 100) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="system-ui"
                  className="tabular-nums"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Average Line */}
          <line
            x1={paddingX}
            y1={avgY}
            x2={width - paddingX}
            y2={avgY}
            stroke="#cbd5e1"
            strokeWidth="1.25"
            strokeDasharray="4 4"
          />
          <text
            x={width - paddingX + 6}
            y={avgY + 3}
            textAnchor="start"
            fill="#64748b"
            fontSize="9"
            fontWeight="600"
            className="tabular-nums"
          >
            Avg {avg}%
          </text>

          {/* Area Gradient */}
          <path d={areaPath} fill="url(#curveGradient)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadowGlow)"
          />

          {/* Data Points */}
          {coords.map(({ x, y, pt }) => {
            const isHovered = hoveredPoint?.dateKey === pt.dateKey;
            const isSelected = selectedDate === pt.dateKey;
            const isPeak = pt.percentage === max;
            const isDip = pt.percentage === min;

            return (
              <g
                key={pt.dateKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => {
                  onSelectDate?.(pt.dateKey);
                  setHoveredPoint(pt);
                }}
              >
                {/* Generous touch target */}
                <circle cx={x} cy={y} r="14" fill="transparent" />

                {/* Point ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered || isSelected ? 6.5 : isPeak || isDip ? 4.5 : 3.5}
                  fill={
                    isPeak
                      ? '#10b981'
                      : isDip
                      ? '#f59e0b'
                      : isHovered || isSelected
                      ? '#0d9488'
                      : '#ffffff'
                  }
                  stroke="#0d9488"
                  strokeWidth={isHovered || isSelected ? 2.5 : 1.75}
                  className="transition-all duration-150"
                />

                {/* Day label below bottom */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={pt.isToday ? '#0d9488' : '#94a3b8'}
                  fontSize={rangeDays === 30 ? '8' : '9'}
                  fontWeight={pt.isToday || isSelected ? '700' : '500'}
                >
                  {rangeDays === 30 ? (pt.dayNum % 3 === 0 ? pt.dayNum : '') : pt.dayName}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selection Tooltip */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 p-3 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm tabular-nums">
                  {hoveredPoint.percentage}%
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-200">
                      {hoveredPoint.dayName}, {hoveredPoint.dateKey}
                    </span>
                    {hoveredPoint.isToday && (
                      <span className="text-[10px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {hoveredPoint.completedCount} of {hoveredPoint.totalCount} blocks completed
                    {hoveredPoint.note ? ` · "${hoveredPoint.note.slice(0, 38)}..."` : ''}
                  </p>
                </div>
              </div>

              {onSelectDate && (
                <button
                  type="button"
                  onClick={() => onSelectDate(hoveredPoint.dateKey)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 text-[11px] font-semibold transition-colors"
                >
                  View Details
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Non-judgmental rhythm insight */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
        <Sparkles size={15} className="text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Calm Insight:</strong> Ups and downs are normal in a real life routine. A lower dip day is never a failure—it gives you the rest required to rebound the next morning.
        </p>
      </div>
    </div>
  );
};
