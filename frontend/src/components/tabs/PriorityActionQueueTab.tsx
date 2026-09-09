import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { useRole } from '../../context/RoleContext';
import { ActionItem, RiskLevel } from '../../types';
import { ListTodo, CheckCircle2, Clock, AlertTriangle, Send, Filter } from 'lucide-react';

export const PriorityActionQueueTab: React.FC = () => {
  const { t } = useLanguage();
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-gov-blue" />
            <h2 className="text-base font-bold text-slate-900">
              Officer Priority Action Queue & Resolution Workflow
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-generated administrative action tasks ranked by delay impact days.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Action Required">Action Required</option>
            <option value="Resolved">Resolved</option>
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
              className={`bg-white border rounded-lg p-4 shadow-sm transition space-y-3 ${
                isResolved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : (isCritical ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200')
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-300">
                    {action.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    action.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300' : (action.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-amber-100 text-amber-800 border-amber-300')
                  }`}>
                    {action.risk_level} Priority
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {action.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-500 font-normal">Target:</span>
                  {action.parcel_id ? (
                    <button
                      onClick={() => handleInspectParcel(action.parcel_id)}
                      className="text-gov-blue hover:underline font-mono"
                    >
                      {action.parcel_id} (Khasra {action.khasra_no})
                    </button>
                  ) : (
                    <span className="text-slate-700">General Alignment</span>
                  )}
                </div>
              </div>

              {/* Problem & Recommended Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="md:col-span-2 space-y-1">
                  <div className="text-slate-500 text-[11px]">
                    <strong>Problem Summary:</strong> {action.problem_summary}
                  </div>
                  <div className="text-gov-navy bg-slate-50 p-2.5 rounded border border-slate-200 whitespace-pre-line leading-relaxed">
                    <strong>Recommended Action Plan:</strong><br />
                    {action.recommended_action}
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Responsible Department</span>
                    <strong className="text-slate-800">{action.responsible_department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Role</span>
                    <span className="text-slate-700">{action.assigned_to_role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Resolution Target Due Date</span>
                    <strong className="text-gov-blue font-mono">{action.due_date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delay Impact if Unresolved</span>
                    <strong className="text-red-700 font-mono">+{action.impact_delay_days} Days Delay</strong>
                  </div>
                </div>
              </div>

              {/* Status Selector Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Logged by NLIIS Predictive Engine • Last Updated: {action.updated_at.split('T')[0]}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-semibold">Workflow Status:</span>
                  <select
                    value={action.status}
                    onChange={e => handleStatusChange(action.id, e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold bg-white text-slate-800 focus:ring-1 focus:ring-gov-blue outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Action Required">Action Required</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved (Completed)</option>
                    <option value="Closed">Closed</option>
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
