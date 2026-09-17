import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'default' | 'danger' | 'warning' | 'success';
  trend?: string;
  trendPositive?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'default',
  trend,
  trendPositive,
  onClick
}) => {
  const { t } = useLanguage();
  const badgeClasses = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    danger: "bg-red-950/80 text-red-300 border-red-800/80",
    warning: "bg-amber-950/80 text-amber-300 border-amber-800/80",
    success: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#111c38] border border-slate-800 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow transition-all ${onClick ? 'cursor-pointer hover:border-blue-500/50' : ''
        }`}
    >
      <div className="flex items-start justify-between gap-1.5 sm:gap-2.5">
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-normal leading-tight flex-1 pr-1 min-w-0 break-words">
          {t(title)}
        </span>
        <div className="p-1.5 sm:p-2 rounded bg-slate-800/80 text-blue-400 border border-slate-700 shrink-0">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>

      <div className="mt-1.5 sm:mt-2 flex flex-col items-center text-center gap-1">
        <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight whitespace-nowrap text-center">
          {value}
        </div>
        {badge && (
          <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded border inline-block text-center ${badgeClasses[badgeType]}`}>
            {t(badge)}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 text-[10px] sm:text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-1.5 sm:pt-2 gap-1">
          <span className="truncate">{subtitle ? t(subtitle) : ''}</span>
          {trend && (
            <span className={`font-medium shrink-0 ${trendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {t(trend)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
