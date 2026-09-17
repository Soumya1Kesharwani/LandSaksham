import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Bell, Clock } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const SmartAlertsTab: React.FC = () => {
  const { language, tr, t } = useLanguage();
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
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">
              {tr(
                'Real-time Proactive Project Alerts & Notifications',
                'रीयल-टाइम सक्रिय परियोजना अलर्ट एवं सूचनाएं'
              )}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr(
              'Automated alerts triggered by judicial listings, stage timeouts, and compensation discrepancies.',
              'न्यायिक सुनवाई, चरण समयावधि समाप्ति एवं मुआवजा विसंगतियों द्वारा स्वतः ट्रिगर किए गए अलर्ट।'
            )}
          </p>
        </div>

        <button
          onClick={() => setAlertsState(prev => prev.map(a => ({ ...a, is_read: true })))}
          className="self-start sm:self-auto text-xs font-semibold text-gov-blue hover:underline shrink-0"
        >
          {tr('Mark All as Read', 'सभी को पढ़ा हुआ चिह्नित करें')}
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alertsState.map(alert => {
          return (
            <div
              key={alert.id}
              className={`p-3.5 sm:p-4 rounded-lg border transition space-y-2.5 ${
                alert.is_read ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-red-300 shadow-sm ring-1 ring-red-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge level={alert.severity} size="sm" />
                  <span className="font-bold text-xs text-slate-900">{t(alert.title, alert.title)}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {t(alert.department, alert.department)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.created_at.split('T')[0]}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {t(alert.message, alert.message)}
              </p>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {alert.parcel_id ? (
                  <button
                    onClick={() => handleInspect(alert.parcel_id)}
                    className="text-gov-blue font-semibold hover:underline font-mono text-left"
                  >
                    {tr('Inspect Parcel', 'पार्सल का निरीक्षण करें')} {alert.parcel_id} →
                  </button>
                ) : (
                  <span className="text-slate-400">
                    {tr('Master Project Level Alert', 'मास्टर परियोजना स्तरीय चेतावनी')}
                  </span>
                )}

                <button
                  onClick={() => toggleRead(alert.id)}
                  className="text-slate-500 hover:text-slate-800 font-medium text-left sm:text-right"
                >
                  {alert.is_read
                    ? tr('Mark as Unread', 'अपठित चिह्नित करें')
                    : tr('Acknowledge & Mark Read', 'संज्ञान लें एवं पढ़ा हुआ चिह्नित करें')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
