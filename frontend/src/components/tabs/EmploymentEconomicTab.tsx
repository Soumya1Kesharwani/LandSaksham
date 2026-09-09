import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Briefcase, TrendingUp, Truck, Users, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

export const EmploymentEconomicTab: React.FC = () => {
  const { t } = useLanguage();
  const { activeProject } = useProject();

  const emp = activeProject?.employment;
  const eco = activeProject?.economic;

  return (
    <div className="space-y-6">
      
      {/* Top Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Direct Construction Jobs</span>
            <Briefcase className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {emp?.direct_construction_jobs.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">36-Month Active Build Phase</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-gov-blue">
            <span>Indirect Supply Chain Jobs</span>
            <TrendingUp className="w-4 h-4 text-gov-blue" />
          </div>
          <div className="text-2xl font-bold font-mono text-gov-navy mt-2">
            {emp?.indirect_supply_chain_jobs.toLocaleString()}
          </div>
          <p className="text-xs text-slate-600 mt-1">Cement, Steel, Aggregates & Logistics</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-emerald-800">
            <span>Total Estimated Jobs</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 mt-2">
            {emp?.total_estimated_jobs.toLocaleString()} Jobs
          </div>
          <p className="text-xs text-emerald-800 mt-1">{emp?.local_worker_absorption_pct}% Local District Absorption</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Annual Regional GDP Boost</span>
            <Truck className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-bold font-mono text-gov-blue mt-2">
            ₹{eco?.estimated_local_gdp_boost_cr} Crore
          </div>
          <p className="text-xs text-slate-500 mt-1">{eco?.avg_travel_time_reduction_pct}% Average Travel Time Savings</p>
        </div>
      </div>

      {/* National Development Impact Flow Visual */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">
            Development Impact Pipeline: From Infrastructure to National Growth
          </h3>
          <span className="text-xs text-slate-400 font-mono">Macro-Economic Simulation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
          {[
            { step: '1. PROJECT', title: 'Expressway Build', sub: '₹3,420 Cr Capital Infusion' },
            { step: '2. CONNECTIVITY', title: '18.4% Faster Freight', sub: '34 Rural Mandis Linked' },
            { step: '3. EMPLOYMENT', title: '30,700 Jobs Created', sub: '68.5% Local Absorption' },
            { step: '4. COMMERCE', title: 'Industrial Logistics', sub: 'Marble, Textile & Cold Storage' },
            { step: '5. REGIONAL GDP', title: '+₹480 Cr / Year', sub: 'Jaipur–Ajmer Belt Growth' },
            { step: '6. NATION BUILDING', title: 'PM GatiShakti Vision', sub: 'Balanced Regional Progress' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div className="text-[10px] font-bold text-amber-400 tracking-wider mb-1">{item.step}</div>
              <div className="font-bold text-white text-xs">{item.title}</div>
              <div className="text-[11px] text-slate-400 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade and Sector Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Key Technical Employment Trades Mobilized
          </h4>
          <div className="space-y-2 text-xs">
            {emp?.key_employment_trades.map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-medium text-slate-800">{trade}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Skill Certified
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * {emp?.assumptions_note}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Key Beneficiary Industrial & Agricultural Clusters
          </h4>
          <div className="space-y-2 text-xs">
            {eco?.key_beneficiary_sectors.map((sec, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-medium text-slate-800">{sec}</span>
                <span className="text-gov-blue font-bold">+24% Logistics Speed</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * {eco?.assumptions_note}
          </p>
        </div>
      </div>

    </div>
  );
};
