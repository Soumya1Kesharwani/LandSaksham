import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, Map, FileSpreadsheet, Landmark, 
  Scale, Trees, Users, Briefcase, GitFork, 
  BrainCircuit, ListTodo, FileText, Bell, 
  History, Download, Sun, Moon, X, Globe,
  ChevronDown, ChevronRight
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

  // Mobile accordion state for 5 categories (auto-expand category if active tab is inside)
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
    land: true,
    maps: true,
    legal: false,
    ai: false,
    gov: false
  });

  const toggleCategory = (catKey: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

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
    {
      id: 'cesium3d',
      label: tr('Cesium 3D Globe (India)', 'सीज़ियम 3D ग्लोब (भारत)'),
      icon: Globe,
      badge: tr('Aerial 3D', 'एरियल 3D'),
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300'
    },
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
      badgeColor: 'bg-red-100 text-red-800'
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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto transition-all duration-300 ease-in-out bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none ${
          isOpen
            ? 'w-64 max-w-[85vw] translate-x-0 opacity-100 shadow-2xl'
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

        {/* Nav List - Dual Mode: 5-Category Grouped on Phone (Mobile), Flat on Desktop */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2">
          
          {/* DESKTOP VIEW (md: and above) - Flat List */}
          <div className="hidden md:block space-y-0.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
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

          {/* PHONE / MOBILE VIEW (strictly under 768px) - 5 Clean Dropdown Categories */}
          <div className="block md:hidden space-y-2 pb-6">
            
            {/* Top Level: Project Overview */}
            <button
              onClick={() => {
                setActiveTab('overview');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === 'overview'
                  ? 'bg-gov-blue text-white border-blue-500 shadow-md'
                  : 'bg-slate-950/50 text-slate-200 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-white' : 'text-cyan-400'}`} />
                <span className="truncate">{t('nav.overview', 'Project Overview')}</span>
              </div>
            </button>

            {/* Land Acquisition Dropdown */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleCategory('land')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate whitespace-nowrap">{tr('Land Acquisition', 'भूमि अधिग्रहण')}</span>
                </div>
                {openCategories.land ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                )}
              </button>

              {openCategories.land && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-800/50 bg-slate-900/30">
                  <button
                    onClick={() => {
                      setActiveTab('land');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'land'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.land_parcels', 'Land & Khasra Intelligence')}</span>
                    {activeProject?.high_risk_parcels_count ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/60 shrink-0 ml-1">
                        {activeProject.high_risk_parcels_count} {tr('at Risk', 'जोखिम')}
                      </span>
                    ) : null}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('compensation');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'compensation'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.compensation', 'RFCTLARR Compensation')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Maps & Spatial Intelligence Dropdown */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleCategory('maps')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate whitespace-nowrap">{tr('Maps & Spatial Intelligence', 'मानचित्र एवं स्थानिक आसूचना')}</span>
                </div>
                {openCategories.maps ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                )}
              </button>

              {openCategories.maps && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-800/50 bg-slate-900/30">
                  <button
                    onClick={() => {
                      setActiveTab('gis');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'gis'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.gis_map', 'GIS Project Map')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('routes');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'routes'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.routes', 'Route Simulator')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Legal, Environment & Social Dropdown */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleCategory('legal')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Scale className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate whitespace-nowrap">{tr('Legal, Environment & Social', 'विधिक, पर्यावरण एवं सामाजिक')}</span>
                </div>
                {openCategories.legal ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                )}
              </button>

              {openCategories.legal && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-800/50 bg-slate-900/30">
                  <button
                    onClick={() => {
                      setActiveTab('legal');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'legal'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.legal', 'e-Courts Legal Intelligence')}</span>
                    {activeProject?.stay_orders_count ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/60 shrink-0 ml-1">
                        {activeProject.stay_orders_count} {tr('Stays', 'स्थगन')}
                      </span>
                    ) : null}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('environment');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'environment'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.environmental', 'Environment & Forest')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('social');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'social'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.social', 'SIA & Rehabilitation')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI & Decision Intelligence Dropdown */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleCategory('ai')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <BrainCircuit className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate whitespace-nowrap">{tr('AI & Decision Intelligence', 'एआई एवं निर्णय आसूचना')}</span>
                </div>
                {openCategories.ai ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                )}
              </button>

              {openCategories.ai && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-800/50 bg-slate-900/30">
                  <button
                    onClick={() => {
                      setActiveTab('prediction');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'prediction'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.ai_prediction', 'AI Delay Prediction')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('actions');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'actions'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.actions', 'Priority Action Queue')}</span>
                    {pendingActionsCount > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/60 shrink-0 ml-1">
                        {pendingActionsCount}
                      </span>
                    ) : null}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'alerts'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.alerts', 'Smart Proactive Alerts')}</span>
                    {unreadAlertsCount > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/60 shrink-0 ml-1">
                        {unreadAlertsCount}
                      </span>
                    ) : null}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('employment');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'employment'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.employment', 'Employment & Economy')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Governance & Documents Dropdown */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleCategory('gov')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate whitespace-nowrap">{tr('Governance & Documents', 'शासन एवं दस्तावेज़')}</span>
                </div>
                {openCategories.gov ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                )}
              </button>

              {openCategories.gov && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-800/50 bg-slate-900/30">
                  <button
                    onClick={() => {
                      setActiveTab('documents');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'documents'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.documents', 'Document Intelligence & OCR')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('audit');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'audit'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.audit', 'Governance Audit Logs')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('reports');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'reports'
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{t('nav.reports', 'Official Dossier Generator')}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

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

