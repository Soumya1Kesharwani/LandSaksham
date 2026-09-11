import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { 
  LayoutDashboard, Map, FileSpreadsheet, Landmark, 
  Scale, Trees, Users, Briefcase, GitFork, 
  BrainCircuit, ListTodo, FileText, Bell, 
  History, Download, Sun, Moon
} from 'lucide-react';

export const GovSidebar: React.FC = () => {
  const { tr, t } = useLanguage();
  const { activeTab, setActiveTab, activeProject, actionItems, alerts } = useProject();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nliis_theme') as 'light' | 'dark';
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('nliis_theme', nextTheme);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleStorage = () => {
      const current = localStorage.getItem('nliis_theme') as 'light' | 'dark';
      if (current && current !== theme) {
        setTheme(current);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [theme]);

  const pendingActionsCount = actionItems.filter(a => a.status !== 'Resolved' && a.status !== 'Closed').length;
  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  const menuItems = [
    { id: 'overview', label: t('nav.overview', 'Project Overview'), icon: LayoutDashboard },
    { 
      id: 'land', 
      label: t('nav.land_parcels', 'Land & Khasra Intelligence'), 
      icon: FileSpreadsheet, 
      badge: activeProject?.high_risk_parcels_count ? `${activeProject.high_risk_parcels_count} ${tr('at Risk', 'जोखिम')}` : undefined, 
      badgeColor: 'bg-orange-100 text-orange-800' 
    },
    { id: 'gis', label: t('nav.gis_map', 'GIS Spatial Map'), icon: Map },
    { id: 'compensation', label: t('nav.compensation', 'RFCTLARR Compensation'), icon: Landmark },
    { 
      id: 'legal', 
      label: t('nav.legal', 'e-Courts Legal Intelligence'), 
      icon: Scale, 
      badge: activeProject?.stay_orders_count ? `${activeProject.stay_orders_count} ${tr('Stays', 'स्थगन')}` : undefined, 
      badgeColor: 'bg-red-100 text-red-800' 
    },
    { id: 'environment', label: t('nav.environmental', 'Parivesh Forest & Env'), icon: Trees },
    { id: 'social', label: t('nav.social', 'SIA & Rehabilitation'), icon: Users },
    { id: 'employment', label: t('nav.employment', 'Employment & Economy'), icon: Briefcase },
    { id: 'routes', label: t('nav.routes', 'Route Alternative Simulator'), icon: GitFork },
    { id: 'prediction', label: t('nav.ai_prediction', 'AI Delay Prediction & SHAP'), icon: BrainCircuit },
    { 
      id: 'actions', 
      label: t('nav.actions', 'Priority Action Queue'), 
      icon: ListTodo, 
      badge: pendingActionsCount > 0 ? String(pendingActionsCount) : undefined, 
      badgeColor: 'bg-blue-100 text-blue-800' 
    },
    { id: 'documents', label: t('nav.documents', 'Document Intelligence & OCR'), icon: FileText },
    { 
      id: 'alerts', 
      label: t('nav.alerts', 'Smart Proactive Alerts'), 
      icon: Bell, 
      badge: unreadAlertsCount > 0 ? String(unreadAlertsCount) : undefined, 
      badgeColor: 'bg-red-100 text-red-800' 
    },
    { id: 'audit', label: t('nav.audit', 'Governance Audit Logs'), icon: History },
    { id: 'reports', label: t('nav.reports', 'Official Dossier Generator'), icon: Download }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Officer Context Badge */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {tr('Intelligence Console', 'आसूचना नियंत्रण कक्ष')}
        </div>
        <div className="text-xs font-semibold text-white truncate mt-0.5">
          {t(activeProject?.name, activeProject?.name || 'National Infrastructure Grid')}
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

      {/* Dark / Light Mode Toggle */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-amber-300" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
          <span>{theme === 'dark' ? tr('Dark Mode', 'डार्क मोड') : tr('Light Mode', 'लाइट मोड')}</span>
        </div>

        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            theme === 'dark' ? 'bg-gov-blue' : 'bg-slate-700'
          }`}
          title="Toggle Dark / Light Mode"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{tr('AI Prediction Engine Live', 'एआई पूर्वानुमान इंजन सक्रिय')}</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">v2.4</span>
      </div>
    </aside>
  );
};

