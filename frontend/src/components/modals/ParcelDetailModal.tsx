import React, { useState } from 'react';
import { Parcel, RiskLevel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { useRole } from '../../context/RoleContext';
import { RiskBadge } from '../common/RiskBadge';
import { 
  X, AlertTriangle, ShieldCheck, Landmark, Scale, 
  Trees, Users, FileText, CheckCircle2, Clock, Send
} from 'lucide-react';

interface ParcelDetailModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({ parcel, onClose }) => {
  const { t } = useLanguage();
  const { updateLocalActionStatus, refreshData } = useProject();
  const { role } = useRole();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'compensation' | 'legal' | 'environmental' | 'shap'>('overview');
  const [actionDone, setActionDone] = useState(false);

  const handleResolveAction = () => {
    setActionDone(true);
    // Trigger action resolution
    updateLocalActionStatus('ACT-001', 'In Progress');
    setTimeout(() => {
      setActionDone(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
                  Khasra No. {parcel.khasra_survey_no} • {parcel.village}, {parcel.tehsil}
                </h2>
                <RiskBadge level={parcel.delay_risk_level} score={parcel.delay_risk_score} showScore />
              </div>
              <p className="text-xs text-slate-400">
                {parcel.district}, {parcel.state} • {parcel.land_type} ({parcel.area_acres} Acres)
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Parcel Overview' },
            { id: 'shap', label: 'AI Risk Factors (SHAP)' },
            { id: 'compensation', label: 'RFCTLARR Compensation' },
            { id: 'legal', label: 'e-Courts Legal Dossier' },
            { id: 'environmental', label: 'Forest & Environment' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition ${
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
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                  <span>Recorded Landowner Information (Jamabandi RoR)</span>
                  <span className="text-gov-blue font-mono font-normal">ID: {parcel.owner.id}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Owner Name</span>
                    <strong className="text-slate-900 text-sm">{parcel.owner.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Parentage / Relation</span>
                    <span className="text-slate-800">{parcel.owner.relation} {parcel.owner.father_or_spouse_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Share Ownership</span>
                    <span className="text-slate-800 font-semibold">{parcel.owner.share_percentage}% ({parcel.co_owners_count} Co-heirs)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Aadhaar / Bank Verification</span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${parcel.owner.bank_account_verified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {parcel.owner.bank_account_verified ? 'Aadhaar & Bank Verified' : 'Aadhaar Seeded / Bank Mismatch'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Revenue Mutation Status</span>
                    <span className="text-slate-800 font-medium">{parcel.mutation_status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Physical Possession</span>
                    <span className="text-slate-800 font-bold font-mono">{parcel.possession_percentage}% Taken</span>
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
                        Recommended Administrative Intervention ({parcel.recommended_action_priority} Priority)
                      </h4>
                      <p className="text-amber-900 mt-1 leading-relaxed">
                        {parcel.recommended_action}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-amber-200/60 pt-2.5">
                  <span className="text-[11px] text-amber-800">
                    Expected delay reduction if resolved: <strong>~{parcel.expected_delay_days} days</strong>
                  </span>
                  <button
                    onClick={handleResolveAction}
                    className="bg-gov-navy hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {actionDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Action Assigned to Tehsildar & LAO</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Assign Task to Revenue / LAO</span>
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
                  Explainable AI Feature Attributions (SHAP Delay Decomposition)
                </h4>
                <p className="text-slate-600 mt-1">
                  Why is Parcel {parcel.id} predicted at <strong>{parcel.delay_risk_score}% delay risk</strong> with an estimated delay of <strong>{parcel.expected_delay_days} days</strong>?
                </p>
              </div>

              <div className="space-y-2.5">
                {parcel.top_risk_factors.map((rf, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 text-xs">{rf.factor_name}</span>
                      <span className="font-mono text-xs font-bold text-red-700">
                        +{(rf.importance_score * 100).toFixed(0)}% contribution (+{rf.impact_days} days)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, rf.importance_score * 150)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{rf.description}</p>
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
                  <span className="text-[11px] text-slate-500 block">Total Statutory Compensation</span>
                  <strong className="text-base text-slate-900 font-mono">
                    ₹{(parcel.compensation.total_estimated_compensation_inr / 100000).toFixed(2)} Lakh
                  </strong>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="text-[11px] text-emerald-800 block">Disbursed to Landowner</span>
                  <strong className="text-base text-emerald-900 font-mono">
                    ₹{(parcel.compensation.amount_disbursed_inr / 100000).toFixed(2)} Lakh ({parcel.compensation.disbursement_percentage.toFixed(1)}%)
                  </strong>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <span className="text-[11px] text-red-800 block">Pending / Escrowed Sum</span>
                  <strong className="text-base text-red-900 font-mono">
                    ₹{(parcel.compensation.amount_pending_inr / 100000).toFixed(2)} Lakh
                  </strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Statutory Component (RFCTLARR Act 2013)</th>
                      <th className="p-2.5 border-b text-right">Computed Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-2.5 font-sans">Base Land Market Value (Factor {parcel.compensation.multiplier_factor}x)</td>
                      <td className="p-2.5 text-right">₹{parcel.compensation.base_land_value_inr.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">100% Solatium (Mandatory 100% grant under Section 30)</td>
                      <td className="p-2.5 text-right font-semibold">₹{parcel.compensation.solatium_100_pct_inr.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">12% Additional Interest from Section 4 date</td>
                      <td className="p-2.5 text-right">₹{parcel.compensation.additional_interest_12_pct_inr.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">Crop, Tree & Structure Damages Valuation</td>
                      <td className="p-2.5 text-right">₹{(parcel.compensation.crop_compensation_inr + parcel.compensation.structure_compensation_inr + parcel.compensation.tree_compensation_inr).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans">Rehabilitation & Resettlement Grant</td>
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
                      {parcel.legal_case.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Court Name</span>
                      <strong>{parcel.legal_case.court_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Case Typology</span>
                      <span>{parcel.legal_case.case_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Petitioner vs Respondent</span>
                      <span>{parcel.legal_case.petitioner} vs {parcel.legal_case.respondent}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Next Listed Hearing</span>
                      <strong className="text-gov-blue">{parcel.legal_case.next_hearing_date}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900">
                    <strong>Last Judicial Order Summary:</strong>
                    <p className="mt-0.5">{parcel.legal_case.last_order_summary}</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gov-navy">
                    <strong>AI Legal Counsel Recommendation:</strong>
                    <p className="mt-0.5 whitespace-pre-line">{parcel.legal_case.recommended_legal_action}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
                  No active civil court petitions or tribunal stays pending on this parcel.
                </div>
              )}
            </div>
          )}

          {/* ENVIRONMENTAL TAB */}
          {activeSubTab === 'environmental' && parcel.environmental && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">Forest Overlap</span>
                  <strong>{parcel.environmental.overlaps_forest ? `Yes (${parcel.environmental.forest_diversion_area_ha} ha)` : 'Non-Forest Land'}</strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">Eco-Sensitive Zone Proximity</span>
                  <strong>{parcel.environmental.in_eco_sensitive_zone ? 'Inside ESZ Buffer' : `${parcel.environmental.wildlife_corridor_proximity_km} km away`}</strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">MoEFCC Parivesh Stage</span>
                  <strong className="text-gov-blue">{parcel.environmental.statutory_clearance_stage}</strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 block">Clearance Inactivity</span>
                  <strong className="text-red-700">{parcel.environmental.clearance_days_pending} Days Pending</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Last verified with Revenue & e-Courts database: <strong>{parcel.last_updated}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 text-white font-semibold hover:bg-slate-900 transition"
          >
            {t('common.close')}
          </button>
        </div>

      </div>
    </div>
  );
};
