import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Parcel, AlternativeRoute, ActionItem, Alert, AuditLog } from '../types';
import { fetchProjects, fetchParcels, fetchRoutes, fetchActionItems, fetchAuditLogs } from '../services/api';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setActiveProjectId: (id: string) => void;
  parcels: Parcel[];
  routes: AlternativeRoute[];
  actionItems: ActionItem[];
  alerts: Alert[];
  auditLogs: AuditLog[];
  selectedParcel: Parcel | null;
  setSelectedParcel: (parcel: Parcel | null) => void;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRisk: string;
  setFilterRisk: (risk: string) => void;
  filterLandType: string;
  setFilterLandType: (ltype: string) => void;
  refreshData: () => Promise<void>;
  updateLocalActionStatus: (actionId: string, newStatus: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('jaipur-ajmer-nh48');
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [routes, setRoutes] = useState<AlternativeRoute[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterLandType, setFilterLandType] = useState<string>('ALL');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const projData = await fetchProjects();
      setProjects(projData);

      const targetId = activeProjectId || (projData[0]?.id ?? 'jaipur-ajmer-nh48');
      const [parcelsData, routesData, actionsData, auditData] = await Promise.all([
        fetchParcels(targetId),
        fetchRoutes(targetId),
        fetchActionItems(targetId),
        fetchAuditLogs()
      ]);

      setParcels(parcelsData);
      setRoutes(routesData);
      setActionItems(actionsData);
      setAuditLogs(auditData);

      // Populate local alerts if none
      if (actionsData.length > 0) {
        setAlerts([
          {
            id: "ALT-101",
            project_id: "jaipur-ajmer-nh48",
            project_name: "Jaipur–Ajmer Integrated Highway Expansion",
            parcel_id: "RJ-JPR-P127",
            title: "Critical Stay Order Active on Parcel P127",
            message: "High Court status quo order issued on physical possession. Immediate hearing listing required.",
            severity: "CRITICAL",
            department: "Legal & Litigation Cell",
            is_read: false,
            created_at: "2026-09-08T09:00:00+05:30"
          },
          {
            id: "ALT-102",
            project_id: "jaipur-ajmer-nh48",
            project_name: "Jaipur–Ajmer Integrated Highway Expansion",
            parcel_id: "RJ-DUD-P201",
            title: "Stage-II Forest Clearance Inactivity Alert",
            message: "Parivesh application for 2.9 ha Dudu forest division has had no movement for 48 consecutive days.",
            severity: "CRITICAL",
            department: "Forest & Environment Dept",
            is_read: false,
            created_at: "2026-09-07T11:45:00+05:30"
          },
          {
            id: "ALT-103",
            project_id: "jaipur-ajmer-nh48",
            project_name: "Jaipur–Ajmer Integrated Highway Expansion",
            parcel_id: "RJ-AJM-P314",
            title: "Compensation Pendency > ₹35 Crore in Kishangarh Sector",
            message: "Pending commercial structure compensations are creating friction with local marble logistics associations.",
            severity: "HIGH",
            department: "Land Acquisition Office (LAO)",
            is_read: true,
            created_at: "2026-09-06T15:20:00+05:30"
          }
        ]);
      }
    } catch (e) {
      console.error("Error loading project data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeProjectId]);

  const updateLocalActionStatus = (actionId: string, newStatus: string) => {
    setActionItems(prev => prev.map(a => a.id === actionId ? { ...a, status: newStatus as any } : a));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      setActiveProjectId,
      parcels,
      routes,
      actionItems,
      alerts,
      auditLogs,
      selectedParcel,
      setSelectedParcel,
      isLoading,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      filterRisk,
      setFilterRisk,
      filterLandType,
      setFilterLandType,
      refreshData,
      updateLocalActionStatus
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
