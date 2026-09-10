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

  let bgClass = "bg-slate-100 text-slate-700 border-slate-300";
  let dotColor = "bg-slate-500";

  if (lvl === 'CRITICAL') {
    bgClass = "bg-red-50 text-red-800 border-red-300 ring-1 ring-red-200";
    dotColor = "bg-red-600 animate-pulse";
  } else if (lvl === 'HIGH') {
    bgClass = "bg-orange-50 text-orange-800 border-orange-300";
    dotColor = "bg-orange-500";
  } else if (lvl === 'MEDIUM') {
    bgClass = "bg-amber-50 text-amber-800 border-amber-300";
    dotColor = "bg-amber-500";
  } else if (lvl === 'LOW') {
    bgClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
    dotColor = "bg-emerald-600";
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
