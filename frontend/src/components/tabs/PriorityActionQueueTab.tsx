import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { useRole } from '../../context/RoleContext';
import { ListTodo } from 'lucide-react';

export const PriorityActionQueueTab: React.FC = () => {
  const { language, tr, t } = useLanguage();
  const { actionItems, updateLocalActionStatus, setSelectedParcel, parcels } = useProject();
  const { role } = useRole();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredActions = actionItems.filter(act => {
    if (statusFilter !== 'ALL' && act.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && act.risk_level !== priorityFilter) return false;
    return true;
  });

  const handleStatusChange = (actionId: string, newStatus: string) => {
    updateLocalActionStatus(actionId, newStatus);
  };

  const handleInspectParcel = (parcelId?: string) => {
    if (!parcelId) return;
    const p = parcels.find(item => item.id === parcelId);
    if (p) setSelectedParcel(p);
  };

  const getPriorityLabel = (risk: string) => {
    if (risk === 'CRITICAL') return tr('CRITICAL', 'अति गंभीर');
    if (risk === 'HIGH') return tr('HIGH', 'उच्च');
    if (risk === 'MEDIUM') return tr('MEDIUM', 'मध्यम');
    return tr('LOW', 'न्यून');
  };

  const getStatusLabel = (status: string) => {
    if (status === 'New') return tr('New', 'नया');
    if (status === 'Under Review') return tr('Under Review', 'समीक्षाधीन');
    if (status === 'Action Required') return tr('Action Required', 'कार्रवाई अपेक्षित');
    if (status === 'In Progress') return tr('In Progress', 'प्रगति पर');
    if (status === 'Resolved') return tr('Resolved', 'समाधानित (पूर्ण)');
    if (status === 'Closed') return tr('Closed', 'बंद');
    return tr(status, status);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-gov-blue shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {tr(
                'Officer Priority Action Queue & Resolution Workflow',
                'अधिकारी प्राथमिकता कार्य कतार एवं समाधान कार्यप्रवाह'
              )}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr(
              'AI-generated administrative action tasks ranked by delay impact days.',
              'विलंब प्रभाव दिनों के अनुसार क्रमबद्ध एआई-जनित प्रशासनिक कार्य।'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium text-xs text-slate-800 flex-1 sm:flex-none"
          >
            <option value="ALL">{tr('All Priorities', 'सभी प्राथमिकताएं')}</option>
            <option value="CRITICAL">{tr('Critical Priority', 'अति-गंभीर प्राथमिकता')}</option>
            <option value="HIGH">{tr('High Priority', 'उच्च प्राथमिकता')}</option>
            <option value="MEDIUM">{tr('Medium Priority', 'मध्यम प्राथमिकता')}</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium text-xs text-slate-800 flex-1 sm:flex-none"
          >
            <option value="ALL">{tr('All Statuses', 'सभी स्थितियां')}</option>
            <option value="New">{tr('New', 'नया')}</option>
            <option value="In Progress">{tr('In Progress', 'प्रगति पर')}</option>
            <option value="Action Required">{tr('Action Required', 'कार्रवाई अपेक्षित')}</option>
            <option value="Resolved">{tr('Resolved', 'समाधानित')}</option>
          </select>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredActions.map(action => {
          const isCritical = action.risk_level === 'CRITICAL';
          const isResolved = action.status === 'Resolved' || action.status === 'Closed';

          return (
            <div
              key={action.id}
              className={`bg-white border rounded-lg p-3.5 sm:p-4 shadow-sm transition space-y-3 ${
                isResolved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : (isCritical ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200')
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-300">
                    {action.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    action.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300' : (action.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-amber-100 text-amber-800 border-amber-300')
                  }`}>
                    {getPriorityLabel(action.risk_level)} {tr('Priority', 'प्राथमिकता')}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {t(action.title, action.title)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-500 font-normal">{tr('Target:', 'लक्ष्य:')}</span>
                  {action.parcel_id ? (
                    <button
                      onClick={() => handleInspectParcel(action.parcel_id)}
                      className="text-gov-blue hover:underline font-mono"
                    >
                      {action.parcel_id} ({tr('Khasra', 'खसरा')} {action.khasra_no})
                    </button>
                  ) : (
                    <span className="text-slate-700">{tr('General Alignment', 'सामान्य संरेखन')}</span>
                  )}
                </div>
              </div>

              {/* Problem & Recommended Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="md:col-span-2 space-y-1">
                  <div className="text-slate-500 text-[11px]">
                    <strong>{tr('Problem Summary:', 'समस्या सारांश:')}</strong> {t(action.problem_summary, action.problem_summary)}
                  </div>
                  <div className="text-gov-navy bg-slate-50 p-2.5 rounded border border-slate-200 whitespace-pre-line leading-relaxed">
                    <strong>{tr('Recommended Action Plan:', 'अनुशंसित कार्य योजना:')}</strong><br />
                    {action.recommended_action
                      ? (t(action.recommended_action) !== action.recommended_action
                          ? t(action.recommended_action)
                          : action.recommended_action.split('\n').map(line => t(line.trim(), line.trim())).join('\n'))
                      : ''}
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{tr('Responsible Department', 'उत्तरदायी विभाग')}</span>
                    <strong className="text-slate-800">{t(action.responsible_department, action.responsible_department)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{tr('Assigned Role', 'नामित पद')}</span>
                    <span className="text-slate-700">{t(action.assigned_to_role, action.assigned_to_role)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{tr('Resolution Target Due Date', 'समाधान नियत तिथि')}</span>
                    <strong className="text-gov-blue font-mono">{action.due_date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{tr('Delay Impact if Unresolved', 'अनसुलझे रहने पर विलंब प्रभाव')}</span>
                    <strong className="text-red-700 font-mono">+{action.impact_delay_days} {tr('Days Delay', 'दिन विलंब')}</strong>
                  </div>
                </div>
              </div>

              {/* Status Selector Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {tr('Logged by NLIIS Predictive Engine • Last Updated:', 'NLIIS पूर्वानुमान इंजन द्वारा दर्ज • अंतिम अद्यतन:')} {action.updated_at.split('T')[0]}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-semibold">{tr('Workflow Status:', 'कार्यप्रवाह स्थिति:')}</span>
                  <select
                    value={action.status}
                    onChange={e => handleStatusChange(action.id, e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold bg-white text-slate-800 focus:ring-1 focus:ring-gov-blue outline-none"
                  >
                    <option value="New">{tr('New', 'नया')}</option>
                    <option value="Under Review">{tr('Under Review', 'समीक्षाधीन')}</option>
                    <option value="Action Required">{tr('Action Required', 'कार्रवाई अपेक्षित')}</option>
                    <option value="In Progress">{tr('In Progress', 'प्रगति पर')}</option>
                    <option value="Resolved">{tr('Resolved (Completed)', 'समाधानित (पूर्ण)')}</option>
                    <option value="Closed">{tr('Closed', 'बंद')}</option>
                  </select>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
