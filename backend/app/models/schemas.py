"""
Pydantic schemas and data models for the National Land & Infrastructure Intelligence System (NLIIS).
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import date, datetime

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class LandType(str, Enum):
    GOVERNMENT = "Government Land"
    PRIVATE_AGRICULTURAL = "Private Agricultural"
    PRIVATE_RESIDENTIAL = "Private Residential"
    PRIVATE_COMMERCIAL = "Private Commercial"
    FOREST = "Forest Land"
    WATER_BODY = "Water Body / Catchment"
    COMMUNITY_GRAZING = "Community / Grazing (Gauchar)"
    OTHER = "Other Statutory Land"

class AcquisitionStatus(str, Enum):
    SECTION_4_NOTIFIED = "Section 4 Notification"
    SECTION_11_PRELIMINARY = "Section 11 (Preliminary Notification)"
    SECTION_19_DECLARATION = "Section 19 (Declaration of Acquisition)"
    VALUATION_COMPLETED = "Valuation Completed"
    AWARD_ANNOUNCED = "Section 23 Award Announced"
    COMPENSATION_DISBURSED = "Compensation Disbursed (80%+)"
    POSSESSION_TAKEN = "Physical Possession Taken"
    MUTATION_RECORDED = "Revenue Mutation Recorded"

class LegalCaseStatus(str, Enum):
    NO_CASE = "No Case"
    PETITION_FILED = "Petition Filed"
    NOTICE_ISSUED = "Notice Issued to State/LAO"
    INTERIM_STAY_GRANTED = "Interim Stay Granted"
    STAY_VACATED = "Stay Vacated"
    FINAL_HEARING = "Final Hearing"
    DISPOSED = "Disposed / Settled"

class ActionPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class ActionStatus(str, Enum):
    NEW = "New"
    UNDER_REVIEW = "Under Review"
    ACTION_REQUIRED = "Action Required"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class DepartmentType(str, Enum):
    REVENUE = "Revenue Department"
    LAND_ACQUISITION = "Land Acquisition Office (LAO)"
    LEGAL = "Legal & Litigation Cell"
    FOREST = "Forest & Environment Dept"
    R_AND_R = "Rehabilitation & Resettlement Cell"
    PROJECT_AUTHORITY = "Project Authority / Executing Agency"
    FINANCE = "Finance & Treasury"

class UserRole(str, Enum):
    CENTRAL_OFFICER = "Central Government Officer"
    STATE_OFFICER = "State Government Officer"
    DISTRICT_COLLECTOR = "District Magistrate / Collector"
    LAO_OFFICER = "Land Acquisition Officer (LAO)"
    REVENUE_OFFICER = "Revenue Officer / Tehsildar"
    LEGAL_OFFICER = "Legal / Litigation Officer"
    FOREST_OFFICER = "Forest & Environmental Officer"
    RR_OFFICER = "R&R Officer"
    PROJECT_DIRECTOR = "Project Director"
    CITIZEN = "Citizen / Landowner"

# --- Entity Models ---

class Landowner(BaseModel):
    id: str
    name: str
    relation: str = "S/o or D/o"
    father_or_spouse_name: str
    contact_masked: str
    address: str
    bank_account_verified: bool
    aadhaar_seeded: bool
    pan_available: bool
    share_percentage: float = 100.0

class CourtCase(BaseModel):
    id: str
    case_number: str
    court_name: str
    case_type: str  # e.g., "Writ Petition (Civil)", "Land Acquisition Reference"
    petitioner: str
    respondent: str
    filing_date: str
    last_hearing_date: str
    next_hearing_date: str
    last_order_summary: str
    status: LegalCaseStatus
    has_stay_order: bool
    stay_order_details: Optional[str] = None
    ai_risk_assessment: str
    recommended_legal_action: str

class CompensationDetail(BaseModel):
    parcel_id: str
    land_market_value_inr: float
    multiplier_factor: float = 1.0  # 1.0 for urban, 1.25 - 2.0 for rural under RFCTLARR 2013
    base_land_value_inr: float
    solatium_100_pct_inr: float
    additional_interest_12_pct_inr: float
    crop_compensation_inr: float = 0.0
    structure_compensation_inr: float = 0.0
    tree_compensation_inr: float = 0.0
    rehabilitation_resettlement_grant_inr: float = 0.0
    total_estimated_compensation_inr: float
    amount_disbursed_inr: float
    amount_pending_inr: float
    disbursement_percentage: float
    payment_status: str  # "Fully Paid", "Partially Paid", "Pending Verification", "Disputed in Court"
    escrow_deposited: bool

class EnvironmentalFlag(BaseModel):
    parcel_id: str
    overlaps_forest: bool
    forest_diversion_area_ha: float = 0.0
    forest_type: Optional[str] = None  # "Reserved Forest", "Protected Forest", "Social Forestry"
    in_eco_sensitive_zone: bool
    wildlife_corridor_proximity_km: float
    waterbody_overlap: bool
    waterbody_name: Optional[str] = None
    statutory_clearance_stage: str  # "Stage-I Applied", "Stage-I In-Principle Approved", "Stage-II Final Approved", "Exempt"
    clearance_days_pending: int
    environmental_risk_level: RiskLevel

class SocialImpactDetail(BaseModel):
    parcel_id: str
    affected_households: int
    potentially_displaced_persons: int
    agricultural_laborers_dependent: int
    is_vulnerable_category: bool  # SC/ST/Marginal Farmer
    structure_type: Optional[str] = None  # "Pucca", "Semi-Pucca", "Kaccha", "Commercial Shop", "None"
    rr_entitlement_status: str  # "Identified", "Allotment Pending", "Constructed", "NA"
    resettlement_site: Optional[str] = None

class RiskFactor(BaseModel):
    factor_name: str
    importance_score: float  # SHAP-like value
    description: str
    impact_days: int
    severity: RiskLevel

class Parcel(BaseModel):
    id: str  # e.g., "RJ-JPR-P127"
    khasra_survey_no: str  # e.g., "142/1"
    village: str
    gram_panchayat: str
    tehsil: str
    district: str
    state: str
    area_acres: float
    land_type: LandType
    owner: Landowner
    co_owners_count: int = 0
    acquisition_status: AcquisitionStatus
    possession_percentage: float
    mutation_status: str  # "Verified & Mutated", "Mutation Pending", "Disputed", "Succession Open"
    delay_risk_score: int  # 0 to 100
    delay_risk_level: RiskLevel
    delay_probability: float  # 0.0 to 1.0
    expected_delay_days: int
    readiness_score: int  # 0 to 100
    top_risk_factors: List[RiskFactor] = []
    compensation: Optional[CompensationDetail] = None
    legal_case: Optional[CourtCase] = None
    environmental: Optional[EnvironmentalFlag] = None
    social_impact: Optional[SocialImpactDetail] = None
    recommended_action: str
    recommended_action_priority: ActionPriority
    lat: float
    lng: float
    polygon_coordinates: List[List[float]] = []  # GeoJSON polygon coordinates [lat, lng]
    document_verified_count: int = 4
    document_missing_count: int = 0
    last_updated: str

class AlternativeRoute(BaseModel):
    route_id: str
    route_name: str
    description: str
    total_length_km: float
    total_land_required_acres: float
    govt_land_pct: float
    private_land_pct: float
    forest_land_pct: float
    estimated_cost_cr: float
    compensation_cost_cr: float
    affected_households: int
    forest_diverted_acres: float
    water_crossings: int
    legal_risk_score: int
    delay_probability: float
    expected_delay_days: int
    project_readiness_score: int
    employment_potential_jobs: int
    connectivity_score: int
    ai_recommendation_verdict: str
    is_recommended: bool
    coordinates: List[List[float]] = []  # Polyline coords

class EmploymentImpact(BaseModel):
    direct_construction_jobs: int
    indirect_supply_chain_jobs: int
    operational_maintenance_jobs: int
    total_estimated_jobs: int
    local_worker_absorption_pct: float
    construction_phase_months: int
    key_employment_trades: List[str]
    assumptions_note: str

class RegionalEconomicImpact(BaseModel):
    avg_travel_time_reduction_pct: float
    freight_movement_efficiency_gain_pct: float
    villages_newly_connected: int
    districts_directly_linked: int
    estimated_local_gdp_boost_cr: float
    key_beneficiary_sectors: List[str]
    assumptions_note: str

class Project(BaseModel):
    id: str
    name: str
    code: str
    type: str  # Highway, Railway, Metro, Airport, Irrigation, etc.
    authority: str  # NHAI, RVNL, State PWD, DMRC, etc.
    state: str
    districts: List[str]
    start_date: str
    target_completion_date: str
    revised_completion_date: Optional[str] = None
    length_km: float
    total_cost_cr: float
    total_land_required_acres: float
    government_land_acres: float
    private_land_acres: float
    forest_land_acres: float
    agricultural_land_acres: float
    commercial_residential_acres: float
    total_parcels_count: int
    high_risk_parcels_count: int
    total_landowners_count: int
    compensation_total_cr: float
    compensation_paid_cr: float
    compensation_pending_cr: float
    active_court_cases_count: int
    stay_orders_count: int
    environmental_flags_count: int
    rr_cases_count: int
    overall_delay_risk_score: int  # 0 - 100
    overall_delay_risk_level: RiskLevel
    overall_delay_probability: float
    expected_delay_days: int
    overall_readiness_score: int  # 0 - 100
    readiness_breakdown: Dict[str, int]  # {"land": 72, "legal": 51, "compensation": 63, "environment": 81, "rr": 58, "documents": 76}
    employment: EmploymentImpact
    economic: RegionalEconomicImpact
    description: str
    status: str  # "In Acquisition", "Pre-Construction", "Delayed", "On Schedule"

class ActionItem(BaseModel):
    id: str
    project_id: str
    project_name: str
    parcel_id: Optional[str] = None
    khasra_no: Optional[str] = None
    title: str
    problem_summary: str
    risk_level: RiskLevel
    impact_delay_days: int
    recommended_action: str
    responsible_department: DepartmentType
    assigned_to_role: str
    due_date: str
    status: ActionStatus
    created_at: str
    updated_at: str

class Alert(BaseModel):
    id: str
    project_id: str
    project_name: str
    parcel_id: Optional[str] = None
    title: str
    message: str
    severity: RiskLevel
    department: DepartmentType
    is_read: bool
    created_at: str

class AuditLog(BaseModel):
    id: str
    user_name: str
    user_role: str
    action_type: str
    target_entity: str
    target_id: str
    previous_value: Optional[str] = None
    new_value: str
    ip_address: str
    timestamp: str

class CitizenTrackingResponse(BaseModel):
    parcel_id: str
    khasra_no: str
    village: str
    tehsil: str
    district: str
    state: str
    owner_name_masked: str
    project_name: str
    project_authority: str
    current_stage: str
    current_stage_index: int  # 1 to 5
    stages: List[Dict[str, Any]]
    compensation_status: str
    compensation_amount_disbursed_masked: Optional[str] = None
    compensation_amount_pending_masked: Optional[str] = None
    next_action_for_landowner: str
    designated_lao_office: str
    helpline_number: str
    last_updated: str
