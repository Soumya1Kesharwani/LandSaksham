import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { ProjectProvider, useProject } from './context/ProjectContext';

import { GovHeader } from './components/common/GovHeader';
import { GovSidebar } from './components/common/GovSidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';

import { OverviewTab } from './components/tabs/OverviewTab';
import { LandIntelligenceTab } from './components/tabs/LandIntelligenceTab';
import { GISMapTab } from './components/tabs/GISMapTab';
import { CompensationTab } from './components/tabs/CompensationTab';
import { LegalIntelligenceTab } from './components/tabs/LegalIntelligenceTab';
import { EnvironmentalTab } from './components/tabs/EnvironmentalTab';
import { SocialImpactTab } from './components/tabs/SocialImpactTab';
import { EmploymentEconomicTab } from './components/tabs/EmploymentEconomicTab';
import { RouteSimulatorTab } from './components/tabs/RouteSimulatorTab';
import { AIDelayPredictionTab } from './components/tabs/AIDelayPredictionTab';
import { PriorityActionQueueTab } from './components/tabs/PriorityActionQueueTab';
import { DocumentIntelligenceTab } from './components/tabs/DocumentIntelligenceTab';
import { SmartAlertsTab } from './components/tabs/SmartAlertsTab';
import { AuditLogsTab } from './components/tabs/AuditLogsTab';
import { ReportGeneratorTab } from './components/tabs/ReportGeneratorTab';

import { ParcelDetailModal } from './components/modals/ParcelDetailModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { AIOfficerCopilot } from './components/copilot/AIOfficerCopilot';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { LandingPage } from './components/landing/LandingPage';

const DashboardContent: React.FC<{
  onOpenCreateProject: () => void;
  onOpenCopilot: () => void;
  onNavigateLanding: () => void;
  onNavigateCitizen: () => void;
}> = ({ onOpenCreateProject, onOpenCopilot, onNavigateLanding, onNavigateCitizen }) => {
  const { activeTab, selectedParcel, setSelectedParcel } = useProject();
  const { role } = useRole();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  // Sync sidebar state on window resize or device mode toggle
  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setSidebarOpen(false);
        } else {
          setSidebarOpen(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'land':
        return <LandIntelligenceTab />;
      case 'gis':
        return <GISMapTab />;
      case 'compensation':
        return <CompensationTab />;
      case 'legal':
        return <LegalIntelligenceTab />;
      case 'environment':
        return <EnvironmentalTab />;
      case 'social':
        return <SocialImpactTab />;
      case 'employment':
        return <EmploymentEconomicTab />;
      case 'routes':
        return <RouteSimulatorTab />;
      case 'prediction':
        return <AIDelayPredictionTab />;
      case 'actions':
        return <PriorityActionQueueTab />;
      case 'documents':
        return <DocumentIntelligenceTab />;
      case 'alerts':
        return <SmartAlertsTab />;
      case 'audit':
        return <AuditLogsTab />;
      case 'reports':
        return <ReportGeneratorTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-[#f8fafc] transition-colors duration-200 overflow-x-hidden">
      <GovHeader
        onOpenCreateProject={onOpenCreateProject}
        onOpenCopilot={onOpenCopilot}
        onNavigateLanding={onNavigateLanding}
        onNavigateCitizen={onNavigateCitizen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex-1 w-full max-w-full flex overflow-hidden relative min-w-0">
        <GovSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6">
          {/* Active Role Indicator Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 sm:px-4 py-2 rounded-lg text-xs transition-colors min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse shrink-0"></span>
              <span className="text-slate-800 dark:text-blue-100">{t('system.active_viewport')}: <strong className="text-slate-900 dark:text-white font-bold">{t(role)}</strong></span>
              <span className="text-slate-400 dark:text-blue-600 hidden sm:inline">|</span>
              <span className="text-slate-700 dark:text-blue-200 hidden sm:inline">{t('system.all_permissions_active')}</span>
            </div>

            <button
              onClick={onOpenCreateProject}
              className="text-blue-700 dark:text-blue-300 hover:underline font-semibold text-[11px] sm:text-xs shrink-0 self-start sm:self-auto"
            >
              {t('system.register_new_project')}
            </button>
          </div>

          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenCopilot={onOpenCopilot}
        onNavigateCitizen={onNavigateCitizen}
        isCitizenPortal={false}
      />

      {/* Global Modals */}
      {selectedParcel && (
        <ParcelDetailModal
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
        />
      )}
    </div>
  );
};

const MainApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'citizen'>('dashboard');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const { setActiveTab } = useProject();

  return (
    <>
      {viewMode === 'landing' && (
        <LandingPage
          onEnterDashboard={() => setViewMode('dashboard')}
          onEnterCitizen={() => setViewMode('citizen')}
        />
      )}

      {viewMode === 'citizen' && (
        <>
          <CitizenPortal
            onBackToDashboard={() => setViewMode('dashboard')}
          />
          <MobileBottomNav
            onOpenCopilot={() => setCopilotOpen(true)}
            onNavigateCitizen={() => {}}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setViewMode('dashboard');
            }}
            isCitizenPortal={true}
          />
        </>
      )}

      {viewMode === 'dashboard' && (
        <DashboardContent
          onOpenCreateProject={() => setCreateProjectOpen(true)}
          onOpenCopilot={() => setCopilotOpen(true)}
          onNavigateLanding={() => setViewMode('landing')}
          onNavigateCitizen={() => setViewMode('citizen')}
        />
      )}

      <AIOfficerCopilot
        isOpen={copilotOpen}
        onToggle={() => setCopilotOpen(prev => !prev)}
        onClose={() => setCopilotOpen(false)}
      />

      {createProjectOpen && (
        <CreateProjectModal
          onClose={() => setCreateProjectOpen(false)}
        />
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RoleProvider>
          <ProjectProvider>
            <MainApp />
          </ProjectProvider>
        </RoleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
