import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { History, Shield, CheckCircle2, User } from 'lucide-react';

export const AuditLogsTab: React.FC = () => {
  const { t } = useLanguage();
  const { auditLogs } = useProject();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gov-navy" />
            <h2 className="text-base font-bold text-slate-900">
              Immutable Governance Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped record of all officer modifications, status updates, and compensation adjustments.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
          <Shield className="w-4 h-4" />
          <span>Audit Log Integrity Active</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-slate-100 text-slate-700 font-sans font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Log ID & Timestamp</th>
                <th className="p-3">Authorized Officer</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Target Entity & ID</th>
                <th className="p-3">Value Transition (Before → After)</th>
                <th className="p-3 text-right">Network IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    <div className="font-bold text-gov-navy">{log.id}</div>
                    <div className="text-[11px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="p-3 font-sans text-slate-800">
                    <div className="font-semibold">{log.user_name}</div>
                    <div className="text-[11px] text-slate-500">{log.user_role}</div>
                  </td>
                  <td className="p-3 font-sans">
                    <span className="bg-blue-50 text-gov-blue px-2 py-0.5 rounded border border-blue-200 font-semibold text-[11px]">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">
                    <div className="font-semibold text-slate-900">{log.target_entity}</div>
                    <div className="text-[11px] text-slate-500">{log.target_id}</div>
                  </td>
                  <td className="p-3 font-sans text-slate-700 max-w-xs">
                    {log.previous_value && (
                      <div className="text-[11px] text-slate-400 line-through">
                        {log.previous_value}
                      </div>
                    )}
                    <div className="text-xs font-semibold text-emerald-800">
                      → {log.new_value}
                    </div>
                  </td>
                  <td className="p-3 text-right text-slate-400 text-[11px]">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
