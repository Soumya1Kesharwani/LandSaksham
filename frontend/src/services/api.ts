import { Project, Parcel, AlternativeRoute, ActionItem, Alert, AuditLog, CitizenTrackingResponse } from '../types';

const getHost = () => (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '127.0.0.1';
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || `http://${getHost()}:8000/api`;


// Realistic fallback state when backend API is starting up or in standalone preview
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "jaipur-ajmer-nh48",
    name: "Jaipur–Ajmer Integrated Highway Expansion (NH-48 Corridor)",
    code: "NH-48-EXP-RJ",
    type: "Highway / Expressway",
    authority: "National Highways Authority of India (NHAI) - PIU Jaipur",
    state: "Rajasthan",
    districts: ["Jaipur", "Ajmer", "Beawar", "Dudu"],
    start_date: "2024-11-15",
    target_completion_date: "2027-03-31",
    revised_completion_date: "2027-11-30",
    length_km: 135.0,
    total_cost_cr: 3420.0,
    total_land_required_acres: 1740.0,
    government_land_acres: 620.0,
    private_land_acres: 940.0,
    forest_land_acres: 180.0,
    agricultural_land_acres: 710.0,
    commercial_residential_acres: 230.0,
    total_parcels_count: 342,
    high_risk_parcels_count: 42,
    total_landowners_count: 1480,
    compensation_total_cr: 184.5,
    compensation_paid_cr: 126.2,
    compensation_pending_cr: 58.3,
    active_court_cases_count: 11,
    stay_orders_count: 4,
    environmental_flags_count: 7,
    rr_cases_count: 198,
    overall_delay_risk_score: 71,
    overall_delay_risk_level: "HIGH",
    overall_delay_probability: 0.71,
    expected_delay_days: 185,
    overall_readiness_score: 59,
    readiness_breakdown: {
      land: 64,
      legal: 48,
      compensation: 68,
      environment: 52,
      rr: 58,
      documents: 65
    },
    employment: {
      direct_construction_jobs: 8500,
      indirect_supply_chain_jobs: 21000,
      operational_maintenance_jobs: 1200,
      total_estimated_jobs: 30700,
      local_worker_absorption_pct: 68.5,
      construction_phase_months: 36,
      key_employment_trades: ["Civil Construction Workers", "Heavy Equipment Operators", "Surveyors", "Safety Engineers", "Material Logistics Staff"],
      assumptions_note: "AI Indicative Estimate based on NHAI standard labor absorption co-efficient."
    },
    economic: {
      avg_travel_time_reduction_pct: 18.4,
      freight_movement_efficiency_gain_pct: 24.0,
      villages_newly_connected: 34,
      districts_directly_linked: 4,
      estimated_local_gdp_boost_cr: 480.0,
      key_beneficiary_sectors: ["Textile (Kishangarh)", "Marble & Granite Logistics", "Agri-markets (Dudu/Phagi Mandis)", "Tourism Corridor"],
      assumptions_note: "Indicative macro-economic simulation derived from transport elasticity model."
    },
    description: "6-lane to 8-lane expressway upgradation with 3 major bypasses to alleviate heavy freight bottlenecks along the Golden Quadrilateral.",
    status: "In Acquisition / At Delay Risk"
  },
  {
    id: "delhi-varanasi-hsr",
    name: "Delhi–Varanasi High Speed Rail Corridor (Bullet Train Sector)",
    code: "DV-HSR-01",
    type: "High Speed Railway",
    authority: "National High Speed Rail Corporation Limited (NHSRCL)",
    state: "Uttar Pradesh / Delhi",
    districts: ["Gautam Buddha Nagar", "Aligarh", "Agra", "Kanpur", "Prayagraj", "Varanasi"],
    start_date: "2025-01-10",
    target_completion_date: "2029-12-31",
    length_km: 865.0,
    total_cost_cr: 121000.0,
    total_land_required_acres: 4200.0,
    government_land_acres: 1450.0,
    private_land_acres: 2400.0,
    forest_land_acres: 350.0,
    agricultural_land_acres: 2100.0,
    commercial_residential_acres: 300.0,
    total_parcels_count: 820,
    high_risk_parcels_count: 68,
    total_landowners_count: 4100,
    compensation_total_cr: 1420.0,
    compensation_paid_cr: 840.0,
    compensation_pending_cr: 580.0,
    active_court_cases_count: 24,
    stay_orders_count: 6,
    environmental_flags_count: 12,
    rr_cases_count: 450,
    overall_delay_risk_score: 48,
    overall_delay_risk_level: "MEDIUM",
    overall_delay_probability: 0.48,
    expected_delay_days: 95,
    overall_readiness_score: 72,
    readiness_breakdown: {
      land: 76,
      legal: 62,
      compensation: 74,
      environment: 80,
      rr: 66,
      documents: 74
    },
    employment: {
      direct_construction_jobs: 24000,
      indirect_supply_chain_jobs: 65000,
      operational_maintenance_jobs: 6200,
      total_estimated_jobs: 95200,
      local_worker_absorption_pct: 62.0,
      construction_phase_months: 60,
      key_employment_trades: ["Track Engineers", "Electrical OHE Specialists", "TBM Operators", "Station Architects"],
      assumptions_note: "Indicative estimate based on HSR Infrastructure Benchmark."
    },
    economic: {
      avg_travel_time_reduction_pct: 68.0,
      freight_movement_efficiency_gain_pct: 0.0,
      villages_newly_connected: 18,
      districts_directly_linked: 12,
      estimated_local_gdp_boost_cr: 3800.0,
      key_beneficiary_sectors: ["Tourism", "Service Sector", "Smart Logistics Hubs"],
      assumptions_note: "High-Speed Passenger Connectivity Elasticity Model."
    },
    description: "865 km bullet train corridor connecting Delhi to Varanasi via Ayodhya and Lucknow.",
    status: "Pre-Construction"
  },
  {
    id: "mumbai-goa-greenfield",
    name: "Konkan Coastal Greenfield Expressway (Mumbai–Sindhudurg–Goa)",
    code: "MGE-MH-04",
    type: "Coastal Expressway",
    authority: "Maharashtra State Road Development Corporation (MSRDC)",
    state: "Maharashtra",
    districts: ["Raigad", "Ratnagiri", "Sindhudurg"],
    start_date: "2024-06-01",
    target_completion_date: "2028-06-30",
    length_km: 470.0,
    total_cost_cr: 15800.0,
    total_land_required_acres: 2850.0,
    government_land_acres: 580.0,
    private_land_acres: 1620.0,
    forest_land_acres: 650.0,
    agricultural_land_acres: 1100.0,
    commercial_residential_acres: 520.0,
    total_parcels_count: 510,
    high_risk_parcels_count: 84,
    total_landowners_count: 2300,
    compensation_total_cr: 480.0,
    compensation_paid_cr: 210.0,
    compensation_pending_cr: 270.0,
    active_court_cases_count: 32,
    stay_orders_count: 9,
    environmental_flags_count: 19,
    rr_cases_count: 310,
    overall_delay_risk_score: 64,
    overall_delay_risk_level: "HIGH",
    overall_delay_probability: 0.64,
    expected_delay_days: 160,
    overall_readiness_score: 54,
    readiness_breakdown: {
      land: 58,
      legal: 42,
      compensation: 56,
      environment: 44,
      rr: 52,
      documents: 70
    },
    employment: {
      direct_construction_jobs: 12000,
      indirect_supply_chain_jobs: 31000,
      operational_maintenance_jobs: 1800,
      total_estimated_jobs: 44800,
      local_worker_absorption_pct: 72.0,
      construction_phase_months: 48,
      key_employment_trades: ["Tunnel Engineers", "Bridge Experts", "Marine Environment Technicians"],
      assumptions_note: "CRZ Zone Infrastructure Labor Model."
    },
    economic: {
      avg_travel_time_reduction_pct: 52.0,
      freight_movement_efficiency_gain_pct: 35.0,
      villages_newly_connected: 42,
      districts_directly_linked: 3,
      estimated_local_gdp_boost_cr: 1250.0,
      key_beneficiary_sectors: ["Mango / Cashew Agro-processing", "Coastal Tourism", "Fisheries Cold Storage Logistics"],
      assumptions_note: "CRZ & Tourism Growth Correlation."
    },
    description: "Greenfield access-controlled coastal expressway designed to reduce travel time between Mumbai and Goa to 5.5 hrs.",
    status: "Delayed / Environmental Clearances"
  }
];

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, using local GovTech intelligence dataset:", e);
  }
  return FALLBACK_PROJECTS;
};

export const fetchParcels = async (projectId: string = "jaipur-ajmer-nh48"): Promise<Parcel[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/parcels?project_id=${projectId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback parcels:", e);
  }
  return [];
};

export const FALLBACK_ROUTES: AlternativeRoute[] = [
  {
    route_id: "ROUTE-A",
    route_name: "Route Alignment A (Existing NH-48 Widening & Brownfield Upgrade)",
    description: "Follows strictly existing highway right-of-way through Mahapura, Bagru town, and Kishangarh industrial belt.",
    total_length_km: 135.0,
    total_land_required_acres: 1740.0,
    govt_land_pct: 33.7,
    private_land_pct: 51.1,
    forest_land_pct: 15.2,
    estimated_cost_cr: 3420.0,
    compensation_cost_cr: 184.5,
    affected_households: 1284,
    forest_diverted_acres: 180.0,
    water_crossings: 14,
    legal_risk_score: 78,
    delay_probability: 0.71,
    expected_delay_days: 185,
    project_readiness_score: 59,
    employment_potential_jobs: 29500,
    connectivity_score: 85,
    ai_recommendation_verdict: "High delay risk due to 11 court cases in congested commercial zones of Bagru and Kishangarh, plus heavy residential displacement.",
    is_recommended: false,
    coordinates: [[26.8624, 75.698], [26.812, 75.545], [26.755, 75.312], [26.685, 75.185], [26.578, 74.862], [26.468, 74.68], [26.245, 74.215]]
  },
  {
    route_id: "ROUTE-B",
    route_name: "Route Alignment B (Southern Greenfield Bypass Corridor)",
    description: "Bypasses congested Bagru and Kishangarh urban centers via southern agricultural flatlands; avoids protected Aravalli forest pockets.",
    total_length_km: 141.2,
    total_land_required_acres: 1910.0,
    govt_land_pct: 46.2,
    private_land_pct: 49.8,
    forest_land_pct: 4.0,
    estimated_cost_cr: 3680.0,
    compensation_cost_cr: 198.0,
    affected_households: 412,
    forest_diverted_acres: 35.1,
    water_crossings: 8,
    legal_risk_score: 26,
    delay_probability: 0.31,
    expected_delay_days: 45,
    project_readiness_score: 82,
    employment_potential_jobs: 33200,
    connectivity_score: 92,
    ai_recommendation_verdict: "RECOMMENDED BY AI: Despite ₹260 Cr higher initial civil estimate, Route B reduces delay risk by 40% (saving ~140 days), displaces 68% fewer households, and reduces forest diversion by 80%.",
    is_recommended: true,
    coordinates: [[26.8624, 75.698], [26.785, 75.52], [26.71, 75.28], [26.62, 75.11], [26.51, 74.81], [26.41, 74.62], [26.23, 74.19]]
  },
  {
    route_id: "ROUTE-C",
    route_name: "Route Alignment C (Northern Dedicated Freight Rail Adjacent Route)",
    description: "Parallel to DFC / Western Railway tracks on northern alignment.",
    total_length_km: 138.5,
    total_land_required_acres: 1780.0,
    govt_land_pct: 52.0,
    private_land_pct: 38.0,
    forest_land_pct: 10.0,
    estimated_cost_cr: 3550.0,
    compensation_cost_cr: 165.0,
    affected_households: 820,
    forest_diverted_acres: 93.9,
    water_crossings: 11,
    legal_risk_score: 54,
    delay_probability: 0.58,
    expected_delay_days: 110,
    project_readiness_score: 68,
    employment_potential_jobs: 28000,
    connectivity_score: 78,
    ai_recommendation_verdict: "Moderate delay risk: Railway safety boundary clearances and 6 major ROB (Overbridge) inter-agency approvals required from Ministry of Railways.",
    is_recommended: false,
    coordinates: [[26.8624, 75.698], [26.84, 75.58], [26.79, 75.35], [26.72, 75.2], [26.61, 74.89], [26.49, 74.71], [26.26, 74.24]]
  }
];

export const fetchRoutes = async (projectId: string = "jaipur-ajmer-nh48"): Promise<AlternativeRoute[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/routes/${projectId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback routes:", e);
  }
  return FALLBACK_ROUTES;
};

export const fetchActionItems = async (projectId?: string): Promise<ActionItem[]> => {
  try {
    const url = projectId ? `${API_BASE_URL}/actions?project_id=${projectId}` : `${API_BASE_URL}/actions`;
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback actions:", e);
  }
  return [];
};

export const updateActionStatus = async (actionId: string, newStatus: string, userName: string, userRole: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/actions/${actionId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_status: newStatus, user_name: userName, user_role: userRole })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Failed to update status on server:", e);
  }
  return null;
};

export const askCopilot = async (query: string, projectId: string = "jaipur-ajmer-nh48", language: string = "en") => {
  try {
    const res = await fetch(`${API_BASE_URL}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, project_id: projectId, language })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Copilot API fallback:", e);
  }
  return {
    query,
    answer: "The platform connects land, legal, compensation and environmental data into one proactive intelligence layer. (Backend offline)",
    citations: ["NLIIS Intelligence System"],
    language,
    confidence_score: 0.95,
    disclaimer: "AI Decision Support Output — For official review."
  };
};

export const trackCitizenParcel = async (query: string): Promise<CitizenTrackingResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/citizen/track/${encodeURIComponent(query)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Citizen tracking API fallback:", e);
  }
  return null;
};

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/audit`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Audit logs API fallback:", e);
  }
  return [];
};
