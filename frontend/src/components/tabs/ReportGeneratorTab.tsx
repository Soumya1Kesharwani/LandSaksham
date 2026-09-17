import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Download, Printer } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export const ReportGeneratorTab: React.FC = () => {
  const { language, tr, t } = useLanguage();
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
    window.open(`${API_BASE_URL}/reports/html/${activeProject?.id || 'jaipur-ajmer-nh48'}`, '_blank');
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold bg-gov-navy text-white px-2 py-0.5 rounded uppercase tracking-wider">
              {tr('Official Dossier Generator', 'आधिकारिक डोजियर जनरेटर')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {tr('Government Format (NIC Standard)', 'शासकीय प्रारूप (NIC मानक)')}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {tr(
              'Generate Comprehensive Project Readiness & Risk Assessment Dossier',
              'समग्र परियोजना तत्परता एवं जोखिम मूल्यांकन डोजियर जनरेट करें'
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr(
              'Generates standardized executive dossiers for Project Directors, District Collectors, and Ministry High-Powered Committees.',
              'परियोजना निदेशकों, जिला कलेक्टरों एवं मंत्रालय की उच्चाधिकार प्राप्त समितियों हेतु मानकीकृत कार्यकारी डोजियर तैयार करता है।'
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto justify-center px-3.5 py-2 rounded border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{tr('Print Report', 'रिपोर्ट प्रिंट करें')}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="w-full sm:w-auto justify-center px-4 py-2 rounded bg-gov-blue hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>{tr('Download Official PDF Dossier', 'आधिकारिक पीडीएफ डोजियर डाउनलोड करें')}</span>
          </button>
        </div>
      </div>

      {/* Report Customization Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
        <span className="font-bold text-slate-700 uppercase tracking-wide block">
          {tr('Include Dossier Modules:', 'डोजियर मॉड्यूल सम्मिलित करें:')}
        </span>
        <div className="flex flex-wrap gap-4 font-medium text-slate-700">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeLand} onChange={e => setIncludeLand(e.target.checked)} className="rounded text-gov-blue" />
            <span>{tr('Land & Khasra Parcels Table', 'भूमि एवं खसरा पार्सल तालिका')}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeComp} onChange={e => setIncludeComp(e.target.checked)} className="rounded text-gov-blue" />
            <span>{tr('RFCTLARR Compensation Ledger', 'RFCTLARR मुआवजा बही-खाता')}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeLegal} onChange={e => setIncludeLegal(e.target.checked)} className="rounded text-gov-blue" />
            <span>{tr('e-Courts Legal & Stay Order Dossier', 'ई-कोर्ट्स विधिक एवं स्थगनादेश डोजियर')}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeEnv} onChange={e => setIncludeEnv(e.target.checked)} className="rounded text-gov-blue" />
            <span>{tr('Forest & Environmental Status', 'वन एवं पर्यावरणीय स्थिति')}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeActions} onChange={e => setIncludeActions(e.target.checked)} className="rounded text-gov-blue" />
            <span>{tr('Priority Officer Action Queue', 'अधिकारी प्राथमिकता कार्य कतार')}</span>
          </label>
        </div>
      </div>

      {/* Live Printable Report Preview */}
      <div className="bg-white border border-slate-300 rounded-lg shadow-lg p-3 sm:p-8 max-w-4xl w-full mx-auto text-slate-800 space-y-6 print:shadow-none print:border-none min-w-0 overflow-hidden">
        
        {/* Report Header */}
        <div className="text-center border-b-2 border-double border-slate-900 pb-4 space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-white p-0.5 border border-slate-300 shadow-xs flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Emblem" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            {tr('Government Decision Support Platform', 'शासकीय निर्णय समर्थन प्रणाली')}
          </div>
          <h1 className="text-xl font-extrabold text-gov-navy uppercase tracking-tight">
            {tr(
              'National Land & Infrastructure Intelligence System (NLIIS)',
              'राष्ट्रीय भूमि एवं अवसंरचना आसूचना प्रणाली (NLIIS)'
            )}
          </h1>
          <h2 className="text-xs font-semibold text-slate-600 uppercase">
            {tr(
              'Comprehensive Project Readiness, Delay Risk & Bottleneck Assessment Dossier',
              'समग्र परियोजना तत्परता, विलंब जोखिम एवं अड़चन मूल्यांकन डोजियर'
            )}
          </h2>
          <div className="text-[10px] font-bold text-red-700 tracking-wider pt-1">
            {tr('CONFIDENTIAL • FOR INTERNAL ADMINISTRATIVE USE ONLY', 'गोपनीय • केवल आंतरिक प्रशासनिक उपयोग हेतु')}
          </div>
        </div>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {tr('Project Name', 'परियोजना का नाम')}
            </span>
            <strong className="text-slate-900">{t(activeProject?.name, activeProject?.name)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {tr('Executing Authority', 'क्रियान्वयन एजेंसी')}
            </span>
            <strong className="text-slate-900">{t(activeProject?.authority, activeProject?.authority)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {tr('Length / Cost', 'लंबाई / लागत')}
            </span>
            <strong className="text-slate-900">
              {activeProject?.length_km} {tr('km', 'किमी')} / ₹{activeProject?.total_cost_cr} {tr('Cr', 'करोड़')}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {tr('Overall Delay Risk', 'समग्र विलंब जोखिम')}
            </span>
            <strong className="text-red-700 font-mono">
              {activeProject?.overall_delay_risk_score}% ({t(activeProject?.overall_delay_risk_level, activeProject?.overall_delay_risk_level)})
            </strong>
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div className="p-4 bg-blue-50 border-l-4 border-gov-blue text-xs text-slate-800 leading-relaxed space-y-1">
          <strong>{tr('Executive Assessment:', 'कार्यकारी मूल्यांकन सारांश:')}</strong>
          <p>
            {language !== 'en' ? (
              <>
                {tr('The project requires', 'परियोजना हेतु')} <strong>{activeProject?.total_land_required_acres} {tr('acres', 'एकड़')}</strong> {tr('across', 'कुल')} <strong>{activeProject?.total_parcels_count} {tr('land parcels', 'भूमि पार्सलों')}</strong> {tr('land required.', 'भूमि अपेक्षित है।')}{' '}
                {tr('The AI predictive model calculates a', 'एआई पूर्वानुमानात्मक मॉडल के अनुसार')} <strong>{activeProject?.overall_delay_risk_score}% {tr('probability of delay', 'विलंब प्रायिकता')} (+{activeProject?.expected_delay_days} {tr('days', 'दिन')})</strong>,{' '}
                {tr('driven primarily by', 'जिसका मुख्य कारण')} <strong>{activeProject?.stay_orders_count} {tr('judicial stay orders', 'न्यायिक स्थगनादेश')}</strong> {tr('and', 'एवं')}{' '}
                <strong>₹{activeProject?.compensation_pending_cr} {tr('Cr pending compensation.', 'करोड़ का लंबित मुआवजा है।')}</strong>
              </>
            ) : (
              <>
                The project requires <strong>{activeProject?.total_land_required_acres} acres</strong> across <strong>{activeProject?.total_parcels_count} land parcels</strong>. 
                The AI predictive model calculates a <strong>{activeProject?.overall_delay_risk_score}% probability of delay (+{activeProject?.expected_delay_days} days)</strong>, 
                driven primarily by <strong>{activeProject?.stay_orders_count} judicial stay orders</strong> in Rajasthan High Court and 
                <strong> ₹{activeProject?.compensation_pending_cr} Cr pending compensation</strong>.
              </>
            )}
          </p>
        </div>

        {/* Priority Parcels Summary */}
        {includeLand && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              {tr('1. Critical Priority Land Parcels', '1. संवेदनशील प्राथमिकता भूमि पार्सल')}
            </h3>
            <div className="overflow-x-auto touch-scroll">
              <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                <thead className="bg-slate-100 font-semibold border-b">
                  <tr>
                    <th className="p-2">{tr('Parcel / Khasra', 'पार्सल / खसरा')}</th>
                    <th className="p-2">{tr('Village / Tehsil', 'ग्राम / तहसील')}</th>
                    <th className="p-2">{tr('Owner Name', 'खातेदार का नाम')}</th>
                    <th className="p-2">{tr('Risk Score', 'जोखिम स्कोर')}</th>
                    <th className="p-2">{tr('Primary Bottleneck', 'प्राथमिक अड़चन')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {parcels.slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td className="p-2 font-bold font-mono">{p.id} ({p.khasra_survey_no})</td>
                      <td className="p-2">{t(p.village, p.village)}, {t(p.tehsil, p.tehsil)}</td>
                      <td className="p-2">{t(p.owner.name, p.owner.name)}</td>
                      <td className="p-2 font-bold text-red-700">{p.delay_risk_score}% ({t(p.delay_risk_level, p.delay_risk_level)})</td>
                      <td className="p-2 text-[11px]">{t(p.top_risk_factors[0]?.factor_name, p.top_risk_factors[0]?.factor_name || 'Documentation hold')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Queue Summary */}
        {includeActions && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              {tr('2. Priority Administrative Action Queue', '2. प्राथमिकता प्रशासनिक कार्य कतार')}
            </h3>
            <div className="space-y-2 text-xs">
              {actionItems.map(act => (
                <div key={act.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-slate-900 gap-1">
                    <span>{act.id}: {t(act.title, act.title)}</span>
                    <span className="font-mono text-gov-blue">
                      {tr('Due:', 'नियत:')} {act.due_date} ({t(act.status, act.status)})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{t(act.recommended_action, act.recommended_action)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature Block */}
        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-4 text-xs text-slate-700 border-t border-slate-200">
          <div className="text-center w-full sm:w-52 border-t border-slate-600 pt-1">
            <strong>{tr('Special Land Acquisition Officer', 'विशेष भूमि अधिग्रहण अधिकारी')}</strong><br />
            {tr('PIU Jaipur / Ajmer', 'पीआईयू जयपुर / अजमेर')}
          </div>
          <div className="text-center w-full sm:w-52 border-t border-slate-600 pt-1">
            <strong>{tr('District Magistrate & Collector', 'जिला मजिस्ट्रेट एवं कलेक्टर')}</strong><br />
            {tr('Chairperson, District LA Committee', 'अध्यक्ष, जिला भूमि अधिग्रहण समिति')}
          </div>
        </div>

      </div>

    </div>
  );
};
