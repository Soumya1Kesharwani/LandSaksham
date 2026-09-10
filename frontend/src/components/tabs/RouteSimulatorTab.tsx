import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { GitFork, CheckCircle2, Sparkles } from 'lucide-react';

export const RouteSimulatorTab: React.FC = () => {
  const { language, tr } = useLanguage();
  const { routes, setActiveTab } = useProject();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('ROUTE-B');

  const selectedRoute = routes.find(r => r.route_id === selectedRouteId) || routes[0];

  const getVerdictText = (verdict: string, routeId: string) => {
    if (language === 'en') return verdict;
    if (routeId === 'ROUTE-A') {
      return tr(
        'High litigation and displacement risk (~185 days delay). Not recommended.',
        'उच्च मुकदमेबाजी एवं सघन आबादी के विस्थापन के कारण उच्च जोखिम (~185 दिन विलंब)। अनुशंसित नहीं।'
      );
    }
    if (routeId === 'ROUTE-B') {
      return tr(
        '★ Optimal Alignment: Minimal displacement (412 families), lowest forest diversion (14.2 ha), and shortest delay (45 days).',
        '★ इष्टतम संरेखन: न्यूनतम विस्थापन (412 परिवार), न्यूनतम वन क्षति (14.2 हे.) तथा 45 दिनों का न्यूनतम विलंब।'
      );
    }
    return tr(
      'Environmentally unacceptable: 112.5 ha dense forest diversion and wildlife corridor fragmentation.',
      'पर्यावरणीय दृष्टि से अस्वीकार्य: 112.5 हेक्टेयर सघन वन अपवर्तन एवं वन्यजीव गलियारे में व्यवधान।'
    );
  };

  const getRouteSubName = (r: { route_name: string, route_id: string }) => {
    if (language !== 'en') {
      if (r.route_id === 'ROUTE-A') return tr('Northern Brownfield (Existing NH-48 Widening)', 'उत्तरी ब्राउनफील्ड (विद्यमान NH-48 चौड़ीकरण)');
      if (r.route_id === 'ROUTE-B') return tr('Southern Greenfield Bypass (Optimal Alignment)', 'दक्षिणी ग्रीनफील्ड बाईपास (इष्टतम संरेखन)');
      if (r.route_id === 'ROUTE-C') return tr('Eastern Expressway Corridor (Forest Intensive)', 'पूर्वी एक्सप्रेसवे कॉरीडोर (वन सघन)');
    }
    return r.route_name.split('(')[1]?.replace(')', '') || r.route_name;
  };

  return (
    <div className="space-y-6">
      
      {/* Top AI Decision Callout */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-lg p-6 shadow-md border border-emerald-800/60 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {tr('AI Alignment Optimization Verdict', 'एआई संरेखन अनुकूलन निर्णय')}
          </span>
          <span className="text-xs text-slate-300 font-mono">
            {tr('Multi-Criteria Decision Analysis (MCDA)', 'बहु-मानदंड निर्णय विश्लेषण (MCDA)')}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white leading-tight">
          {tr(
            'Route B (Southern Greenfield Bypass) is Strongly Recommended over Route A',
            'रूट B (दक्षिणी ग्रीनफील्ड बाईपास) रूट A की तुलना में दृढ़ता से अनुशंसित है'
          )}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {language !== 'en' ? (
            <>
              {tr(
                'While Route B requires an additional capital outlay of ₹260 Cr, the AI predictive engine forecasts that it',
                'यद्यपि रूट B में ₹260 करोड़ का अतिरिक्त पूंजीगत व्यय अपेक्षित है, एआई पूर्वानुमान मॉडल दर्शाता है कि यह'
              )}{' '}
              <strong>{tr('reduces overall project delay probability by 40% (saving ~140 calendar days)', 'समग्र परियोजना विलंब प्रायिकता को 40% कम करता है (~140 दिनों की बचत)')}</strong>,{' '}
              <strong>{tr('displaces 68% fewer rural households (412 vs 1,284)', '68% कम ग्रामीण परिवारों को विस्थापित करता है (412 बनाम 1,284)')}</strong>,{' '}
              {tr('and decreases forest land diversion from', 'तथा वन भूमि अपवर्तन को')}{' '}
              <strong>{tr('72.8 ha to 14.2 ha.', '72.8 हेक्टेयर से घटाकर 14.2 हेक्टेयर करता है।')}</strong>
            </>
          ) : (
            <>
              While Route B requires an additional capital outlay of ₹260 Cr, the AI predictive engine forecasts that it 
              <strong> reduces overall project delay probability by 40% (saving ~140 calendar days)</strong>, 
              displaces <strong>68% fewer rural households</strong> (412 vs 1,284), and 
              decreases forest land diversion from <strong>72.8 ha to 14.2 ha</strong>.
            </>
          )}
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
            <span>{tr('Select Route B (AI Recommended)', 'रूट B चुनें (एआई अनुशंसित)')}</span>
          </button>

          <button
            onClick={() => setActiveTab('gis')}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            {tr('View Alignments on GIS Map', 'जीआईएस मानचित्र पर संरेखन देखें')}
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
            <GitFork className="w-4 h-4 text-gov-blue" />
            <span>{tr('Multi-Criteria Alignment Trade-off Comparison', 'बहु-मानदंड संरेखन व्यापार-तुलना')}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {routes.length} {tr('Candidate Alignments', 'प्रस्तावित संरेखन')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b">
              <tr>
                <th className="p-3 w-1/4">{tr('Evaluation Parameter', 'मूल्यांकन मापदंड')}</th>
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
                          ★ {tr('RECOMMENDED', 'अनुशंसित')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5 truncate max-w-[200px] mx-auto">
                      {getRouteSubName(r)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              
              {/* Length & Cost */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Total Route Length', 'कुल मार्ग लंबाई')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-bold text-slate-900">
                    {r.total_length_km} {tr('km', 'किमी')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Estimated Total Cost', 'अनुमानित कुल लागत')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-bold text-slate-900">
                    ₹{r.estimated_cost_cr.toLocaleString()} {tr('Cr', 'करोड़')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Land Compensation Outlay', 'भूमि मुआवजा परिव्यय')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center text-slate-700">
                    ₹{r.compensation_cost_cr} {tr('Cr', 'करोड़')}
                  </td>
                ))}
              </tr>

              {/* Delay Probability & Readiness */}
              <tr className="hover:bg-slate-50 bg-red-50/30">
                <td className="p-3 font-sans font-bold text-red-900">
                  {tr('Predicted Delay Probability', 'अनुमानित विलंब प्रायिकता')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold text-sm ${r.is_recommended ? 'text-emerald-700 bg-emerald-50' : 'text-red-700'}`}>
                    {(r.delay_probability * 100).toFixed(0)}% {tr('Risk', 'जोखिम')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Expected Project Delay', 'अनुमानित परियोजना विलंब')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold ${r.is_recommended ? 'text-emerald-700' : 'text-red-700'}`}>
                    +{r.expected_delay_days} {tr('Days', 'दिन')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 bg-blue-50/30">
                <td className="p-3 font-sans font-bold text-gov-blue">
                  {tr('Overall Project Readiness', 'समग्र परियोजना तत्परता')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-bold text-sm text-gov-navy">
                    {r.project_readiness_score} / 100
                  </td>
                ))}
              </tr>

              {/* Social & Environmental */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Affected Households', 'प्रभावित परिवार')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold ${r.affected_households > 1000 ? 'text-red-700' : 'text-slate-800'}`}>
                    {r.affected_households.toLocaleString()} {tr('Families', 'परिवार')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Forest Land Diverted', 'अपवर्तित वन भूमि')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center ${r.forest_diverted_ha > 50 ? 'text-red-700 font-bold' : 'text-emerald-700 font-semibold'}`}>
                    {r.forest_diverted_ha} {tr('Hectares', 'हेक्टेयर')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Legal Dispute Risk Score', 'विधिक विवाद जोखिम स्कोर')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center text-slate-800">
                    {r.legal_risk_score} / 100
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-semibold text-slate-800">
                  {tr('Employment Potential', 'रोजगार क्षमता')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 text-center font-semibold text-emerald-700">
                    {r.employment_potential_jobs.toLocaleString()} {tr('Jobs', 'रोजगार')}
                  </td>
                ))}
              </tr>

              {/* AI Verdict */}
              <tr>
                <td className="p-3 font-sans font-bold text-slate-900">
                  {tr('AI Recommendation Verdict', 'एआई अनुशंसा निष्कर्ष')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className="p-3 font-sans text-slate-700 text-[11px] leading-relaxed">
                    {getVerdictText(r.ai_recommendation_verdict, r.route_id)}
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
