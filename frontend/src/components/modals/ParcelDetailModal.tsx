import React, { useState } from 'react';
import { Parcel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { useRole } from '../../context/RoleContext';
import { RiskBadge } from '../common/RiskBadge';
import { X, AlertTriangle, CheckCircle2, Send } from 'lucide-react';

interface ParcelDetailModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({ parcel, onClose }) => {
  const { language, tr, t } = useLanguage();
  const { updateLocalActionStatus } = useProject();
  const { role } = useRole();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'compensation' | 'legal' | 'environmental' | 'shap'>('overview');
  const [actionDone, setActionDone] = useState(false);

  const handleResolveAction = () => {
    setActionDone(true);
    updateLocalActionStatus('ACT-001', 'In Progress');
    setTimeout(() => {
      setActionDone(false);
    }, 2500);
  };

  const tabs = [
    { id: 'overview', label: tr('Parcel Overview', 'पार्सल अवलोकन') },
    { id: 'shap', label: tr('AI Risk Factors (SHAP)', 'एआई जोखिम कारक (SHAP)') },
    { id: 'compensation', label: tr('RFCTLARR Compensation', 'RFCTLARR मुआवजा') },
    { id: 'legal', label: tr('e-Courts Legal Dossier', 'ई-कोर्ट्स विधिक डोजियर') },
    { id: 'environmental', label: tr('Forest & Environment', 'वन एवं पर्यावरण') }
  ];

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-gov-blue text-white font-mono font-bold text-sm">
              {parcel.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">
                  {tr('Khasra No.', 'खसरा संख्या')} {parcel.khasra_survey_no} • {t(parcel.village, parcel.village)}, {t(parcel.tehsil, parcel.tehsil)}
                </h2>
                <RiskBadge level={parcel.delay_risk_level} score={parcel.delay_risk_score} showScore />
              </div>
              <p className="text-xs text-slate-400">
                {t(parcel.district, parcel.district)}, {t(parcel.state, parcel.state)} • {t(parcel.land_type, parcel.land_type)} ({parcel.area_acres} {tr('Acres', 'एकड़')})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-gov-blue text-gov-blue font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* OVERVIEW TAB */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              {/* Landowner Card */}
              <div className="bg-slate-50 dark:bg-[#0d162d] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
                <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-gov-navy dark:text-blue-300">
                    {tr('Recorded Landowner Information (Jamabandi RoR)', 'पंजीकृत खातेदार विवरण (जमाबंदी प्रति)')}
                  </span>
                  <span className="text-gov-blue dark:text-blue-400 font-mono font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-[11px]">
                    Khasra No: {parcel.khasra_survey_no} • ID: {parcel.owner.id}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-md">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{tr('Primary Owner Name', 'मुख्य खातेदार का नाम')}</span>
                    <strong className="text-slate-900 dark:text-white text-sm block mt-0.5">{t(parcel.owner.name, parcel.owner.name)}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-md">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{tr('Parentage / Relation', 'पिता/पति का नाम')}</span>
                    <span className="text-slate-800 dark:text-slate-200 block mt-0.5 font-medium">{t(parcel.owner.relation, parcel.owner.relation)} {t(parcel.owner.father_or_spouse_name, parcel.owner.father_or_spouse_name)}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-md">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{tr('Share Ownership', 'स्वामित्व हिस्सा')}</span>
                    <span className="text-slate-800 dark:text-slate-200 block mt-0.5 font-semibold font-mono">{parcel.owner.share_percentage}% ({parcel.co_owners_count} {tr('Co-heirs', 'सह-खातेदार')})</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-md">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{tr('Aadhaar / Bank Verification', 'आधार / बैंक खाता सत्यापन')}</span>
                    <span className={`inline-flex items-center gap-1 font-semibold text-xs mt-0.5 ${parcel.owner.bank_account_verified ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {parcel.owner.bank_account_verified 
                        ? tr('Aadhaar & Bank Verified', 'आधार एवं बैंक खाता सत्यापित') 
                        : tr('Aadhaar Seeded / Bank Mismatch', 'आधार लिंक / बैंक खाता बेमेल')}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-md">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{tr('Revenue Mutation Status', 'राजस्व नामांतरण स्थिति')}</span>
                    <span className="text-slate-800 dark:text-slate-200 block mt-0.5 font-medium">{t(parcel.mutation_status, parcel.mutation_status)}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-md">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{tr('Physical Possession', 'भौतिक कब्जा')}</span>
                    <span className="text-slate-800 dark:text-slate-200 block mt-0.5 font-bold font-mono text-sm">{parcel.possession_percentage}% {tr('Taken', 'अधिग्रहीत')}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action Callout */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-950 text-sm">
                        {tr('Recommended Administrative Intervention', 'अनुशंसित प्रशासनिक हस्तक्षेप')} ({t(parcel.recommended_action_priority, parcel.recommended_action_priority)} {tr('Priority', 'प्राथमिकता')})
                      </h4>
                      <p className="text-amber-900 mt-1 leading-relaxed">
                        {t(parcel.recommended_action, parcel.recommended_action)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-amber-200/60 pt-2.5">
                  <span className="text-[11px] text-amber-800">
                    {tr('Expected delay reduction if resolved:', 'समाधान होने पर संभावित विलंब में कमी:')} <strong>~{parcel.expected_delay_days} {tr('days', 'दिन')}</strong>
                  </span>
                  <button
                    onClick={handleResolveAction}
                    className="bg-gov-navy hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {actionDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{tr('Action Assigned to Tehsildar & LAO', 'तहसीलदार एवं एलएओ को कार्य सौंपा गया')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{tr('Assign Task to Revenue / LAO', 'राजस्व / एलएओ को कार्य सौंपें')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SHAP EXPLAINABILITY TAB */}
          {activeSubTab === 'shap' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg">
                <h4 className="font-bold text-gov-navy text-xs uppercase tracking-wide">
                  {tr('Explainable AI Feature Attributions (SHAP Delay Decomposition)', 'व्याख्यात्मक एआई कारक एट्रिब्यूशन (SHAP विलंब विश्लेषण)')}
                </h4>
                <p className="text-slate-600 mt-1">
                  {language !== 'en' ? (
                    <>{tr('Why is Parcel', 'पार्सल')} <strong>{parcel.id}</strong> {tr('predicted at', 'पर')} <strong>{parcel.delay_risk_score}% {tr('delay risk', 'विलंब जोखिम')}</strong> {tr('with an estimated delay of', 'तथा')} <strong>{parcel.expected_delay_days} {tr('days', 'दिनों का अनुमानित विलंब')}</strong>{tr('?', '?')}</>
                  ) : (
                    <>Why is Parcel <strong>{parcel.id}</strong> predicted at <strong>{parcel.delay_risk_score}% delay risk</strong> with an estimated delay of <strong>{parcel.expected_delay_days} days</strong>?</>
                  )}
                </p>
              </div>

              <div className="space-y-2.5">
                {parcel.top_risk_factors.map((rf, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 text-xs">{t(rf.factor_name, rf.factor_name)}</span>
                      <span className="font-mono text-xs font-bold text-red-700">
                        +{(rf.importance_score * 100).toFixed(0)}% {tr('contribution', 'योगदान')} (+{rf.impact_days} {tr('days', 'दिन')})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, rf.importance_score * 150)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{t(rf.description, rf.description)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPENSATION TAB */}
          {activeSubTab === 'compensation' && parcel.compensation && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">
                    {tr('Total Statutory Compensation', 'कुल वैधानिक मुआवजा')}
                  </span>
                  <strong className="text-base text-slate-900 font-mono">
                    ₹{(parcel.compensation.total_estimated_compensation_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                  </strong>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="text-[11px] text-emerald-800 block">
                    {tr('Disbursed to Landowner', 'खातेदार को संवितरित')}
                  </span>
                  <strong className="text-base text-emerald-900 font-mono">
                    ₹{(parcel.compensation.amount_disbursed_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')} ({parcel.compensation.disbursement_percentage.toFixed(1)}%)
                  </strong>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <span className="text-[11px] text-red-800 block">
                    {tr('Pending / Escrowed Sum', 'शेष / एस्क्रो राशि')}
                  </span>
                  <strong className="text-base text-red-900 font-mono">
                    ₹{(parcel.compensation.amount_pending_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                  </strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">{tr('Statutory Component (RFCTLARR Act 2013)', 'वैधानिक घटक (RFCTLARR अधिनियम 2013)')}</th>
                      <th className="p-2.5 border-b text-right">{tr('Computed Amount (INR)', 'संगणित राशि (₹)')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-2.5 font-sans">{tr('Base Land Market Value', 'आधार भूमि बाजार मूल्य')} ({tr('Factor', 'गुणांक')} {parcel.compensation.multiplier_factor}x)</td>
                      <td className="p-2.5 text-right">₹{parcel.compensation.base_land_value_inr.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">{tr('100% Solatium (Mandatory 100% grant under Section 30)', '100% तोषण (धारा 30 के अंतर्गत अनिवार्य 100% अनुदान)')}</td>
                      <td className="p-2.5 text-right font-semibold">₹{parcel.compensation.solatium_100_pct_inr.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">{tr('12% Additional Interest from Section 4 date', 'धारा 4 की तिथि से 12% अतिरिक्त ब्याज')}</td>
                      <td className="p-2.5 text-right">₹{parcel.compensation.additional_interest_12_pct_inr.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">{tr('Crop, Tree & Structure Damages Valuation', 'फसल, वृक्ष एवं संरचना क्षति मूल्यांकन')}</td>
                      <td className="p-2.5 text-right">₹{(parcel.compensation.crop_compensation_inr + parcel.compensation.structure_compensation_inr + parcel.compensation.tree_compensation_inr).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">{tr('Rehabilitation & Resettlement Grant', 'पुनर्वास एवं पुनर्व्यवस्थापन अनुदान')}</td>
                      <td className="p-2.5 text-right">₹{parcel.compensation.rehabilitation_resettlement_grant_inr.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LEGAL TAB */}
          {activeSubTab === 'legal' && (
            <div className="space-y-4">
              {parcel.legal_case ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-sm text-gov-navy">{parcel.legal_case.case_number}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
                      {t(parcel.legal_case.status, parcel.legal_case.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{tr('Court Name', 'न्यायालय का नाम')}</span>
                      <strong>{t(parcel.legal_case.court_name, parcel.legal_case.court_name)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{tr('Case Typology', 'वाद का प्रकार')}</span>
                      <span>{t(parcel.legal_case.case_type, parcel.legal_case.case_type)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{tr('Petitioner vs Respondent', 'याचिकाकर्ता बनाम प्रतिवादी')}</span>
                      <span>{t(parcel.legal_case.petitioner, parcel.legal_case.petitioner)} {tr('vs', 'बनाम')} {t(parcel.legal_case.respondent, parcel.legal_case.respondent)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{tr('Next Listed Hearing', 'आगामी सुनवाई तिथि')}</span>
                      <strong className="text-gov-blue">{parcel.legal_case.next_hearing_date}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900">
                    <strong>{tr('Last Judicial Order Summary:', 'अंतिम न्यायिक आदेश का सारांश:')}</strong>
                    <p className="mt-0.5">{t(parcel.legal_case.last_order_summary, parcel.legal_case.last_order_summary)}</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gov-navy">
                    <strong>{tr('AI Legal Counsel Recommendation:', 'एआई विधिक परामर्श अनुशंसा:')}</strong>
                    <p className="mt-0.5 whitespace-pre-line">{t(parcel.legal_case.recommended_legal_action, parcel.legal_case.recommended_legal_action)}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
                  {tr(
                    'No active civil court petitions or tribunal stays pending on this parcel.',
                    'इस पार्सल पर कोई दीवानी वाद अथवा अधिकरण स्थगनादेश लंबित नहीं है।'
                  )}
                </div>
              )}
            </div>
          )}

          {/* ENVIRONMENTAL TAB */}
          {activeSubTab === 'environmental' && parcel.environmental && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">{tr('Forest Overlap', 'वन भूमि व्याप्ति')}</span>
                  <strong>
                    {parcel.environmental.overlaps_forest
                      ? `${tr('Yes', 'हाँ')} (${parcel.environmental.forest_diversion_area_ha} ${tr('ha', 'हेक्टेयर')})`
                      : tr('Non-Forest Land', 'गैर-वन भूमि')}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">{tr('Eco-Sensitive Zone Proximity', 'पर्यावरण-संवेदनशील क्षेत्र निकटता')}</span>
                  <strong>
                    {parcel.environmental.in_eco_sensitive_zone
                      ? tr('Inside ESZ Buffer', 'ईएसजेड बफर के अंदर')
                      : `${parcel.environmental.wildlife_corridor_proximity_km} ${tr('km away', 'किमी दूर')}`}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">{tr('MoEFCC Parivesh Stage', 'पर्यावरण मंत्रालय परिवेश चरण')}</span>
                  <strong className="text-gov-blue">{parcel.environmental.statutory_clearance_stage}</strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">{tr('Clearance Inactivity', 'अनापत्ति निष्क्रियता')}</span>
                  <strong className="text-red-700">{parcel.environmental.clearance_days_pending} {tr('Days Pending', 'दिन से लंबित')}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {tr('Last verified with Revenue & e-Courts database:', 'राजस्व एवं ई-कोर्ट्स डेटाबेस से अंतिम सत्यापन:')} <strong>{parcel.last_updated}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 text-white font-semibold hover:bg-slate-900 transition"
          >
            {t('common.close', 'बंद करें')}
          </button>
        </div>

      </div>
    </div>
  );
};
