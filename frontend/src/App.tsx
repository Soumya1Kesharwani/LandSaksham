import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { ProjectProvider, useProject } from './context/ProjectContext';

import { GovHeader } from './components/common/GovHeader';
import { GovSidebar } from './components/common/GovSidebar';

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
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <GovHeader
        onOpenCreateProject={onOpenCreateProject}
        onOpenCopilot={onOpenCopilot}
        onNavigateLanding={onNavigateLanding}
        onNavigateCitizen={onNavigateCitizen}
      />

      <div className="flex-1 flex overflow-hidden">
        <GovSidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Active Role Indicator Bar */}
          <div className="flex items-center justify-between bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-lg text-xs transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
              <span className="text-slate-800 dark:text-blue-100">{t('system.active_viewport')}: <strong className="text-slate-900 dark:text-white font-bold">{t(role)}</strong></span>
              <span className="text-slate-400 dark:text-blue-600">|</span>
              <span className="text-slate-700 dark:text-blue-200">{t('system.all_permissions_active')}</span>
            </div>

            <button
              onClick={onOpenCreateProject}
              className="text-blue-700 dark:text-blue-300 hover:underline font-semibold"
            >
              {t('system.register_new_project')}
            </button>
          </div>

          {renderActiveTab()}
        </main>
      </div>

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

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'citizen'>('dashboard');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  return (
    <LanguageProvider>
      <RoleProvider>
        <ProjectProvider>
          {viewMode === 'landing' && (
            <LandingPage
              onEnterDashboard={() => setViewMode('dashboard')}
              onEnterCitizen={() => setViewMode('citizen')}
            />
          )}

          {viewMode === 'citizen' && (
            <CitizenPortal
              onBackToDashboard={() => setViewMode('dashboard')}
            />
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
            onClose={() => setCopilotOpen(false)}
          />

          {createProjectOpen && (
            <CreateProjectModal
              onClose={() => setCreateProjectOpen(false)}
            />
          )}
        </ProjectProvider>
      </RoleProvider>
    </LanguageProvider>
  );
};

export default App;
