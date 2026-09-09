import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { AlternativeRoute } from '../../types';
import { GitFork, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Scale, Trees, Landmark } from 'lucide-react';

export const RouteSimulatorTab: React.FC = () => {
  const { t } = useLanguage();
  const { routes, setActiveTab } = useProject();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('ROUTE-B');

  const selectedRoute = routes.find(r => r.route_id === selectedRouteId) || routes[0];

  return (
    <div className="space-y-6">
      
      {/* Top AI Decision Callout */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-lg p-6 shadow-md border border-emerald-800/60 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Alignment Optimization Verdict
          </span>
          <span className="text-xs text-slate-300 font-mono">Multi-Criteria Decision Analysis (MCDA)</span>
        </div>

        <h3 className="text-lg font-bold text-white leading-tight">
          Route B (Southern Greenfield Bypass) is Strongly Recommended over Route A
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          While Route B requires an additional capital outlay of ₹260 Cr, the AI predictive engine forecasts that it 
          <strong> reduces overall project delay probability by 40% (saving ~140 calendar days)</strong>, 
          displaces <strong>68% fewer rural households</strong> (412 vs 1,284), and 
          decreases forest land diversion from <strong>72.8 ha to 14.2 ha</strong>.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setSelectedRouteId('ROUTE-B')}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              selectedRouteId === 'ROUTE-B'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Select Route B (AI Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab('gis')}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            View Alignments on GIS Map
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
            <GitFork className="w-4 h-4 text-gov-blue" />
            <span>Multi-Criteria Alignment Trade-off Comparison</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">3 Candidate Alignments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b">
              <tr>
                <th className="p-3 w-1/4">Evaluation Parameter</th>
                {routes.map(r => (
                  <th
                    key={r.route_id}
                    className={`p-3 text-center cursor-pointer transition ${
                      r.is_recommended ? 'bg-emerald-50 text-emerald-950 border-x border-emerald-200' : ''
                    } ${selectedRouteId === r.route_id ? 'ring-2 ring-gov-blue' : ''}`}
                    onClick={() => setSelectedRouteId(r.route_id)}
                  >
                    <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                      <span>{r.route_id}</span>
                      {r.is_recommended && (
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono">
                          ★ RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5 truncate max-w-[200px] mx-auto">
                      {r.route_name.split('(')[1]?.replace(')', '') || r.route_name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              
              {/* Length & Cost */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Total Route Length</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-bold text-slate-900">
                    {r.total_length_km} km
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Estimated Total Cost</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-bold text-slate-900">
                    ₹{r.estimated_cost_cr.toLocaleString()} Cr
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Land Compensation Outlay</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center text-slate-700">
                    ₹{r.compensation_cost_cr} Cr
                  </td>
                ))}
              </tr>

              {/* Delay Probability & Readiness */}
              <tr className="hover:bg-slate-50 bg-red-50/30">
                <td className="p-3 font-sans font-bold text-red-900">Predicted Delay Probability</td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold text-sm ${r.is_recommended ? 'text-emerald-700 bg-emerald-50' : 'text-red-700'}`}>
                    {(r.delay_probability * 100).toFixed(0)}% Risk
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Expected Project Delay</td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold ${r.is_recommended ? 'text-emerald-700' : 'text-red-700'}`}>
                    +{r.expected_delay_days} Days
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 bg-blue-50/30">
                <td className="p-3 font-sans font-bold text-gov-blue">Overall Project Readiness</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-bold text-sm text-gov-navy">
                    {r.project_readiness_score} / 100
                  </td>
                ))}
              </tr>

              {/* Social & Environmental */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Affected Households</td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold ${r.affected_households > 1000 ? 'text-red-700' : 'text-slate-800'}`}>
                    {r.affected_households.toLocaleString()} Families
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Forest Land Diverted</td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center ${r.forest_diverted_ha > 50 ? 'text-red-700 font-bold' : 'text-emerald-700 font-semibold'}`}>
                    {r.forest_diverted_ha} Hectares
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Legal Dispute Risk Score</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center text-slate-800">
                    {r.legal_risk_score} / 100
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">Employment Potential</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-semibold text-emerald-700">
                    {r.employment_potential_jobs.toLocaleString()} Jobs
                  </td>
                ))}
              </tr>

              {/* AI Verdict */}
              <tr>
                <td className="p-3 font-sans font-bold text-slate-900">AI Recommendation Verdict</td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 font-sans text-slate-700 text-[11px] leading-relaxed">
                    {r.ai_recommendation_verdict}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
