import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { GitFork, CheckCircle2, Sparkles, MapPin, AlertTriangle } from 'lucide-react';

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
      
      {/* Top AI Decision Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-emerald-800/60 space-y-3">
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

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setSelectedRouteId('ROUTE-B')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedRouteId === 'ROUTE-B'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{tr('Select Route B (AI Recommended)', 'रूट B चुनें (एआई अनुशंसित)')}</span>
          </button>

          <button
            onClick={() => setActiveTab('gis')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{tr('View Alignments on GIS Map', 'जीआईएस मानचित्र पर संरेखन देखें')}</span>
          </button>
        </div>
      </div>

      {/* Interactive 3-Route Selection Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {tr('Select Candidate Alignment to Inspect:', 'जांच हेतु संरेखन चुनें:')}
          </h4>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            {tr('Active Selection: ', 'सक्रिय संरेखन: ')} {selectedRoute.route_id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {routes.map(r => {
            const isSelected = selectedRouteId === r.route_id;
            return (
              <button
                key={r.route_id}
                onClick={() => setSelectedRouteId(r.route_id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-[#16254c] border-blue-500 ring-2 ring-blue-500/40 shadow-md scale-[1.01]'
                    : 'bg-white dark:bg-[#111c38] border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-sm font-extrabold uppercase tracking-wide ${
                      isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'
                    }`}>
                      {r.route_id}
                    </span>
                    {r.is_recommended ? (
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                        ★ {tr('RECOMMENDED', 'अनुशंसित')}
                      </span>
                    ) : (
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                        isSelected 
                          ? 'bg-blue-100/80 text-blue-900 border-blue-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {tr('Option', 'विकल्प')}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs line-clamp-2 min-h-[32px] font-medium ${
                    isSelected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {getRouteSubName(r)}
                  </p>
                </div>

                <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-mono font-bold ${
                  isSelected 
                    ? 'border-blue-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                    : 'border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}>
                  <span>{r.total_length_km} km</span>
                  <span className={r.is_recommended ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                    +{r.expected_delay_days}d delay
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Route Deep-Dive Panel */}
      <div className="bg-white dark:bg-[#111c38] border border-blue-500/40 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-gov-navy dark:text-white font-mono">{selectedRoute.route_id}</span>
              {selectedRoute.is_recommended ? (
                <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                  ★ {tr('AI Optimal Alignment Choice', 'एआई इष्टतम संरेखन चयन')}
                </span>
              ) : (
                <span className="text-xs bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 px-2.5 py-0.5 rounded-full font-semibold">
                  ⚠️ {tr('Sub-optimal Alignment Option', 'अपूर्ण/उच्च जोखिम संरेखन विकल्प')}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
              {getRouteSubName(selectedRoute)}
            </h4>
          </div>

          <button
            onClick={() => setActiveTab('gis')}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{tr('Inspect Alignment on GIS Map', 'जीआईएस मानचित्र पर संरेखन देखें')}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{tr('Total Distance', 'कुल दूरी')}</span>
            <span className="font-bold text-slate-900 dark:text-white text-base font-mono">{selectedRoute.total_length_km} km</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{tr('Estimated Outlay', 'अनुमानित व्यय')}</span>
            <span className="font-bold text-slate-900 dark:text-white text-base font-mono">₹{selectedRoute.estimated_cost_cr.toLocaleString()} Cr</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{tr('Predicted Delay', 'अनुमानित विलंब')}</span>
            <span className={`font-bold text-base font-mono ${selectedRoute.is_recommended ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              +{selectedRoute.expected_delay_days} Days
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{tr('Forest Diverted', 'वन अपवर्तन')}</span>
            <span className="font-bold text-slate-900 dark:text-white text-base font-mono">{selectedRoute.forest_diverted_ha} Ha</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white block mb-1 font-bold">{tr('Detailed AI Evaluation & Risk Impact:', 'विस्तृत एआई मूल्यांकन एवं जोखिम प्रभाव:')}</strong>
          {getVerdictText(selectedRoute.ai_recommendation_verdict, selectedRoute.route_id)}
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <GitFork className="w-4 h-4 text-gov-blue dark:text-blue-400" />
            <span>{tr('Multi-Criteria Alignment Trade-off Comparison', 'बहु-मानदंड संरेखन व्यापार-तुलना')}</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {routes.length} {tr('Candidate Alignments', 'प्रस्तावित संरेखन')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 w-1/4">{tr('Evaluation Parameter', 'मूल्यांकन मापदंड')}</th>
                {routes.map(r => {
                  const isSelected = selectedRouteId === r.route_id;
                  return (
                    <th
                      key={r.route_id}
                      className={`p-3 text-center cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-100/60 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border-x border-blue-400 dark:border-blue-600 font-bold'
                          : (r.is_recommended ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-300' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50')
                      }`}
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
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px] mx-auto">
                        {getRouteSubName(r)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              
              {/* Length & Cost */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Total Route Length', 'कुल मार्ग लंबाई')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold text-slate-900 dark:text-white ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}>
                    {r.total_length_km} {tr('km', 'किमी')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Estimated Total Cost', 'अनुमानित कुल लागत')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold text-slate-900 dark:text-white ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}>
                    ₹{r.estimated_cost_cr.toLocaleString()} {tr('Cr', 'करोड़')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Land Compensation Outlay', 'भूमि मुआवजा परिव्यय')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center text-slate-700 dark:text-slate-300 ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30 font-bold' : ''}`}>
                    ₹{r.compensation_cost_cr} {tr('Cr', 'करोड़')}
                  </td>
                ))}
              </tr>

              {/* Delay Probability & Readiness */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 bg-red-50/30 dark:bg-red-950/20">
                <td className="p-3 font-sans font-bold text-red-900 dark:text-red-300">
                  {tr('Predicted Delay Probability', 'अनुमानित विलंब प्रायिकता')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold text-sm ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''} ${r.is_recommended ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    {(r.delay_probability * 100).toFixed(0)}% {tr('Risk', 'जोखिम')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Expected Project Delay', 'अनुमानित परियोजना विलंब')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''} ${r.is_recommended ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    +{r.expected_delay_days} {tr('Days', 'दिन')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 bg-blue-50/30 dark:bg-blue-950/20">
                <td className="p-3 font-sans font-bold text-gov-blue dark:text-blue-400">
                  {tr('Overall Project Readiness', 'समग्र परियोजना तत्परता')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold text-sm text-gov-navy dark:text-blue-300 ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30 font-extrabold' : ''}`}>
                    {r.project_readiness_score} / 100
                  </td>
                ))}
              </tr>

              {/* Social & Environmental */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Affected Households', 'प्रभावित परिवार')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-bold ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''} ${r.affected_households > 1000 ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {r.affected_households.toLocaleString()} {tr('Families', 'परिवार')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Forest Land Diverted', 'अपवर्तित वन भूमि')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''} ${r.forest_diverted_ha > 50 ? 'text-red-700 dark:text-red-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-semibold'}`}>
                    {r.forest_diverted_ha} {tr('Hectares', 'हेक्टेयर')}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Legal Dispute Risk Score', 'विधिक विवाद जोखिम स्कोर')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center text-slate-800 dark:text-slate-200 ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30 font-bold' : ''}`}>
                    {r.legal_risk_score} / 100
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Employment Potential', 'रोजगार क्षमता')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 text-center font-semibold text-emerald-700 dark:text-emerald-400 ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30 font-bold' : ''}`}>
                    {r.employment_potential_jobs.toLocaleString()} {tr('Jobs', 'रोजगार')}
                  </td>
                ))}
              </tr>

              {/* AI Verdict */}
              <tr>
                <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">
                  {tr('AI Recommendation Verdict', 'एआई अनुशंसा निष्कर्ष')}
                </td>
                {routes.map(r => (
                  <td key={r.route_id} className={`p-3 font-sans text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed ${selectedRouteId === r.route_id ? 'bg-blue-50/50 dark:bg-blue-950/30 font-semibold' : ''}`}>
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
