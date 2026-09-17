import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, Map, Sparkles, ListTodo, UserCheck 
} from 'lucide-react';

interface MobileBottomNavProps {
  onToggleSidebar?: () => void;
  onOpenCopilot: () => void;
  isSidebarOpen?: boolean;
  onNavigateCitizen: () => void;
  onNavigateTab?: (tab: string) => void;
  isCitizenPortal?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCopilot,
  onNavigateCitizen,
  onNavigateTab,
  isCitizenPortal = false
}) => {
  const { activeTab, setActiveTab, actionItems } = useProject();
  const { tr, t } = useLanguage();

  const pendingActionsCount = actionItems.filter(
    a => a.status !== 'Resolved' && a.status !== 'Closed'
  ).length;

  const handleTabClick = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b1329]/95 backdrop-blur-md border-t border-slate-800 px-1 xs:px-2 py-1.5 shadow-2xl flex items-center justify-around safe-area-bottom select-none"
    >
      {/* 1. Overview */}
      <button
        onClick={() => handleTabClick('overview')}
        className={`flex flex-col items-center justify-center py-1 px-1 xs:px-2 rounded-lg transition-all text-[9.5px] xs:text-[10px] font-medium ${
          !isCitizenPortal && activeTab === 'overview'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className={`w-4 h-4 mb-0.5 ${!isCitizenPortal && activeTab === 'overview' ? 'text-blue-400 stroke-[2.5]' : 'text-slate-400'}`} />
        <span>{tr('Overview', 'अवलोकन')}</span>
      </button>

      {/* 2. GIS Map */}
      <button
        onClick={() => handleTabClick('gis')}
        className={`flex flex-col items-center justify-center py-1 px-1 xs:px-2 rounded-lg transition-all text-[9.5px] xs:text-[10px] font-medium ${
          !isCitizenPortal && activeTab === 'gis'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Map className={`w-4 h-4 mb-0.5 ${!isCitizenPortal && activeTab === 'gis' ? 'text-blue-400 stroke-[2.5]' : 'text-slate-400'}`} />
        <span>{tr('GIS Map', 'मानचित्र')}</span>
      </button>

      {/* 3. AI Copilot (Center Highlight) */}
      <button
        onClick={onOpenCopilot}
        className="flex flex-col items-center justify-center -mt-3 py-1 px-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
        title="Open AI Copilot"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse mb-0.5" />
        <span className="text-[9px] font-extrabold tracking-wide">AI COPILOT</span>
      </button>

      {/* 4. Actions */}
      <button
        onClick={() => handleTabClick('actions')}
        className={`relative flex flex-col items-center justify-center py-1 px-1 xs:px-2 rounded-lg transition-all text-[9.5px] xs:text-[10px] font-medium ${
          !isCitizenPortal && activeTab === 'actions'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <ListTodo className={`w-4 h-4 mb-0.5 ${!isCitizenPortal && activeTab === 'actions' ? 'text-blue-400 stroke-[2.5]' : 'text-slate-400'}`} />
          {pendingActionsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] font-bold px-1 rounded-full">
              {pendingActionsCount}
            </span>
          )}
        </div>
        <span>{tr('Actions', 'कार्यसूची')}</span>
      </button>

      {/* 5. Landowner Portal */}
      <button
        onClick={onNavigateCitizen}
        className={`flex flex-col items-center justify-center py-1 px-1 xs:px-2 rounded-lg transition-all text-[9.5px] xs:text-[10px] font-medium ${
          isCitizenPortal
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title={t('Landowner Portal')}
      >
        <UserCheck className={`w-4 h-4 mb-0.5 ${isCitizenPortal ? 'text-blue-400 stroke-[2.5]' : 'text-slate-400'}`} />
        <span className="truncate max-w-[62px] xs:max-w-[74px] sm:max-w-none">{tr('Landowner Portal', 'भूस्वामी पोर्टल')}</span>
      </button>
    </nav>
  );
};
