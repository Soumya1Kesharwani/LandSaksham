import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { MetricCard } from '../common/MetricCard';
import { ReadinessGauge } from '../common/ReadinessGauge';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Building2, AlertOctagon, FileSpreadsheet, Landmark, 
  Scale, Trees, Users, Briefcase, ArrowUpRight, 
  Clock, ShieldAlert, CheckCircle2, ChevronRight,
  Hash, Navigation, MapPin
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { t, tr, language } = useLanguage();
  const { activeProject, parcels, setSelectedParcel, setActiveTab } = useProject();

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  const criticalParcels = parcels.filter(p => p.delay_risk_score >= 70);

  return (
    <div className="space-y-6">
      
      {/* Top Project Banner */}
      <div className="bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5 flex-1">
          {/* Subtle Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {activeProject.code}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {t(activeProject.authority, activeProject.authority)}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900 font-medium">
              {t(activeProject.type, activeProject.type)}
            </span>
            {activeProject.length_km && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {activeProject.state || 'Rajasthan'} • {activeProject.length_km} km
                </span>
              </>
            )}
          </div>

          {/* Clean Moderate Title */}
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {t(activeProject.name, activeProject.name)}
          </h2>

          {/* Subtle Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            {t(activeProject.description, activeProject.description)}
          </p>
        </div>

        {/* Readiness Gauge */}
        <div className="flex items-center gap-3 shrink-0">
          <ReadinessGauge
            score={activeProject.overall_readiness_score}
            delayProbability={activeProject.overall_delay_probability}
          />
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          title={t('kpis.delay_risk')}
          value={`${activeProject.overall_delay_risk_score}%`}
          badge={t(activeProject.overall_delay_risk_level, activeProject.overall_delay_risk_level)}
          badgeType={activeProject.overall_delay_risk_score >= 70 ? 'danger' : 'warning'}
          icon={AlertOctagon}
          subtitle={`+${activeProject.expected_delay_days} ${t('common.days')}`}
          trend={tr('+29% this quarter', '+29% इस तिमाही')}
          trendPositive={false}
          onClick={() => setActiveTab('prediction')}
        />
        <MetricCard
          title={t('kpis.high_risk_parcels')}
          value={activeProject.high_risk_parcels_count}
          subtitle={`${tr('of', 'कुल')} ${activeProject.total_parcels_count} ${t('land.total_parcels')}`}
          icon={FileSpreadsheet}
          badge={t('common.action_required')}
          badgeType="danger"
          onClick={() => setActiveTab('land')}
        />
        <MetricCard
          title={t('kpis.pending_compensation')}
          value={`₹${activeProject.compensation_pending_cr} ${t('common.crore')}`}
          subtitle={`${tr('Disbursed:', 'संवितरित:')} ₹${activeProject.compensation_paid_cr} ${t('common.crore')}`}
          icon={Landmark}
          badge={`${((activeProject.compensation_paid_cr / activeProject.compensation_total_cr) * 100).toFixed(0)}% ${t('compensation.disbursed')}`}
          badgeType="warning"
          onClick={() => setActiveTab('compensation')}
        />
        <MetricCard
          title={t('kpis.legal_cases')}
          value={activeProject.active_court_cases_count}
          subtitle={`${activeProject.stay_orders_count} ${t('legal.stay_orders')}`}
          icon={Scale}
          badge={activeProject.stay_orders_count > 0 ? t('legal.stay_orders') : t('common.low')}
          badgeType={activeProject.stay_orders_count > 0 ? "danger" : "default"}
          onClick={() => setActiveTab('legal')}
        />
        <MetricCard
          title={t('kpis.forest_flags')}
          value={activeProject.environmental_flags_count}
          subtitle={t('environment.stage_1_status')}
          icon={Trees}
          badge={tr("48d Inactivity", "48 दिन निष्क्रियता")}
          badgeType="warning"
          onClick={() => setActiveTab('environment')}
        />
        <MetricCard
          title={t('kpis.estimated_employment')}
          value={`${(activeProject.employment.total_estimated_jobs / 1000).toFixed(1)}k`}
          subtitle={`${activeProject.employment.direct_construction_jobs.toLocaleString()} ${t('employment.direct_jobs')}`}
          icon={Briefcase}
          badge={tr("Indicative", "अनुमानित")}
          badgeType="success"
          onClick={() => setActiveTab('employment')}
        />
      </div>

      {/* Project Health Readiness Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {t('overview.health_matrix_title')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('overview.health_matrix_subtitle')}
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-700">
            {t('overview.overall')}: {activeProject.overall_readiness_score}/100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: t('overview.land_mutation'), score: activeProject.readiness_breakdown.land, tab: 'land' },
            { label: t('overview.legal_litigation'), score: activeProject.readiness_breakdown.legal, tab: 'legal' },
            { label: t('overview.compensation_payout'), score: activeProject.readiness_breakdown.compensation, tab: 'compensation' },
            { label: t('overview.forest_parivesh'), score: activeProject.readiness_breakdown.environment, tab: 'environment' },
            { label: t('overview.rr_resettlement'), score: activeProject.readiness_breakdown.rr, tab: 'social' },
            { label: t('overview.documentation'), score: activeProject.readiness_breakdown.documents, tab: 'documents' },
          ].map(dim => {
            const isHigh = dim.score >= 70;
            const isMed = dim.score >= 50 && dim.score < 70;
            const colorClass = isHigh ? 'bg-emerald-600' : isMed ? 'bg-amber-500' : 'bg-red-600';
            const textClass = isHigh ? 'text-emerald-700' : isMed ? 'text-amber-700' : 'text-red-700';

            return (
              <div
                key={dim.label}
                onClick={() => setActiveTab(dim.tab)}
                className="bg-slate-50 border border-slate-200 rounded-md p-3 hover:border-gov-blue/50 cursor-pointer transition"
              >
                <div className="text-[11px] font-semibold text-slate-600 truncate">{dim.label}</div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className={`text-lg font-bold font-mono ${textClass}`}>
                    {dim.score}
                    <span className="text-[10px] text-slate-400 font-normal">/100</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {dim.score >= 70 ? t('common.optimal') : dim.score >= 50 ? t('common.moderate') : t('common.critical')}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className={`${colorClass} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${dim.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Priority Parcels Table & Early Warning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Risk Parcels */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('overview.critical_parcels_title')}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('land')}
              className="text-xs font-semibold text-gov-blue hover:underline flex items-center gap-0.5"
            >
              <span>{t('overview.view_all_parcels')} ({parcels.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">{t('overview.table_parcel_khasra')}</th>
                  <th className="p-2.5">{t('overview.table_village_tehsil')}</th>
                  <th className="p-2.5">{t('overview.table_owner_name')}</th>
                  <th className="p-2.5">{t('overview.table_delay_risk')}</th>
                  <th className="p-2.5">{t('overview.table_primary_bottleneck')}</th>
                  <th className="p-2.5 text-right">{t('overview.table_action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalParcels.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-2.5">
                      <div className="font-bold text-gov-navy">{p.id}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{tr('Khasra', 'खसरा')} {p.khasra_survey_no}</div>
                    </td>
                    <td className="p-2.5 text-slate-700">
                      {t(p.village, p.village)}, {t(p.tehsil, p.tehsil)}
                    </td>
                    <td className="p-2.5 font-medium text-slate-800">
                      {t(p.owner.name, p.owner.name)}
                    </td>
                    <td className="p-2.5">
                      <RiskBadge level={p.delay_risk_level} score={p.delay_risk_score} showScore size="sm" />
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">
                      {p.top_risk_factors[0]?.factor_name ? t(p.top_risk_factors[0]?.factor_name, p.top_risk_factors[0]?.factor_name) : t('common.pending')}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setSelectedParcel(p)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-gov-blue hover:text-white text-slate-700 font-semibold transition border border-slate-300"
                      >
                        {t('common.inspect')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Key Insights & Route Comparison Teaser */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {t('overview.ai_intelligence_tag')}
              </span>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {t('overview.grounded_rag')}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {t('overview.route_recommendation_title')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('overview.route_recommendation_desc')}
            </p>
            <button
              onClick={() => setActiveTab('routes')}
              className="w-full bg-gov-blue hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>{t('overview.launch_route_simulator')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
              {t('overview.statutory_compliance_title')}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('overview.section_11')}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 text-right">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('overview.section_11_val')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('overview.section_19')}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 text-right">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('overview.section_19_val')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('overview.section_23')}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0 text-right">
                  {t('overview.section_23_val')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300 py-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('overview.section_38')}</span>
                <span className="font-semibold text-red-600 dark:text-red-400 shrink-0 text-right">
                  {t('overview.section_38_val')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
