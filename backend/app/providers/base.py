"""
Abstract Base Providers for Data Ingestion and Government System Integrations.
These abstract classes define the exact contracts that future live Government of India / State Government
APIs must implement (e.g. e-Dharti, Bhulekh, e-Courts NJDG, MoEFCC Parivesh, PM GatiShakti GIS).
"""
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.models.schemas import (
    Project, Parcel, CourtCase, CompensationDetail, EnvironmentalFlag,
    AlternativeRoute, ActionItem, Alert, AuditLog, CitizenTrackingResponse
)

class BaseLandRecordsProvider(ABC):
    """Interface for State Revenue Land Records Systems (Bhulekh / Bhoomi / Dharani / e-Dharti / Banglarbhumi)."""
    @abstractmethod
    def get_parcels_by_project(self, project_id: str) -> List[Parcel]:
        pass

    @abstractmethod
    def get_parcel_by_id(self, parcel_id: str) -> Optional[Parcel]:
        pass

    @abstractmethod
    def get_parcel_by_khasra(self, district: str, tehsil: str, village: str, khasra_no: str) -> Optional[Parcel]:
        pass

class BaseCourtDataProvider(ABC):
    """Interface for National Judicial Data Grid (NJDG) / e-Courts Services."""
    @abstractmethod
    def get_cases_for_parcel(self, parcel_id: str) -> List[CourtCase]:
        pass

    @abstractmethod
    def get_cases_for_project(self, project_id: str) -> List[CourtCase]:
        pass

class BaseCompensationProvider(ABC):
    """Interface for State LAO Treasury & PFMS (Public Financial Management System) / Bhoomi R&R."""
    @abstractmethod
    def get_compensation_for_parcel(self, parcel_id: str) -> Optional[CompensationDetail]:
        pass

    @abstractmethod
    def calculate_rfctlarr_valuation(self, market_rate_per_acre: float, area_acres: float, is_rural: bool) -> CompensationDetail:
        pass

class BaseEnvironmentalDataProvider(ABC):
    """Interface for MoEFCC PARIVESH Portal (Forest & Environmental Clearances)."""
    @abstractmethod
    def get_environmental_clearances_for_project(self, project_id: str) -> List[EnvironmentalFlag]:
        pass

class BaseProjectDataProvider(ABC):
    """Master Interface combining all providers into a unified Project Intelligence Layer."""
    @abstractmethod
    def get_all_projects(self) -> List[Project]:
        pass

    @abstractmethod
    def get_project_by_id(self, project_id: str) -> Optional[Project]:
        pass

    @abstractmethod
    def get_routes_for_project(self, project_id: str) -> List[AlternativeRoute]:
        pass

    @abstractmethod
    def get_action_items(self, project_id: Optional[str] = None) -> List[ActionItem]:
        pass

    @abstractmethod
    def get_alerts(self, project_id: Optional[str] = None) -> List[Alert]:
        pass

    @abstractmethod
    def get_audit_logs(self) -> List[AuditLog]:
        pass
