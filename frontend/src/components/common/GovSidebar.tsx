import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { 
  LayoutDashboard, Map, FileSpreadsheet, Landmark, 
  Scale, Trees, Users, Briefcase, GitFork, 
  BrainCircuit, ListTodo, FileText, Bell, 
  History, Download, ChevronRight
} from 'lucide-react';

export const GovSidebar: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, activeProject, actionItems, alerts } = useProject();

  const pendingActionsCount = actionItems.filter(a => a.status !== 'Resolved' && a.status !== 'Closed').length;
  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  const menuItems = [
    { id: 'overview', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'land', label: t('nav.land_intelligence'), icon: FileSpreadsheet, badge: activeProject?.high_risk_parcels_count ? `${activeProject.high_risk_parcels_count} at Risk` : undefined, badgeColor: 'bg-orange-100 text-orange-800' },
    { id: 'gis', label: t('nav.gis_map'), icon: Map },
    { id: 'compensation', label: t('nav.compensation'), icon: Landmark },
    { id: 'legal', label: t('nav.legal_cases'), icon: Scale, badge: activeProject?.stay_orders_count ? `${activeProject.stay_orders_count} Stays` : undefined, badgeColor: 'bg-red-100 text-red-800' },
    { id: 'environment', label: t('nav.environmental'), icon: Trees },
    { id: 'social', label: t('nav.social_impact'), icon: Users },
    { id: 'employment', label: t('nav.employment_economy'), icon: Briefcase },
    { id: 'routes', label: t('nav.route_simulator'), icon: GitFork },
    { id: 'prediction', label: t('nav.ai_delay_prediction'), icon: BrainCircuit },
    { id: 'actions', label: t('nav.action_queue'), icon: ListTodo, badge: pendingActionsCount > 0 ? String(pendingActionsCount) : undefined, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'documents', label: t('nav.document_intelligence'), icon: FileText },
    { id: 'alerts', label: t('nav.smart_alerts'), icon: Bell, badge: unreadAlertsCount > 0 ? String(unreadAlertsCount) : undefined, badgeColor: 'bg-red-100 text-red-800' },
    { id: 'audit', label: t('nav.audit_trail'), icon: History },
    { id: 'reports', label: t('nav.report_generator'), icon: Download }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Officer Context Badge */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Intelligence Console
        </div>
        <div className="text-xs font-semibold text-white truncate mt-0.5">
          {activeProject?.name || 'National Infrastructure Grid'}
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gov-blue text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono shrink-0 ml-1 ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AI Prediction Engine Live</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">v2.4</span>
      </div>
    </aside>
  );
};
