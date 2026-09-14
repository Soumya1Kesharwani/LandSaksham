export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 
  | 'Central Government Officer'
  | 'State Government Officer'
  | 'District Magistrate / Collector'
  | 'Land Acquisition Officer (LAO)'
  | 'Revenue Officer / Tehsildar'
  | 'Legal / Litigation Officer'
  | 'Forest & Environmental Officer'
  | 'R&R Officer'
  | 'Project Director'
  | 'Citizen / Landowner';

export interface Landowner {
  id: string;
  name: string;
  relation: string;
  father_or_spouse_name: string;
  contact_masked: string;
  address: string;
  bank_account_verified: boolean;
  aadhaar_seeded: boolean;
  pan_available: boolean;
  share_percentage: number;
}

export interface CourtCase {
  id: string;
  case_number: string;
  court_name: string;
  case_type: string;
  petitioner: string;
  respondent: string;
  filing_date: string;
  last_hearing_date: string;
  next_hearing_date: string;
  last_order_summary: string;
  status: string;
  has_stay_order: boolean;
  stay_order_details?: string;
  ai_risk_assessment: string;
  recommended_legal_action: string;
}

export interface CompensationDetail {
  parcel_id: string;
  land_market_value_inr: number;
  multiplier_factor: number;
  base_land_value_inr: number;
  solatium_100_pct_inr: number;
  additional_interest_12_pct_inr: number;
  crop_compensation_inr: number;
  structure_compensation_inr: number;
  tree_compensation_inr: number;
  rehabilitation_resettlement_grant_inr: number;
  total_estimated_compensation_inr: number;
  amount_disbursed_inr: number;
  amount_pending_inr: number;
  disbursement_percentage: number;
  payment_status: string;
  escrow_deposited: boolean;
}

export interface EnvironmentalFlag {
  parcel_id: string;
  overlaps_forest: boolean;
  forest_diversion_area_ha: number;
  forest_type?: string;
  in_eco_sensitive_zone: boolean;
  wildlife_corridor_proximity_km: number;
  waterbody_overlap: boolean;
  waterbody_name?: string;
  statutory_clearance_stage: string;
  clearance_days_pending: number;
  environmental_risk_level: RiskLevel;
}

export interface SocialImpactDetail {
  parcel_id: string;
  affected_households: number;
  potentially_displaced_persons: number;
  agricultural_laborers_dependent: number;
  is_vulnerable_category: boolean;
  structure_type?: string;
  rr_entitlement_status: string;
  resettlement_site?: string;
}

export interface RiskFactor {
  factor_name: string;
  importance_score: number;
  description: string;
  impact_days: number;
  severity: RiskLevel;
}

export interface Parcel {
  id: string;
  khasra_survey_no: string;
  village: string;
  gram_panchayat: string;
  tehsil: string;
  district: string;
  state: string;
  area_acres: number;
  land_type: string;
  owner: Landowner;
  co_owners_count: number;
  acquisition_status: string;
  possession_percentage: number;
  mutation_status: string;
  delay_risk_score: number;
  delay_risk_level: RiskLevel;
  delay_probability: number;
  expected_delay_days: number;
  readiness_score: number;
  top_risk_factors: RiskFactor[];
  compensation?: CompensationDetail;
  legal_case?: CourtCase;
  environmental?: EnvironmentalFlag;
  social_impact?: SocialImpactDetail;
  recommended_action: string;
  recommended_action_priority: 'Low' | 'Medium' | 'High' | 'Critical';
  lat: number;
  lng: number;
  polygon_coordinates: number[][];
  document_verified_count: number;
  document_missing_count: number;
  last_updated: string;
}

export interface AlternativeRoute {
  route_id: string;
  route_name: string;
  description: string;
  total_length_km: number;
  total_land_required_acres: number;
  govt_land_pct: number;
  private_land_pct: number;
  forest_land_pct: number;
  estimated_cost_cr: number;
  compensation_cost_cr: number;
  affected_households: number;
  forest_diverted_acres: number;
  water_crossings: number;
  legal_risk_score: number;
  delay_probability: number;
  expected_delay_days: number;
  project_readiness_score: number;
  employment_potential_jobs: number;
  connectivity_score: number;
  ai_recommendation_verdict: string;
  is_recommended: boolean;
  coordinates: number[][];
}

export interface EmploymentImpact {
  direct_construction_jobs: number;
  indirect_supply_chain_jobs: number;
  operational_maintenance_jobs: number;
  total_estimated_jobs: number;
  local_worker_absorption_pct: number;
  construction_phase_months: number;
  key_employment_trades: string[];
  assumptions_note: string;
}

export interface RegionalEconomicImpact {
  avg_travel_time_reduction_pct: number;
  freight_movement_efficiency_gain_pct: number;
  villages_newly_connected: number;
  districts_directly_linked: number;
  estimated_local_gdp_boost_cr: number;
  key_beneficiary_sectors: string[];
  assumptions_note: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  authority: string;
  state: string;
  districts: string[];
  start_date: string;
  target_completion_date: string;
  revised_completion_date?: string;
  length_km: number;
  total_cost_cr: number;
  total_land_required_acres: number;
  government_land_acres: number;
  private_land_acres: number;
  forest_land_acres: number;
  agricultural_land_acres: number;
  commercial_residential_acres: number;
  total_parcels_count: number;
  high_risk_parcels_count: number;
  total_landowners_count: number;
  compensation_total_cr: number;
  compensation_paid_cr: number;
  compensation_pending_cr: number;
  active_court_cases_count: number;
  stay_orders_count: number;
  environmental_flags_count: number;
  rr_cases_count: number;
  overall_delay_risk_score: number;
  overall_delay_risk_level: RiskLevel;
  overall_delay_probability: number;
  expected_delay_days: number;
  overall_readiness_score: number;
  readiness_breakdown: {
    land: number;
    legal: number;
    compensation: number;
    environment: number;
    rr: number;
    documents: number;
  };
  employment: EmploymentImpact;
  economic: RegionalEconomicImpact;
  description: string;
  status: string;
}

export interface ActionItem {
  id: string;
  project_id: string;
  project_name: string;
  parcel_id?: string;
  khasra_no?: string;
  title: string;
  problem_summary: string;
  risk_level: RiskLevel;
  impact_delay_days: number;
  recommended_action: string;
  responsible_department: string;
  assigned_to_role: string;
  due_date: string;
  status: 'New' | 'Under Review' | 'Action Required' | 'In Progress' | 'Resolved' | 'Closed';
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  project_id: string;
  project_name: string;
  parcel_id?: string;
  title: string;
  message: string;
  severity: RiskLevel;
  department: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_name: string;
  user_role: string;
  action_type: string;
  target_entity: string;
  target_id: string;
  previous_value?: string;
  new_value: string;
  ip_address: string;
  timestamp: string;
}

export interface CitizenTrackingStage {
  stage_no: number;
  title: string;
  status: string;
  date: string;
  description: string;
}

export interface CitizenTrackingResponse {
  parcel_id: string;
  khasra_no: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  owner_name_masked: string;
  project_name: string;
  project_authority: string;
  current_stage: string;
  current_stage_index: number;
  stages: CitizenTrackingStage[];
  compensation_status: string;
  compensation_amount_disbursed_masked?: string;
  compensation_amount_pending_masked?: string;
  next_action_for_landowner: string;
  designated_lao_office: string;
  helpline_number: string;
  last_updated: string;
}
