import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Download, Printer, FileText, CheckCircle2, Shield, Eye } from 'lucide-react';

export const ReportGeneratorTab: React.FC = () => {
  const { t } = useLanguage();
  const { activeProject, parcels, actionItems } = useProject();

  const [includeLand, setIncludeLand] = useState(true);
  const [includeComp, setIncludeComp] = useState(true);
  const [includeLegal, setIncludeLegal] = useState(true);
  const [includeEnv, setIncludeEnv] = useState(true);
  const [includeActions, setIncludeActions] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    window.open(`http://127.0.0.1:8000/api/reports/html/${activeProject?.id || 'jaipur-ajmer-nh48'}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold bg-gov-navy text-white px-2 py-0.5 rounded uppercase tracking-wider">
              Official Dossier Generator
            </span>
            <span className="text-xs text-slate-500 font-mono">Government Format (NIC Standard)</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Generate Comprehensive Project Readiness & Risk Assessment Dossier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generates standardized executive dossiers for Project Directors, District Collectors, and Ministry High-Powered Committees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded bg-gov-blue hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Customization Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
        <span className="font-bold text-slate-700 uppercase tracking-wide block">
          Include Dossier Modules:
        </span>
        <div className="flex flex-wrap gap-4 font-medium text-slate-700">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeLand} onChange={e => setIncludeLand(e.target.checked)} className="rounded text-gov-blue" />
            <span>Land & Khasra Parcels Table</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeComp} onChange={e => setIncludeComp(e.target.checked)} className="rounded text-gov-blue" />
            <span>RFCTLARR Compensation Ledger</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeLegal} onChange={e => setIncludeLegal(e.target.checked)} className="rounded text-gov-blue" />
            <span>e-Courts Legal & Stay Order Dossier</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeEnv} onChange={e => setIncludeEnv(e.target.checked)} className="rounded text-gov-blue" />
            <span>Forest & Environmental Status</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeActions} onChange={e => setIncludeActions(e.target.checked)} className="rounded text-gov-blue" />
            <span>Priority Officer Action Queue</span>
          </label>
        </div>
      </div>

      {/* Live Printable Report Preview */}
      <div className="bg-white border border-slate-300 rounded-lg shadow-lg p-8 max-w-4xl mx-auto text-slate-800 space-y-6 print:shadow-none print:border-none">
        
        {/* Report Header */}
        <div className="text-center border-b-2 border-double border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            Government Decision Support Platform
          </div>
          <h1 className="text-xl font-extrabold text-gov-navy uppercase tracking-tight">
            National Land & Infrastructure Intelligence System (NLIIS)
          </h1>
          <h2 className="text-xs font-semibold text-slate-600 uppercase">
            Comprehensive Project Readiness, Delay Risk & Bottleneck Assessment Dossier
          </h2>
          <div className="text-[10px] font-bold text-red-700 tracking-wider pt-1">
            CONFIDENTIAL • FOR INTERNAL ADMINISTRATIVE USE ONLY
          </div>
        </div>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Project Name</span>
            <strong className="text-slate-900">{activeProject?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Executing Authority</span>
            <strong className="text-slate-900">{activeProject?.authority}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Length / Cost</span>
            <strong className="text-slate-900">{activeProject?.length_km} km / ₹{activeProject?.total_cost_cr} Cr</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Overall Delay Risk</span>
            <strong className="text-red-700 font-mono">{activeProject?.overall_delay_risk_score}% ({activeProject?.overall_delay_risk_level})</strong>
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div className="p-4 bg-blue-50 border-l-4 border-gov-blue text-xs text-slate-800 leading-relaxed space-y-1">
          <strong>Executive Assessment:</strong>
          <p>
            The project requires <strong>{activeProject?.total_land_required_acres} acres</strong> across <strong>{activeProject?.total_parcels_count} land parcels</strong>. 
            The AI predictive model calculates a <strong>{activeProject?.overall_delay_risk_score}% probability of delay (+{activeProject?.expected_delay_days} days)</strong>, 
            driven primarily by <strong>{activeProject?.stay_orders_count} judicial stay orders</strong> in Rajasthan High Court and 
            <strong> ₹{activeProject?.compensation_pending_cr} Cr pending compensation</strong>.
          </p>
        </div>

        {/* Priority Parcels Summary */}
        {includeLand && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Critical Priority Land Parcels
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 font-semibold border-b">
                <tr>
                  <th className="p-2">Parcel / Khasra</th>
                  <th className="p-2">Village / Tehsil</th>
                  <th className="p-2">Owner Name</th>
                  <th className="p-2">Risk Score</th>
                  <th className="p-2">Primary Bottleneck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {parcels.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td className="p-2 font-bold font-mono">{p.id} ({p.khasra_survey_no})</td>
                    <td className="p-2">{p.village}, {p.tehsil}</td>
                    <td className="p-2">{p.owner.name}</td>
                    <td className="p-2 font-bold text-red-700">{p.delay_risk_score}% ({p.delay_risk_level})</td>
                    <td className="p-2 text-[11px]">{p.top_risk_factors[0]?.factor_name || 'Documentation hold'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Queue Summary */}
        {includeActions && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Priority Administrative Action Queue
            </h3>
            <div className="space-y-2 text-xs">
              {actionItems.map(act => (
                <div key={act.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{act.id}: {act.title}</span>
                    <span className="font-mono text-gov-blue">Due: {act.due_date} ({act.status})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{act.recommended_action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature Block */}
        <div className="pt-10 flex justify-between items-end text-xs text-slate-700 border-t border-slate-200">
          <div className="text-center w-52 border-t border-slate-600 pt-1">
            <strong>Special Land Acquisition Officer</strong><br />
            PIU Jaipur / Ajmer
          </div>
          <div className="text-center w-52 border-t border-slate-600 pt-1">
            <strong>District Magistrate & Collector</strong><br />
            Chairperson, District LA Committee
          </div>
        </div>

      </div>

    </div>
  );
};
