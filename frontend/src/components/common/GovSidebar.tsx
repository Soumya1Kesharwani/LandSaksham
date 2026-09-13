import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, Map, FileSpreadsheet, Landmark, 
  Scale, Trees, Users, Briefcase, GitFork, 
  BrainCircuit, ListTodo, FileText, Bell, 
  History, Download, Sun, Moon, X
} from 'lucide-react';

interface GovSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const GovSidebar: React.FC<GovSidebarProps> = ({ isOpen = true, onClose }) => {
  const { tr, t } = useLanguage();
  const { activeTab, setActiveTab, activeProject, actionItems, alerts } = useProject();
  const { theme, toggleTheme } = useTheme();

  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>(() => {
    return (localStorage.getItem('nliis_font_size') as 'small' | 'normal' | 'large') || 'normal';
  });

  const handleFontSizeChange = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    localStorage.setItem('nliis_font_size', size);
    if (size === 'small') {
      document.documentElement.style.fontSize = '15px';
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '19px';
    } else {
      document.documentElement.style.fontSize = '17px';
    }
  };

  useEffect(() => {
    if (fontSize === 'small') {
      document.documentElement.style.fontSize = '15px';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '19px';
    } else {
      document.documentElement.style.fontSize = '17px';
    }
  }, [fontSize]);

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
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto transition-all duration-300 ease-in-out bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none ${
          isOpen
            ? 'w-64 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full md:translate-x-0 opacity-0 md:opacity-0 overflow-hidden border-none pointer-events-none'
        }`}
      >
        {/* Officer Context Badge */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {tr('Intelligence Console', 'आसूचना नियंत्रण कक्ष')}
            </div>
            <div className="text-xs font-semibold text-white truncate mt-0.5">
              {t(activeProject?.name, activeProject?.name || 'National Infrastructure Grid')}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose && window.innerWidth < 768) {
                    onClose();
                  }
                }}
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

      {/* Font Size Accessibility Controls (A- / A / A+) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <span className="text-xs text-slate-300 font-medium">{tr('Font Size', 'फ़ॉन्ट आकार')}</span>
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md p-0.5 text-xs font-semibold text-slate-200">
          <button
            onClick={() => handleFontSizeChange('small')}
            className={`px-2 py-0.5 rounded transition ${fontSize === 'small' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
            title="Decrease Font Size (A-)"
          >
            A-
          </button>
          <button
            onClick={() => handleFontSizeChange('normal')}
            className={`px-2 py-0.5 rounded transition ${fontSize === 'normal' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
            title="Normal Font Size (A)"
          >
            A
          </button>
          <button
            onClick={() => handleFontSizeChange('large')}
            className={`px-2 py-0.5 rounded transition ${fontSize === 'large' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
            title="Increase Font Size (A+)"
          >
            A+
          </button>
        </div>
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
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-gov-blue' : 'bg-slate-700'
            }`}
          title="Toggle Dark / Light Mode"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
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
  </>
  );
};

