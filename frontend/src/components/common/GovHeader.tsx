import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { useProject } from '../../context/ProjectContext';
import { UserRole } from '../../types';
import { LanguageSelector } from './LanguageSelector';
import { 
  Building2, Globe, Shield, Bell, ChevronDown, 
  MapPin, Clock, ExternalLink, Sparkles, User, Sun, Moon
} from 'lucide-react';

interface GovHeaderProps {
  onOpenCreateProject?: () => void;
  onOpenCopilot?: () => void;
  onNavigateLanding?: () => void;
  onNavigateCitizen?: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  onOpenCreateProject,
  onOpenCopilot,
  onNavigateLanding,
  onNavigateCitizen
}) => {
  const { language, setLanguage, t, tr } = useLanguage();
  const { role, setRole } = useRole();
  const { projects, activeProject, setActiveProjectId, alerts } = useProject();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>(() => {
    return (localStorage.getItem('nliis_font_size') as 'small' | 'normal' | 'large') || 'normal';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nliis_theme') as 'light' | 'dark';
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('nliis_theme', nextTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  useEffect(() => {
    const updateIST = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      const localeCode = language === 'en' ? 'en-IN' : (language === 'hi' ? 'hi-IN' : `${language}-IN`);
      try {
        setCurrentTime(new Intl.DateTimeFormat(localeCode, options).format(new Date()) + ` ${t('IST', 'IST')}`);
      } catch (e) {
        setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(new Date()) + ' IST');
      }
    };
    updateIST();
    const timer = setInterval(updateIST, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const unreadAlerts = alerts.filter(a => !a.is_read).length;

  const rolesList: UserRole[] = [
    'Central Government Officer',
    'State Government Officer',
    'District Magistrate / Collector',
    'Land Acquisition Officer (LAO)',
    'Revenue Officer / Tehsildar',
    'Legal / Litigation Officer',
    'Forest & Environmental Officer',
    'Citizen / Landowner'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Tricolor Government Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Identity & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="NLIIS Official Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {t('system.title')} — <span className="text-[#f97316] font-extrabold">Land</span><span className="text-[#2563eb] dark:text-[#60a5fa] font-extrabold">Sak</span><span className="text-[#16a34a] dark:text-[#4ade80] font-extrabold">sham</span>
              </h1>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800 uppercase tracking-wider">
                SIH 2026
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Project Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-800 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-gov-blue" />
            <span className="max-w-[220px] truncate">
              {activeProject ? t(activeProject.name, activeProject.name) : t('system.select_project')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-1 w-80 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                {t('system.active_infra_projects')}
              </div>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start justify-between ${
                    p.id === activeProject?.id ? 'bg-blue-50 font-bold text-gov-blue' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{t(p.name, p.name)}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{t(p.state, p.state)} • {p.length_km} {tr('km', 'किमी')}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono">
                    {p.overall_delay_risk_score}% {t(p.overall_delay_risk_level, p.overall_delay_risk_level)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls: IST Clock, Language, Role, Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* IST Time */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime}</span>
          </div>

          {/* Font Size Accessibility Controls (A- / A / A+) */}
          <div className="flex items-center bg-slate-100 border border-slate-300 rounded-md p-0.5 text-xs font-semibold text-slate-700">
            <button
              onClick={() => handleFontSizeChange('small')}
              className={`px-2 py-1 rounded transition ${fontSize === 'small' ? 'bg-gov-navy text-white shadow-xs font-bold' : 'hover:bg-slate-200'}`}
              title="Decrease Font Size (A-)"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange('normal')}
              className={`px-2 py-1 rounded transition ${fontSize === 'normal' ? 'bg-gov-navy text-white shadow-xs font-bold' : 'hover:bg-slate-200'}`}
              title="Normal / Comfortable Font Size (A)"
            >
              A
            </button>
            <button
              onClick={() => handleFontSizeChange('large')}
              className={`px-2 py-1 rounded transition ${fontSize === 'large' ? 'bg-gov-navy text-white shadow-xs font-bold' : 'hover:bg-slate-200'}`}
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>

          {/* Regional Language Selector */}
          <LanguageSelector variant="header" />

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 bg-gov-navy text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-slate-800 transition"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline max-w-[140px] truncate">{t(role)}</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  {t('roles.select_role')}
                </div>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${
                      r === role ? 'bg-blue-50 font-bold text-gov-blue' : 'text-slate-700'
                    }`}
                  >
                    <span>{t(r)}</span>
                    {r === role && <span className="w-2 h-2 rounded-full bg-gov-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copilot Trigger */}
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-2.5 py-1.5 rounded-md text-xs font-semibold hover:from-blue-800 hover:to-indigo-900 shadow-sm"
              title={t('copilot.title')}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{t('AI Copilot')}</span>
            </button>
          )}

          {/* Citizen Portal Shortcut */}
          {onNavigateCitizen && (
            <button
              onClick={onNavigateCitizen}
              className="hidden xl:flex items-center gap-1 border border-slate-300 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-md text-xs font-semibold"
              title={t('citizen.title')}
            >
              <span>{t('Landowner Portal')}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
