import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isCitizen: boolean;
  canApproveActions: boolean;
  canDisburseFunds: boolean;
  canEditLandRecords: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('District Magistrate / Collector');

  const isCitizen = role === 'Citizen / Landowner';
  const canApproveActions = ['District Magistrate / Collector', 'Central Government Officer', 'State Government Officer'].includes(role);
  const canDisburseFunds = ['Land Acquisition Officer (LAO)', 'District Magistrate / Collector'].includes(role);
  const canEditLandRecords = ['Revenue Officer / Tehsildar', 'Land Acquisition Officer (LAO)'].includes(role);

  return (
    <RoleContext.Provider value={{
      role,
      setRole,
      isCitizen,
      canApproveActions,
      canDisburseFunds,
      canEditLandRecords
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
