import React from 'react';
import { RiskLevel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface RiskBadgeProps {
  level: RiskLevel | string;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showScore = false, size = 'md' }) => {
  const { t } = useLanguage();
  const lvl = String(level).toUpperCase();

  let bgClass = "bg-slate-800 text-slate-300 border-slate-700";
  let dotColor = "bg-slate-400";

  if (lvl === 'CRITICAL') {
    bgClass = "bg-red-950/80 text-red-300 border-red-800/80 ring-1 ring-red-900/50";
    dotColor = "bg-red-500 animate-pulse";
  } else if (lvl === 'HIGH') {
    bgClass = "bg-orange-950/80 text-orange-300 border-orange-800/80";
    dotColor = "bg-orange-400";
  } else if (lvl === 'MEDIUM') {
    bgClass = "bg-amber-950/80 text-amber-300 border-amber-800/80";
    dotColor = "bg-amber-400";
  } else if (lvl === 'LOW') {
    bgClass = "bg-emerald-950/80 text-emerald-300 border-emerald-800/80";
    dotColor = "bg-emerald-400";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-bold"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${bgClass} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{t(lvl)}</span>
      {showScore && score !== undefined && (
        <span className="font-mono opacity-80">({score}%)</span>
      )}
    </span>
  );
};
