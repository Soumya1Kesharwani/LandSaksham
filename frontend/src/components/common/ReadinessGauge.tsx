import React from 'react';

interface ReadinessGaugeProps {
  score: number; // 0 to 100
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  delayProbability?: number; // 0.0 to 1.0
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  title = "Project Readiness Index",
  size = 'md',
  delayProbability
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine color based on readiness
  let strokeColor = "#10b981"; // Emerald
  if (clampedScore < 50) strokeColor = "#ef4444"; // Red
  else if (clampedScore < 70) strokeColor = "#f59e0b"; // Amber

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="7"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={strokeColor}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold font-mono text-slate-900 leading-none">
            {clampedScore}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">
            / 100
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </div>
        <div className="text-sm font-bold text-slate-800 mt-0.5">
          {clampedScore >= 75 ? "High Readiness — Ready for Execution" : clampedScore >= 50 ? "Moderate Readiness — Interventions Needed" : "Low Readiness — Critical Bottlenecks"}
        </div>
        {delayProbability !== undefined && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-600">
            <span>Delay Risk Probability:</span>
            <span className={`font-mono font-bold ${delayProbability > 0.6 ? 'text-red-700' : 'text-amber-700'}`}>
              {(delayProbability * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
