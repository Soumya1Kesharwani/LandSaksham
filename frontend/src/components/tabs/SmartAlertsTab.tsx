import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, Filter, Clock } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const SmartAlertsTab: React.FC = () => {
  const { t } = useLanguage();
  const { alerts, setSelectedParcel, parcels } = useProject();

  const [alertsState, setAlertsState] = useState(alerts);

  const toggleRead = (alertId: string) => {
    setAlertsState(prev => prev.map(a => a.id === alertId ? { ...a, is_read: !a.is_read } : a));
  };

  const handleInspect = (parcelId?: string) => {
    if (!parcelId) return;
    const p = parcels.find(item => item.id === parcelId);
    if (p) setSelectedParcel(p);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900">
              Real-time Proactive Project Alerts & Notifications
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts triggered by judicial listings, stage timeouts, and compensation discrepancies.
          </p>
        </div>

        <button
          onClick={() => setAlertsState(prev => prev.map(a => ({ ...a, is_read: true })))}
          className="text-xs font-semibold text-gov-blue hover:underline"
        >
          Mark All as Read
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alertsState.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition space-y-2.5 ${
                alert.is_read ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-red-300 shadow-sm ring-1 ring-red-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiskBadge level={alert.severity} size="sm" />
                  <span className="font-bold text-xs text-slate-900">{alert.title}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {alert.department}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.created_at.split('T')[0]}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {alert.message}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {alert.parcel_id ? (
                  <button
                    onClick={() => handleInspect(alert.parcel_id)}
                    className="text-gov-blue font-semibold hover:underline font-mono"
                  >
                    Inspect Parcel {alert.parcel_id} →
                  </button>
                ) : (
                  <span className="text-slate-400">Master Project Level Alert</span>
                )}

                <button
                  onClick={() => toggleRead(alert.id)}
                  className="text-slate-500 hover:text-slate-800 font-medium"
                >
                  {alert.is_read ? 'Mark as Unread' : 'Acknowledge & Mark Read'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
