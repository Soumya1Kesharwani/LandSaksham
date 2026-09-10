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
    default: "bg-slate-100 text-slate-700 border-slate-300",
    danger: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow transition-all ${
        onClick ? 'cursor-pointer hover:border-gov-blue/50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {t(title)}
        </span>
        <div className="p-2 rounded bg-slate-50 text-gov-navy border border-slate-200">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
          {value}
        </div>
        {badge && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeClasses[badgeType]}`}>
            {t(badge)}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
          <span>{subtitle ? t(subtitle) : ''}</span>
          {trend && (
            <span className={`font-medium ${trendPositive ? 'text-emerald-700' : 'text-red-700'}`}>
              {t(trend)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
