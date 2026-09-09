import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { MetricCard } from '../common/MetricCard';
import { ReadinessGauge } from '../common/ReadinessGauge';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Building2, AlertOctagon, FileSpreadsheet, Landmark, 
  Scale, Trees, Users, Briefcase, ArrowUpRight, 
  Clock, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { t } = useLanguage();
  const { activeProject, parcels, setSelectedParcel, setActiveTab } = useProject();

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading project intelligence records...
      </div>
    );
  }

  const criticalParcels = parcels.filter(p => p.delay_risk_score >= 70);

  return (
    <div className="space-y-6">
      
      {/* Top Project Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-300">
              {activeProject.code}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {activeProject.authority}
            </span>
            <span className="text-xs bg-blue-50 text-gov-blue px-2 py-0.5 rounded border border-blue-200 font-semibold">
              {activeProject.type}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeProject.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {activeProject.description}
          </p>
        </div>

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
          badge={activeProject.overall_delay_risk_level}
          badgeType={activeProject.overall_delay_risk_score >= 70 ? 'danger' : 'warning'}
          icon={AlertOctagon}
          subtitle={`+${activeProject.expected_delay_days} days expected`}
          trend="+29% this quarter"
          trendPositive={false}
          onClick={() => setActiveTab('prediction')}
        />
        <MetricCard
          title={t('kpis.high_risk_parcels')}
          value={activeProject.high_risk_parcels_count}
          subtitle={`of ${activeProject.total_parcels_count} total parcels`}
          icon={FileSpreadsheet}
          badge="Action Req."
          badgeType="danger"
          onClick={() => setActiveTab('land')}
        />
        <MetricCard
          title={t('kpis.pending_compensation')}
          value={`₹${activeProject.compensation_pending_cr} Cr`}
          subtitle={`Disbursed: ₹${activeProject.compensation_paid_cr} Cr`}
          icon={Landmark}
          badge={`${((activeProject.compensation_paid_cr / activeProject.compensation_total_cr) * 100).toFixed(0)}% Paid`}
          badgeType="warning"
          onClick={() => setActiveTab('compensation')}
        />
        <MetricCard
          title={t('kpis.legal_cases')}
          value={activeProject.active_court_cases_count}
          subtitle={`${activeProject.stay_orders_count} Stay Orders Active`}
          icon={Scale}
          badge={activeProject.stay_orders_count > 0 ? "Critical Stay" : "Normal"}
          badgeType={activeProject.stay_orders_count > 0 ? "danger" : "default"}
          onClick={() => setActiveTab('legal')}
        />
        <MetricCard
          title={t('kpis.forest_flags')}
          value={activeProject.environmental_flags_count}
          subtitle="Parivesh Stage-I/II"
          icon={Trees}
          badge="48d Inactivity"
          badgeType="warning"
          onClick={() => setActiveTab('environment')}
        />
        <MetricCard
          title={t('kpis.estimated_employment')}
          value={`${(activeProject.employment.total_estimated_jobs / 1000).toFixed(1)}k`}
          subtitle={`${activeProject.employment.direct_construction_jobs.toLocaleString()} Direct Jobs`}
          icon={Briefcase}
          badge="Indicative"
          badgeType="success"
          onClick={() => setActiveTab('employment')}
        />
      </div>

      {/* Project Health Readiness Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Multi-Dimensional Project Health Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Departmental readiness breakdown comparing land, legal, treasury, environmental, and R&R clearances.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-700">
            Overall: {activeProject.overall_readiness_score}/100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Land & Mutation', score: activeProject.readiness_breakdown.land, tab: 'land' },
            { label: 'Legal & Litigation', score: activeProject.readiness_breakdown.legal, tab: 'legal' },
            { label: 'Compensation Payout', score: activeProject.readiness_breakdown.compensation, tab: 'compensation' },
            { label: 'Forest & Parivesh', score: activeProject.readiness_breakdown.environment, tab: 'environment' },
            { label: 'R&R Resettlement', score: activeProject.readiness_breakdown.rr, tab: 'social' },
            { label: 'Documentation', score: activeProject.readiness_breakdown.documents, tab: 'documents' },
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
                    {dim.score >= 70 ? 'Optimal' : dim.score >= 50 ? 'Moderate' : 'Critical'}
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
                Critical Priority Parcels (High Delay Risk)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('land')}
              className="text-xs font-semibold text-gov-blue hover:underline flex items-center gap-0.5"
            >
              <span>View All {parcels.length} Parcels</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Parcel / Khasra</th>
                  <th className="p-2.5">Village / Tehsil</th>
                  <th className="p-2.5">Owner Name</th>
                  <th className="p-2.5">Delay Risk</th>
                  <th className="p-2.5">Primary Bottleneck</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalParcels.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-2.5">
                      <div className="font-bold text-gov-navy">{p.id}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Khasra {p.khasra_survey_no}</div>
                    </td>
                    <td className="p-2.5 text-slate-700">
                      {p.village}, {p.tehsil}
                    </td>
                    <td className="p-2.5 font-medium text-slate-800">
                      {p.owner.name}
                    </td>
                    <td className="p-2.5">
                      <RiskBadge level={p.delay_risk_level} score={p.delay_risk_score} showScore size="sm" />
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">
                      {p.top_risk_factors[0]?.factor_name || 'Documentation hold'}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setSelectedParcel(p)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-gov-blue hover:text-white text-slate-700 font-semibold transition border border-slate-300"
                      >
                        Inspect
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
                AI Proactive Intelligence
              </span>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Grounded RAG
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Alternative Alignment Recommendation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI simulator identified that <strong>Route Alignment B (Southern Greenfield Bypass)</strong> reduces overall project delay risk from <strong>71% to 31%</strong>, saves ~140 days, and cuts affected households by 68%.
            </p>
            <button
              onClick={() => setActiveTab('routes')}
              className="w-full bg-gov-blue hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>Launch Route Simulator</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Statutory Compliance & Land Acquisition Timeline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span>Section 11 (Preliminary):</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Gazette Published
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Section 19 (Declaration):</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Declared
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Section 23 (Award & Valuation):</span>
                <span className="font-semibold text-amber-700">
                  In Progress (68% Disbursed)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Section 38 (Physical Possession):</span>
                <span className="font-semibold text-red-700">
                  Blocked by 4 Judicial Stays
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
