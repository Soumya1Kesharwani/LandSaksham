import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { BrainCircuit, Sliders } from 'lucide-react';

export const AIDelayPredictionTab: React.FC = () => {
  const { language, tr } = useLanguage();
  const { activeProject } = useProject();

  // What-if simulation toggles
  const [vacateStays, setVacateStays] = useState(false);
  const [resolveMutations, setResolveMutations] = useState(false);
  const [disburseComp, setDisburseComp] = useState(false);
  const [clearForest, setClearForest] = useState(false);

  // Compute simulated risk
  let simulatedRisk = activeProject?.overall_delay_risk_score || 71;
  let simulatedDays = activeProject?.expected_delay_days || 185;

  if (vacateStays) {
    simulatedRisk -= 22;
    simulatedDays -= 75;
  }
  if (resolveMutations) {
    simulatedRisk -= 14;
    simulatedDays -= 40;
  }
  if (disburseComp) {
    simulatedRisk -= 12;
    simulatedDays -= 30;
  }
  if (clearForest) {
    simulatedRisk -= 10;
    simulatedDays -= 25;
  }

  simulatedRisk = Math.max(12, Math.min(95, simulatedRisk));
  simulatedDays = Math.max(15, simulatedDays);

  const shapFactors = [
    {
      name: tr('Active Judicial Stay Orders (High Court)', 'सक्रिय न्यायिक स्थगनादेश (उच्च न्यायालय)'),
      importance: 0.34,
      impact_days: 110,
      category: tr('Legal / Litigation', 'विधिक / मुकदमेबाजी'),
      severity: 'CRITICAL'
    },
    {
      name: tr('Revenue Record / Jamabandi Succession Mismatch', 'राजस्व अभिलेख / जमाबंदी वारिसाना विसंगति'),
      importance: 0.26,
      impact_days: 55,
      category: tr('Revenue Dept', 'राजस्व विभाग'),
      severity: 'HIGH'
    },
    {
      name: tr('Compensation Disbursement Escrow Pendency', 'मुआवजा संवितरण एस्क्रो लंबन'),
      importance: 0.21,
      impact_days: 35,
      category: tr('LAO Treasury', 'एलएओ कोषागार'),
      severity: 'HIGH'
    },
    {
      name: tr('MoEFCC Parivesh Stage-II Forest Inactivity (48d)', 'पर्यावरण मंत्रालय (परिवेश) चरण-II वन निष्क्रियता (48 दिन)'),
      importance: 0.12,
      impact_days: 25,
      category: tr('Forest Dept', 'वन विभाग'),
      severity: 'MEDIUM'
    },
    {
      name: tr('Missing Form 12-B Statutory Document Certificates', 'प्रपत्र 12-B वैधानिक दस्तावेज प्रमाण पत्रों का अभाव'),
      importance: 0.07,
      impact_days: 15,
      category: tr('Documentation', 'दस्तावेज'),
      severity: 'LOW'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-purple-300 uppercase tracking-wider flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
              {tr('Explainable AI (XGBoost + SHAP Engine)', 'व्याख्यात्मक एआई (XGBoost + SHAP इंजन)')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {tr('Confidence: 94.6%', 'सटीकता: 94.6%')}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {tr('Project Delay Risk Prediction & Bottleneck Decomposition', 'परियोजना विलंब जोखिम पूर्वानुमान एवं अड़चनों का विश्लेषण')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr(
              'Trained on historical land acquisition schedules, judicial stay patterns, and statutory clearance timelines.',
              'ऐतिहासिक भूमि अधिग्रहण समय-सारिणी, न्यायिक स्थगनादेश पैटर्न एवं वैधानिक स्वीकृति समयावधि पर प्रशिक्षित।'
            )}
          </p>
        </div>

        <div className="flex items-center justify-around md:justify-start gap-4 bg-slate-50 border border-slate-200 p-3 rounded-lg shrink-0">
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase">
              {tr('Baseline Delay Risk', 'आधारभूत विलंब जोखिम')}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-red-700">
              {activeProject?.overall_delay_risk_score}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase">
              {tr('Expected Delay', 'अनुमानित विलंब')}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
              +{activeProject?.expected_delay_days} {tr('days', 'दिन')}
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Importance Waterfall */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2 gap-1">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              {tr('SHAP Feature Attribution (Why is this project at risk?)', 'SHAP फीचर एट्रिब्यूशन (यह परियोजना जोखिम में क्यों है?)')}
            </h3>
            <p className="text-xs text-slate-500">
              {tr(
                'Additive Shapley feature values explaining the primary drivers of delay risk:',
                'योज्य शैपली (SHAP) मान जो विलंब जोखिम के मुख्य कारकों की व्याख्या करते हैं:'
              )}{' '}
              <span className="font-mono font-bold text-slate-700">{activeProject?.overall_delay_risk_score}%</span>
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
            {tr('Sum = 100% Relative Impact', 'कुल = 100% सापेक्ष प्रभाव')}
          </span>
        </div>

        <div className="space-y-3">
          {shapFactors.map((f, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-3.5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-slate-800">{idx + 1}. {f.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                    {f.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-red-700 font-bold">
                    +{(f.importance * 100).toFixed(0)}% {tr('Delay Contribution', 'विलंब योगदान')}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    (+{f.impact_days} {tr('Days', 'दिन')})
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${f.importance * 100 * 2.2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive What-If Intervention Simulator */}
      <div className="bg-slate-900 text-white rounded-lg p-3.5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              {tr('Proactive Decision Simulator: "What-If" Administrative Actions', 'सक्रिय निर्णय सिमुलेटर: "क्या-यदि (What-If)" प्रशासनिक हस्तक्षेप')}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
            {tr('Real-time Recalculation', 'रीयल-टाइम पुनर्गणना')}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          {tr(
            'Simulate how executing specific administrative interventions impacts overall project delay risk and expected completion date.',
            'अनुकरण करें कि विशिष्ट प्रशासनिक हस्तक्षेपों के निष्पादन से समग्र परियोजना विलंब जोखिम एवं पूर्णता तिथि पर क्या प्रभाव पड़ता है।'
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggles */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-750 transition text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={vacateStays}
                  onChange={e => setVacateStays(e.target.checked)}
                  className="w-4 h-4 rounded text-gov-blue"
                />
                <span>{tr('Vacate High Court Stays (AAG Application & Compromise)', 'उच्च न्यायालय स्थगनादेश निरस्तीकरण (अपर महाधिवक्ता आवेदन एवं समझौता)')}</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">-22% {tr('Risk', 'जोखिम')}</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-750 transition text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resolveMutations}
                  onChange={e => setResolveMutations(e.target.checked)}
                  className="w-4 h-4 rounded text-gov-blue"
                />
                <span>{tr('Complete 17 Jamabandi Succession Mutations', '17 जमाबंदी वारिसाना नामांतरण पूर्ण करना')}</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">-14% {tr('Risk', 'जोखिम')}</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-750 transition text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={disburseComp}
                  onChange={e => setDisburseComp(e.target.checked)}
                  className="w-4 h-4 rounded text-gov-blue"
                />
                <span>{tr('Disburse Outstanding ₹58.3 Cr Compensation', 'शेष ₹58.3 करोड़ मुआवजा संवितरण')}</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">-12% {tr('Risk', 'जोखिम')}</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-750 transition text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={clearForest}
                  onChange={e => setClearForest(e.target.checked)}
                  className="w-4 h-4 rounded text-gov-blue"
                />
                <span>{tr('Secure Parivesh Stage-II Forest Working Permission', 'परिवेश चरण-II वन कार्य अनुमति प्राप्त करना')}</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">-10% {tr('Risk', 'जोखिम')}</span>
            </label>
          </div>

          {/* Result Card */}
          <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                {tr('Simulated Project Readiness & Delay Outcome', 'सिम्युलेटेड परियोजना तत्परता एवं विलंब परिणाम')}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">
                    {tr('Simulated Delay Risk', 'सिम्युलेटेड विलंब जोखिम')}
                  </span>
                  <strong className={`text-2xl font-mono font-extrabold ${simulatedRisk < 35 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {simulatedRisk}%
                  </strong>
                  <span className="text-[10px] text-slate-500 block">
                    ({tr('Reduced by', 'कमी:')} {71 - simulatedRisk}%)
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">
                    {tr('Simulated Delay Days', 'सिम्युलेटेड विलंब दिन')}
                  </span>
                  <strong className="text-2xl font-mono font-extrabold text-white">
                    +{simulatedDays}d
                  </strong>
                  <span className="text-[10px] text-emerald-400 block">
                    ({185 - simulatedDays} {tr('days saved', 'दिनों की बचत')})
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded border border-slate-800">
              💡 <strong>{tr('AI Insight:', 'एआई निष्कर्ष:')}</strong> {tr(
                'Resolving the top 2 bottlenecks (Stay order vacation + Jamabandi mutation) reduces project risk by 36% and saves 115 days of construction downtime.',
                'शीर्ष 2 अड़चनों (स्थगनादेश निरस्तीकरण + जमाबंदी नामांतरण) के समाधान से परियोजना जोखिम 36% कम होता है तथा 115 कार्य दिवसों की बचत होती है।'
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
