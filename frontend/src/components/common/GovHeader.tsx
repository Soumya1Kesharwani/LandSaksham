import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { useProject } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { LanguageSelector } from './LanguageSelector';
import {
  Building2, Globe, Shield, Bell, ChevronDown,
  MapPin, Clock, ExternalLink, Sparkles, User, Sun, Moon, Info, X
} from 'lucide-react';

interface GovHeaderProps {
  onOpenCreateProject?: () => void;
  onOpenCopilot?: () => void;
  onNavigateLanding?: () => void;
  onNavigateCitizen?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  onOpenCreateProject,
  onOpenCopilot,
  onNavigateLanding,
  onNavigateCitizen,
  onToggleSidebar = () => {},
  isSidebarOpen = true
}) => {
  const { language, setLanguage, t, tr } = useLanguage();
  const { role, setRole } = useRole();
  const { projects, activeProject, setActiveProjectId, alerts } = useProject();

  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const { theme, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    const updateIST = () => {
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const localeCode = language === 'en' ? 'en-IN' : (language === 'hi' ? 'hi-IN' : `${language}-IN`);
      try {
        const d = new Intl.DateTimeFormat(localeCode, dateOptions).format(new Date());
        const tRaw = new Intl.DateTimeFormat(localeCode, timeOptions).format(new Date());
        const cleanTime = tRaw.replace(/\s*(am|pm|AM|PM|a\.m\.|p\.m\.)\s*/gi, '').trim();
        setCurrentDateStr(`${d},`);
        setCurrentTimeStr(`${cleanTime} IST`);
      } catch (e) {
        const d = new Intl.DateTimeFormat('en-IN', dateOptions).format(new Date());
        const tRaw = new Intl.DateTimeFormat('en-IN', timeOptions).format(new Date());
        const cleanTime = tRaw.replace(/\s*(am|pm|AM|PM|a\.m\.|p\.m\.)\s*/gi, '').trim();
        setCurrentDateStr(`${d},`);
        setCurrentTimeStr(`${cleanTime} IST`);
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

  const getBrandParts = (lang: string) => {
    switch (lang) {
      case 'hi': case 'mr': case 'mai': case 'ne': case 'sd':
        return { p1: 'भूमि ', p2: 'स', p3: 'क्षम' };
      case 'bn': case 'as':
        return { p1: 'ভূমি ', p2: 'সক', p3: 'ষম' };
      case 'te':
        return { p1: 'భూమి ', p2: 'స', p3: 'క్షమ్' };
      case 'ta':
        return { p1: 'பூமி ', p2: 'சக்', p3: 'ஷம்' };
      case 'gu':
        return { p1: 'જમીન ', p2: 'સ', p3: 'ક્ષમ' };
      case 'kn':
        return { p1: 'ಭೂಮಿ ', p2: 'ಸ', p3: 'ಕ್ಷಮ್' };
      case 'ml':
        return { p1: 'ഭൂമി ', p2: 'സമ', p3: 'ർത്ഥം' };
      case 'or':
        return { p1: 'ଭୂମି ', p2: 'ସ', p3: 'କ୍ଷମ' };
      case 'pa':
        return { p1: 'ਜ਼ਮੀਨ ', p2: 'ਸਮ', p3: 'ਰੱਥ' };
      case 'ur':
        return { p1: 'لینڈ ', p2: 'سکھـ', p3: 'شام' };
      case 'sa':
        return { p1: 'भूमि ', p2: 'सक्ष', p3: 'मम्' };
      case 'kok':
        return { p1: 'जमीन ', p2: 'स', p3: 'क्षम' };
      case 'mni':
        return { p1: 'লৈবাক ', p2: 'সক', p3: 'ষম' };
      case 'brx':
        return { p1: 'हा ', p2: 'गोहो ', p3: 'गोनां' };
      case 'ks':
        return { p1: 'زمین ', p2: 'س', p3: 'کھشام' };
      default:
        return { p1: 'Land', p2: 'Sak', p3: 'sham' };
    }
  };

  const brand = getBrandParts(language);

  return (
    <header className="sticky top-0 z-40 bg-[#0b1329] border-b border-slate-800 shadow-md transition-colors duration-200">
      {/* Tricolor Government Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-6 flex items-center justify-between gap-4">
        {/* Left: Identity & Branding */}
        <div className="flex items-center gap-3">
          {/* Logo (Clickable Sidebar Toggle) */}
          <button
            onClick={onToggleSidebar}
            className="w-11 h-11 rounded-full bg-white p-0.5 shadow-sm border border-slate-700 hover:border-blue-400 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title={isSidebarOpen ? "Click logo to close sidebar" : "Click logo to open sidebar"}
            aria-label="Toggle Navigation Sidebar"
          >
            <img src="/logo.png" alt="NLIIS Official Logo" className="w-full h-full object-contain rounded-full" />
          </button>

          <div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight">
                {t('system.title')}
              </h1>
              <div className="text-base font-extrabold tracking-tight leading-tight mt-0.5">
                <span className="text-[#f97316]">{brand.p1}</span>
                <span className="text-white">{brand.p2}</span>
                <span className="text-[#4ade80]">{brand.p3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Controls in exact sequence requested:
            1. Jaipur-Ajmer Live Project Selector
            2. Dropdown of District Magistrate / Role Switcher
            3. Landowner Portal
            4. Language Dropdown
            5. Date and Time (max 2 lines)
        */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Jaipur-Ajmer Live Project Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="max-w-[220px] truncate">
                {activeProject ? t(activeProject.name, activeProject.name) : t('system.select_project')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {projectDropdownOpen && (
              <div className="absolute left-0 mt-1 w-80 bg-[#111c38] border border-slate-700 rounded-md shadow-xl py-1 z-50 text-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  {t('system.active_infra_projects')}
                </div>
                {projects.map(p => {
                  const isJaipurAjmer = p.name.includes('Jaipur') || p.id.includes('jaipur');
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (!isJaipurAjmer) {
                          setShowProjectModal(true);
                        } else {
                          setActiveProjectId(p.id);
                        }
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-start justify-between ${p.id === activeProject?.id ? 'bg-blue-950/80 font-bold text-blue-300' : 'text-slate-200'
                        }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-white">{t(p.name, p.name)}</div>
                          {!isJaipurAjmer && (
                            <span className="text-[9px] bg-slate-800 text-amber-400/90 px-1.5 py-0.2 rounded border border-slate-700 font-normal">
                              {tr('Inactive', 'निष्क्रिय')}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{t(p.state, p.state)} • {p.length_km} {tr('km', 'किमी')}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">
                        {p.overall_delay_risk_score}% {t(p.overall_delay_risk_level, p.overall_delay_risk_level)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Dropdown of District Magistrate / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline max-w-[140px] truncate">{t(role)}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-[#111c38] border border-slate-700 rounded-md shadow-xl py-1 z-50 text-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  {t('roles.select_role')}
                </div>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      if (r !== 'Central Government Officer') {
                        setShowRoleModal(true);
                      } else {
                        setRole(r);
                      }
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between ${r === role ? 'bg-blue-950/80 font-bold text-blue-300' : 'text-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{t(r)}</span>
                      {r !== 'Central Government Officer' && (
                        <span className="text-[9px] bg-slate-800 text-amber-400/90 px-1.5 py-0.2 rounded border border-slate-700 font-normal">
                          {tr('Inactive', 'निष्क्रिय')}
                        </span>
                      )}
                    </div>
                    {r === role && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Landowner Portal */}
          {onNavigateCitizen && (
            <button
              onClick={onNavigateCitizen}
              className="hidden xl:flex items-center gap-1 border border-slate-700 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-md text-xs font-semibold transition"
              title={t('citizen.title')}
            >
              <span>{t('Landowner Portal')}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {/* 4. Language Dropdown */}
          <LanguageSelector variant="header" />

          {/* 5. Date and Time (Formatted in max 2 lines) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 font-mono leading-tight shrink-0 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="flex flex-col text-left whitespace-nowrap">
              <span className="whitespace-nowrap">{currentDateStr}</span>
              <span className="whitespace-nowrap">{currentTimeStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Restriction Popup Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#111c38] border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-5 text-slate-100 space-y-4 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{tr('Role Access Notice', 'भूमिका पहुंच सूचना')}</h3>
                <p className="text-xs text-slate-400">{tr('Role Availability', 'भूमिका उपलब्धता')}</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-200 leading-relaxed font-medium">
              {tr(
                'Right now active for Central Government Officer only.',
                'वर्तमान में केवल केंद्र सरकार अधिकारी (Central Government Officer) के लिए ही सक्रिय है।'
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                {t('common.close') || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Restriction Popup Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#111c38] border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-5 text-slate-100 space-y-4 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowProjectModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{tr('Project Access Notice', 'परियोजना पहुंच सूचना')}</h3>
                <p className="text-xs text-slate-400">{tr('Ground Data Availability', 'ग्राउंड डेटा उपलब्धता')}</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-200 leading-relaxed font-medium">
              {tr(
                'Right now available for Jaipur-Ajmer grounded data only.',
                'वर्तमान में केवल जयपुर-अजमेर ग्राउंडेड डेटा के लिए उपलब्ध है।'
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                {t('common.close') || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
