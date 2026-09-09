"""
Comprehensive Mock Data Provider for National Land & Infrastructure Intelligence System (NLIIS).
Provides realistic, high-fidelity Indian infrastructure and land acquisition datasets for demonstration.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.schemas import (
    Project, Parcel, Landowner, CourtCase, CompensationDetail, EnvironmentalFlag,
    SocialImpactDetail, AlternativeRoute, EmploymentImpact, RegionalEconomicImpact,
    ActionItem, Alert, AuditLog, CitizenTrackingResponse, RiskLevel, LandType,
    AcquisitionStatus, LegalCaseStatus, ActionPriority, ActionStatus, DepartmentType,
    RiskFactor
)
from app.providers.base import BaseProjectDataProvider

class MockDataProvider(BaseProjectDataProvider):
    """Singleton-ready mock data store loaded with realistic Indian infrastructure intelligence."""

    def __init__(self):
        self.projects: Dict[str, Project] = {}
        self.parcels: Dict[str, List[Parcel]] = {}
        self.routes: Dict[str, List[AlternativeRoute]] = {}
        self.action_items: List[ActionItem] = []
        self.alerts: List[Alert] = []
        self.audit_logs: List[AuditLog] = []
        self._initialize_mock_data()

    def _initialize_mock_data(self):
        # 1. Flagship Project: Jaipur–Ajmer Integrated Highway Expansion
        p1 = Project(
            id="jaipur-ajmer-nh48",
            name="Jaipur–Ajmer Integrated Highway Expansion (NH-48 Corridor)",
            code="NH-48-EXP-RJ",
            type="Highway / Expressway",
            authority="National Highways Authority of India (NHAI) - PIU Jaipur",
            state="Rajasthan",
            districts=["Jaipur", "Ajmer", "Beawar", "Dudu"],
            start_date="2024-11-15",
            target_completion_date="2027-03-31",
            revised_completion_date="2027-11-30",
            length_km=135.0,
            total_cost_cr=3420.0,
            total_land_required_acres=1840.0,
            government_land_acres=620.0,
            private_land_acres=940.0,
            forest_land_acres=180.0,
            agricultural_land_acres=710.0,
            commercial_residential_acres=230.0,
            total_parcels_count=342,
            high_risk_parcels_count=42,
            total_landowners_count=1480,
            compensation_total_cr=184.5,
            compensation_paid_cr=126.2,
            compensation_pending_cr=58.3,
            active_court_cases_count=11,
            stay_orders_count=4,
            environmental_flags_count=7,
            rr_cases_count=198,
            overall_delay_risk_score=71,
            overall_delay_risk_level=RiskLevel.HIGH,
            overall_delay_probability=0.71,
            expected_delay_days=185,
            overall_readiness_score=59,
            readiness_breakdown={
                "land": 64,
                "legal": 48,
                "compensation": 68,
                "environment": 52,
                "rr": 58,
                "documents": 65
            },
            employment=EmploymentImpact(
                direct_construction_jobs=8500,
                indirect_supply_chain_jobs=21000,
                operational_maintenance_jobs=1200,
                total_estimated_jobs=30700,
                local_worker_absorption_pct=68.5,
                construction_phase_months=36,
                key_employment_trades=["Civil Construction Workers", "Heavy Equipment Operators", "Surveyors", "Safety Engineers", "Material Logistics Staff"],
                assumptions_note="AI Indicative Estimate based on NHAI standard labor absorption co-efficient of 62.9 jobs per km."
            ),
            economic=RegionalEconomicImpact(
                avg_travel_time_reduction_pct=18.4,
                freight_movement_efficiency_gain_pct=24.0,
                villages_newly_connected=34,
                districts_directly_linked=4,
                estimated_local_gdp_boost_cr=480.0,
                key_beneficiary_sectors=["Textile (Kishangarh)", "Marble & Granite Logistics", "Agri-markets (Dudu/Phagi Mandis)", "Tourism Corridor"],
                assumptions_note="Indicative macro-economic simulation derived from transport elasticity model."
            ),
            description="6-lane to 8-lane expressway upgradation with 3 major bypasses (Dudu, Kishangarh, Ajmer South) to alleviate heavy freight bottlenecks along the Golden Quadrilateral.",
            status="In Acquisition / At Delay Risk"
        )
        self.projects[p1.id] = p1

        # 2. Delhi-Varanasi High Speed Rail
        p2 = Project(
            id="delhi-varanasi-hsr",
            name="Delhi–Varanasi High Speed Rail Corridor (Bullet Train Sector)",
            code="DV-HSR-01",
            type="High Speed Railway",
            authority="National High Speed Rail Corporation Limited (NHSRCL)",
            state="Uttar Pradesh / Delhi",
            districts=["Gautam Buddha Nagar", "Aligarh", "Agra", "Kanpur", "Prayagraj", "Varanasi"],
            start_date="2025-01-10",
            target_completion_date="2029-12-31",
            length_km=865.0,
            total_cost_cr=121000.0,
            total_land_required_acres=4200.0,
            government_land_acres=1450.0,
            private_land_acres=2400.0,
            forest_land_acres=350.0,
            agricultural_land_acres=2100.0,
            commercial_residential_acres=300.0,
            total_parcels_count=820,
            high_risk_parcels_count=68,
            total_landowners_count=4100,
            compensation_total_cr=1420.0,
            compensation_paid_cr=840.0,
            compensation_pending_cr=580.0,
            active_court_cases_count=24,
            stay_orders_count=6,
            environmental_flags_count=12,
            rr_cases_count=450,
            overall_delay_risk_score=48,
            overall_delay_risk_level=RiskLevel.MEDIUM,
            overall_delay_probability=0.48,
            expected_delay_days=95,
            overall_readiness_score=72,
            readiness_breakdown={
                "land": 76,
                "legal": 62,
                "compensation": 74,
                "environment": 80,
                "rr": 66,
                "documents": 74
            },
            employment=EmploymentImpact(
                direct_construction_jobs=24000,
                indirect_supply_chain_jobs=65000,
                operational_maintenance_jobs=6200,
                total_estimated_jobs=95200,
                local_worker_absorption_pct=62.0,
                construction_phase_months=60,
                key_employment_trades=["Track Engineers", "Electrical OHE Specialists", "TBM Operators", "Station Architects"],
                assumptions_note="Indicative estimate based on HSR Infrastructure Benchmark."
            ),
            economic=RegionalEconomicImpact(
                avg_travel_time_reduction_pct=68.0,
                freight_movement_efficiency_gain_pct=0.0,
                villages_newly_connected=18,
                districts_directly_linked=12,
                estimated_local_gdp_boost_cr=3800.0,
                key_beneficiary_sectors=["Tourism", "Service Sector", "Smart Logistics Hubs"],
                assumptions_note="High-Speed Passenger Connectivity Elasticity Model."
            ),
            description="865 km bullet train corridor connecting Delhi to Varanasi via Ayodhya and Lucknow.",
            status="Pre-Construction"
        )
        self.projects[p2.id] = p2

        # 3. Mumbai–Goa Coastal Greenfield Expressway
        p3 = Project(
            id="mumbai-goa-greenfield",
            name="Konkan Coastal Greenfield Expressway (Mumbai–Sindhudurg–Goa)",
            code="MGE-MH-04",
            type="Coastal Expressway",
            authority="Maharashtra State Road Development Corporation (MSRDC)",
            state="Maharashtra",
            districts=["Raigad", "Ratnagiri", "Sindhudurg"],
            start_date="2024-06-01",
            target_completion_date="2028-06-30",
            length_km=470.0,
            total_cost_cr=15800.0,
            total_land_required_acres=2850.0,
            government_land_acres=580.0,
            private_land_acres=1620.0,
            forest_land_acres=650.0,
            agricultural_land_acres=1100.0,
            commercial_residential_acres=520.0,
            total_parcels_count=510,
            high_risk_parcels_count=84,
            total_landowners_count=2300,
            compensation_total_cr=480.0,
            compensation_paid_cr=210.0,
            compensation_pending_cr=270.0,
            active_court_cases_count=32,
            stay_orders_count=9,
            environmental_flags_count=19,
            rr_cases_count=310,
            overall_delay_risk_score=64,
            overall_delay_risk_level=RiskLevel.HIGH,
            overall_delay_probability=0.64,
            expected_delay_days=160,
            overall_readiness_score=54,
            readiness_breakdown={
                "land": 58,
                "legal": 42,
                "compensation": 56,
                "environment": 44,
                "rr": 52,
                "documents": 70
            },
            employment=EmploymentImpact(
                direct_construction_jobs=12000,
                indirect_supply_chain_jobs=31000,
                operational_maintenance_jobs=1800,
                total_estimated_jobs=44800,
                local_worker_absorption_pct=72.0,
                construction_phase_months=48,
                key_employment_trades=["Tunnel Engineers", "Bridge Experts", "Marine Environment Technicians"],
                assumptions_note="CRZ Zone Infrastructure Labor Model."
            ),
            economic=RegionalEconomicImpact(
                avg_travel_time_reduction_pct=52.0,
                freight_movement_efficiency_gain_pct=35.0,
                villages_newly_connected=42,
                districts_directly_linked=3,
                estimated_local_gdp_boost_cr=1250.0,
                key_beneficiary_sectors=["Mango / Cashew Agro-processing", "Coastal Tourism", "Fisheries Cold Storage Logistics"],
                assumptions_note="CRZ & Tourism Growth Correlation."
            ),
            description="Greenfield access-controlled coastal expressway designed to bypass hilly ghats and reduce travel time between Mumbai and Goa from 11 hrs to 5.5 hrs.",
            status="Delayed / Environmental Clearances"
        )
        self.projects[p3.id] = p3

        # Populate Flagship Project Parcels (Jaipur-Ajmer NH-48)
        self._populate_jaipur_ajmer_parcels()
        self._populate_alternative_routes()
        self._populate_action_items()
        self._populate_alerts()
        self._populate_audit_logs()

    def _populate_jaipur_ajmer_parcels(self):
        parcels_list: List[Parcel] = []

        # Key Flagship High-Risk Parcel P127
        p127 = Parcel(
            id="RJ-JPR-P127",
            khasra_survey_no="142/1",
            village="Mahapura",
            gram_panchayat="Mahapura",
            tehsil="Sanganer",
            district="Jaipur",
            state="Rajasthan",
            area_acres=2.45,
            land_type=LandType.PRIVATE_AGRICULTURAL,
            owner=Landowner(
                id="LO-8921",
                name="Rameshwar Prasad Sharma",
                relation="S/o",
                father_or_spouse_name="Late Kishan Lal Sharma",
                contact_masked="+91 98290 *****",
                address="Ward No. 4, Village Mahapura, Tehsil Sanganer, Jaipur",
                bank_account_verified=False,
                aadhaar_seeded=True,
                pan_available=True,
                share_percentage=60.0
            ),
            co_owners_count=2,
            acquisition_status=AcquisitionStatus.SECTION_19_DECLARATION,
            possession_percentage=35.0,
            mutation_status="Mutation Pending (Succession / Title Mismatch in Jamabandi)",
            delay_risk_score=87,
            delay_risk_level=RiskLevel.CRITICAL,
            delay_probability=0.87,
            expected_delay_days=220,
            readiness_score=42,
            top_risk_factors=[
                RiskFactor(factor_name="Active Stay Order in High Court", importance_score=0.34, description="Interim stay granted in Writ Petition WP(C) 8492/2025 regarding compensation valuation parity.", impact_days=110, severity=RiskLevel.CRITICAL),
                RiskFactor(factor_name="Revenue Mutation Mismatch", importance_score=0.26, description="Jamabandi RoR lists deceased ancestor; 2 co-heirs haven't completed formal partition mutation.", impact_days=55, severity=RiskLevel.HIGH),
                RiskFactor(factor_name="Compensation Disbursement Pending", importance_score=0.21, description="Bank account IFSC discrepancy caused escrow hold of ₹1.45 Cr solatium component.", impact_days=35, severity=RiskLevel.HIGH),
                RiskFactor(factor_name="Missing Indemnity Bond Document", importance_score=0.12, description="Form 12-B statutory title clearance pending at Sub-Registrar.", impact_days=20, severity=RiskLevel.MEDIUM)
            ],
            compensation=CompensationDetail(
                parcel_id="RJ-JPR-P127",
                land_market_value_inr=7350000.0,
                multiplier_factor=1.25,
                base_land_value_inr=9187500.0,
                solatium_100_pct_inr=9187500.0,
                additional_interest_12_pct_inr=1102500.0,
                crop_compensation_inr=320000.0,
                structure_compensation_inr=850000.0,
                tree_compensation_inr=120000.0,
                rehabilitation_resettlement_grant_inr=500000.0,
                total_estimated_compensation_inr=21267500.0,  # ~2.12 Cr
                amount_disbursed_inr=6750000.0,
                amount_pending_inr=14517500.0,
                disbursement_percentage=31.7,
                payment_status="Disputed in Court & Mutation Hold",
                escrow_deposited=True
            ),
            legal_case=CourtCase(
                id="CASE-RJ-HC-8492",
                case_number="WP(C) 8492/2025",
                court_name="High Court of Judicature for Rajasthan at Jaipur Bench",
                case_type="Writ Petition (Civil) - Land Acquisition Compensation Parity",
                petitioner="Rameshwar Prasad Sharma & 2 Others",
                respondent="State of Rajasthan & NHAI Project Director Jaipur",
                filing_date="2025-03-12",
                last_hearing_date="2026-08-14",
                next_hearing_date="2026-09-24",
                last_order_summary="Hon'ble Court directed maintenance of status quo on physical possession until Tehsildar files revenue mutation verification affidavit.",
                status=LegalCaseStatus.INTERIM_STAY_GRANTED,
                has_stay_order=True,
                stay_order_details="Status quo order dated 14-Aug-2026 on physical possession pending valuation clarification.",
                ai_risk_assessment="High risk of project stalling: physical possession barred. Urgently requires Additional Advocate General (AAG) application for stay vacation along with updated RFCTLARR market calculation affidavit.",
                recommended_legal_action="1. Tehsildar Sanganer to expedite Jamabandi succession mutation.\n2. Submit joint compensation compromise petition under Section 76 of 2013 Act."
            ),
            environmental=EnvironmentalFlag(
                parcel_id="RJ-JPR-P127",
                overlaps_forest=False,
                forest_diversion_area_ha=0.0,
                in_eco_sensitive_zone=False,
                wildlife_corridor_proximity_km=14.5,
                waterbody_overlap=False,
                statutory_clearance_stage="Exempt / Non-Forest",
                clearance_days_pending=0,
                environmental_risk_level=RiskLevel.LOW
            ),
            social_impact=SocialImpactDetail(
                parcel_id="RJ-JPR-P127",
                affected_households=3,
                potentially_displaced_persons=8,
                agricultural_laborers_dependent=4,
                is_vulnerable_category=False,
                structure_type="Tube well pump room & Boundary Wall",
                rr_entitlement_status="Identified",
                resettlement_site="NA (Agricultural only)"
            ),
            recommended_action="Expedite Jamabandi succession mutation at Tehsildar office, re-validate Aadhaar-linked Bank account for escrow disbursement, and file stay vacation plea at High Court.",
            recommended_action_priority=ActionPriority.CRITICAL,
            lat=26.8624,
            lng=75.6980,
            polygon_coordinates=[
                [26.8618, 75.6972], [26.8632, 75.6975],
                [26.8628, 75.6990], [26.8615, 75.6985]
            ],
            document_verified_count=3,
            document_missing_count=2,
            last_updated="2026-09-08T16:30:00+05:30"
        )
        parcels_list.append(p127)

        # Additional rich parcels across Jaipur-Ajmer Corridor
        parcels_data = [
            ("RJ-JPR-P104", "88/2", "Mahapura", "Sanganer", "Jaipur", 1.80, LandType.PRIVATE_AGRICULTURAL, "Gopal Singh Shekhawat", 12, RiskLevel.LOW, 0.12, 15, 92, 14500000.0, 14500000.0, 0.0, "Fully Paid", AcquisitionStatus.POSSESSION_TAKEN, 26.8650, 75.6950, False, "Possession complete, ready for civil work."),
            ("RJ-JPR-P112", "102/4", "Bagru", "Sanganer", "Jaipur", 3.20, LandType.PRIVATE_COMMERCIAL, "Choudhary Warehousing LLP", 74, RiskLevel.HIGH, 0.74, 140, 52, 42000000.0, 18000000.0, 24000000.0, "Partially Paid", AcquisitionStatus.AWARD_ANNOUNCED, 26.8120, 75.5450, True, "Commercial structure valuation dispute pending in District Tribunal."),
            ("RJ-JPR-P135", "19/A", "Gadota", "Dudu", "Dudu", 4.10, LandType.GOVERNMENT, "State Revenue Dept (GoR)", 8, RiskLevel.LOW, 0.08, 0, 98, 0.0, 0.0, 0.0, "Govt Transfer Completed", AcquisitionStatus.POSSESSION_TAKEN, 26.7550, 75.3120, False, "Inter-departmental land transfer NOC issued."),
            ("RJ-DUD-P201", "204/1", "Mokhampura", "Dudu", "Dudu", 2.90, LandType.FOREST, "Rajasthan Forest Department", 82, RiskLevel.CRITICAL, 0.82, 195, 45, 8500000.0, 0.0, 8500000.0, "Pending Stage-II", AcquisitionStatus.SECTION_11_PRELIMINARY, 26.6850, 75.1850, False, "Parivesh Forest Stage-II tree felling clearance pending since 48 days."),
            ("RJ-DUD-P218", "311/2", "Padasoli", "Dudu", "Dudu", 1.50, LandType.COMMUNITY_GRAZING, "Gram Panchayat Padasoli (Gauchar)", 62, RiskLevel.MEDIUM, 0.62, 90, 60, 4800000.0, 1200000.0, 3600000.0, "Alternative Land Identification", AcquisitionStatus.SECTION_19_DECLARATION, 26.6320, 75.0540, False, "Collector to notify equal compensatory Gauchar grazing land parcel."),
            ("RJ-AJM-P301", "45/3", "Kishangarh Rural", "Kishangarh", "Ajmer", 2.10, LandType.PRIVATE_AGRICULTURAL, "Bhanwar Lal Gurjar", 38, RiskLevel.MEDIUM, 0.38, 45, 78, 18500000.0, 14000000.0, 4500000.0, "Partially Paid", AcquisitionStatus.COMPENSATION_DISBURSED, 26.5780, 74.8620, False, "Final solatium installment awaiting signature."),
            ("RJ-AJM-P314", "112/1", "Silora", "Kishangarh", "Ajmer", 5.60, LandType.PRIVATE_COMMERCIAL, "Marble Industrial Association", 79, RiskLevel.HIGH, 0.79, 160, 49, 58000000.0, 20000000.0, 38000000.0, "Tribunal Appeal", AcquisitionStatus.AWARD_ANNOUNCED, 26.5410, 74.8150, True, "Industrial relocation compensation challenge at Ajmer Commissioner court."),
            ("RJ-AJM-P340", "9/B", "Gegal", "Ajmer", "Ajmer", 1.20, LandType.PRIVATE_RESIDENTIAL, "Kailash Chand Verma", 15, RiskLevel.LOW, 0.15, 10, 94, 9200000.0, 9200000.0, 0.0, "Fully Paid", AcquisitionStatus.POSSESSION_TAKEN, 26.5020, 74.7210, False, "R&R housing grant disbursed."),
            ("RJ-AJM-P355", "78/4", "Palra", "Ajmer", "Ajmer", 3.80, LandType.WATER_BODY, "Irrigation Dept / Catchment", 85, RiskLevel.CRITICAL, 0.85, 210, 38, 1200000.0, 0.0, 1200000.0, "Hydrology NOC Pending", AcquisitionStatus.SECTION_11_PRELIMINARY, 26.4680, 74.6800, False, "Water catchment drain diversion redesign pending at Central Water Commission."),
            ("RJ-BEA-P402", "15/1", "Kharwa", "Beawar", "Beawar", 2.30, LandType.PRIVATE_AGRICULTURAL, "Devi Singh Rathore", 22, RiskLevel.LOW, 0.22, 20, 88, 11500000.0, 11500000.0, 0.0, "Fully Paid", AcquisitionStatus.POSSESSION_TAKEN, 26.3120, 74.3950, False, "Possession granted without encumbrance."),
            ("RJ-BEA-P415", "62/2", "Sendra", "Beawar", "Beawar", 4.50, LandType.FOREST, "Aravalli Protected Forest", 91, RiskLevel.CRITICAL, 0.91, 240, 32, 16000000.0, 0.0, 16000000.0, "Stage-I Scrutiny Pending", AcquisitionStatus.SECTION_4_NOTIFIED, 26.2450, 74.2150, False, "Eco-sensitive Aravalli Ridge forest clearance requires wildlife mitigation underpass approval.")
        ]

        for pid, khasra, vil, teh, dist, area, ltype, owner_name, risk_score, rlevel, delay_prob, delay_days, readiness, comp_total, comp_paid, comp_pending, pay_stat, acq_stat, lat, lng, has_court, action_text in parcels_data:
            case_obj = None
            if has_court:
                case_obj = CourtCase(
                    id=f"CASE-{pid}",
                    case_number=f"LAR {pid[-3:]}/2025",
                    court_name="District Land Acquisition Tribunal / Commercial Court",
                    case_type="Section 64 Reference - Valuation Enhancement",
                    petitioner=owner_name,
                    respondent=f"LAO {dist} & NHAI",
                    filing_date="2025-05-18",
                    last_hearing_date="2026-08-20",
                    next_hearing_date="2026-09-28",
                    last_order_summary="Notice issued for joint site measurement report by PWD valuer.",
                    status=LegalCaseStatus.NOTICE_ISSUED,
                    has_stay_order=False,
                    ai_risk_assessment="Valuation dispute. Possession can proceed if 80% compensation is deposited into court registry under Section 77(2).",
                    recommended_legal_action="Deposit disputed differential sum in court escrow to obtain immediate physical possession."
                )

            parcels_list.append(Parcel(
                id=pid,
                khasra_survey_no=khasra,
                village=vil,
                gram_panchayat=vil,
                tehsil=teh,
                district=dist,
                state="Rajasthan",
                area_acres=area,
                land_type=ltype,
                owner=Landowner(
                    id=f"LO-{pid[-3:]}",
                    name=owner_name,
                    relation="S/o",
                    father_or_spouse_name="Resident Representative",
                    contact_masked="+91 94140 *****",
                    address=f"Village {vil}, Tehsil {teh}, {dist}",
                    bank_account_verified=(pay_stat == "Fully Paid"),
                    aadhaar_seeded=True,
                    pan_available=True
                ),
                acquisition_status=acq_stat,
                possession_percentage=100.0 if acq_stat == AcquisitionStatus.POSSESSION_TAKEN else (50.0 if acq_stat == AcquisitionStatus.COMPENSATION_DISBURSED else 20.0),
                mutation_status="Verified" if pay_stat == "Fully Paid" else "In Verification",
                delay_risk_score=risk_score,
                delay_risk_level=rlevel,
                delay_probability=delay_prob,
                expected_delay_days=delay_days,
                readiness_score=readiness,
                top_risk_factors=[
                    RiskFactor(factor_name="Compensation Pendency" if comp_pending > 0 else "Stage Progression", importance_score=0.28, description=f"₹{comp_pending/10000000:.2f} Cr pending disbursement", impact_days=delay_days // 2, severity=rlevel)
                ],
                compensation=CompensationDetail(
                    parcel_id=pid,
                    land_market_value_inr=comp_total * 0.45,
                    multiplier_factor=1.2,
                    base_land_value_inr=comp_total * 0.5,
                    solatium_100_pct_inr=comp_total * 0.5,
                    additional_interest_12_pct_inr=comp_total * 0.05,
                    crop_compensation_inr=150000.0,
                    structure_compensation_inr=350000.0,
                    tree_compensation_inr=50000.0,
                    total_estimated_compensation_inr=comp_total,
                    amount_disbursed_inr=comp_paid,
                    amount_pending_inr=comp_pending,
                    disbursement_percentage=(comp_paid / comp_total * 100) if comp_total > 0 else 100.0,
                    payment_status=pay_stat,
                    escrow_deposited=True
                ),
                legal_case=case_obj,
                environmental=EnvironmentalFlag(
                    parcel_id=pid,
                    overlaps_forest=(ltype == LandType.FOREST),
                    forest_diversion_area_ha=area * 0.404 if ltype == LandType.FOREST else 0.0,
                    in_eco_sensitive_zone=(ltype == LandType.FOREST or ltype == LandType.WATER_BODY),
                    wildlife_corridor_proximity_km=8.0 if ltype == LandType.FOREST else 25.0,
                    waterbody_overlap=(ltype == LandType.WATER_BODY),
                    statutory_clearance_stage="Stage-I Applied" if ltype == LandType.FOREST else "Clear",
                    clearance_days_pending=48 if ltype == LandType.FOREST else 0,
                    environmental_risk_level=rlevel if ltype in [LandType.FOREST, LandType.WATER_BODY] else RiskLevel.LOW
                ),
                social_impact=SocialImpactDetail(
                    parcel_id=pid,
                    affected_households=4 if area > 3 else 1,
                    potentially_displaced_persons=12 if area > 3 else 4,
                    agricultural_laborers_dependent=3,
                    is_vulnerable_category=(pid == "RJ-AJM-P340"),
                    structure_type="Residential / Agri" if area > 2 else "None",
                    rr_entitlement_status="Sanctioned" if pay_stat == "Fully Paid" else "Under Survey"
                ),
                recommended_action=action_text,
                recommended_action_priority=ActionPriority.HIGH if rlevel in [RiskLevel.CRITICAL, RiskLevel.HIGH] else ActionPriority.LOW,
                lat=lat,
                lng=lng,
                polygon_coordinates=[
                    [lat - 0.001, lng - 0.001], [lat + 0.001, lng - 0.001],
                    [lat + 0.001, lng + 0.001], [lat - 0.001, lng + 0.001]
                ],
                document_verified_count=4 if pay_stat == "Fully Paid" else 2,
                document_missing_count=0 if pay_stat == "Fully Paid" else 2,
                last_updated="2026-09-08T15:00:00+05:30"
            ))

        self.parcels["jaipur-ajmer-nh48"] = parcels_list

    def _populate_alternative_routes(self):
        self.routes["jaipur-ajmer-nh48"] = [
            AlternativeRoute(
                route_id="ROUTE-A",
                route_name="Route Alignment A (Existing NH-48 Widening & Brownfield Upgrade)",
                description="Follows strictly existing highway right-of-way through Mahapura, Bagru town, and Kishangarh industrial belt.",
                total_length_km=135.0,
                total_land_required_acres=1840.0,
                govt_land_pct=33.7,
                private_land_pct=51.1,
                forest_land_pct=15.2,
                estimated_cost_cr=3420.0,
                compensation_cost_cr=184.5,
                affected_households=1284,
                forest_diverted_ha=72.8,
                water_crossings=14,
                legal_risk_score=78,
                delay_probability=0.71,
                expected_delay_days=185,
                project_readiness_score=59,
                employment_potential_jobs=29500,
                connectivity_score=85,
                ai_recommendation_verdict="High delay risk due to 11 court cases in congested commercial zones of Bagru and Kishangarh, plus heavy residential displacement.",
                is_recommended=False,
                coordinates=[[26.8624, 75.6980], [26.8120, 75.5450], [26.7550, 75.3120], [26.6850, 75.1850], [26.5780, 74.8620], [26.4680, 74.6800], [26.2450, 74.2150]]
            ),
            AlternativeRoute(
                route_id="ROUTE-B",
                route_name="Route Alignment B (Southern Greenfield Bypass Corridor)",
                description="Bypasses congested Bagru and Kishangarh urban centers via southern agricultural flatlands; avoids protected Aravalli forest pockets.",
                total_length_km=141.2,
                total_land_required_acres=1910.0,
                govt_land_pct=46.2,
                private_land_pct=49.8,
                forest_land_pct=4.0,
                estimated_cost_cr=3680.0,
                compensation_cost_cr=198.0,
                affected_households=412,
                forest_diverted_ha=14.2,
                water_crossings=8,
                legal_risk_score=26,
                delay_probability=0.31,
                expected_delay_days=45,
                project_readiness_score=82,
                employment_potential_jobs=33200,
                connectivity_score=92,
                ai_recommendation_verdict="RECOMMENDED BY AI: Despite ₹260 Cr higher initial civil estimate, Route B reduces delay risk by 40% (saving ~140 days), displaces 68% fewer households, and reduces forest diversion by 80%.",
                is_recommended=True,
                coordinates=[[26.8624, 75.6980], [26.7850, 75.5200], [26.7100, 75.2800], [26.6200, 75.1100], [26.5100, 74.8100], [26.4100, 74.6200], [26.2300, 74.1900]]
            ),
            AlternativeRoute(
                route_id="ROUTE-C",
                route_name="Route Alignment C (Northern Dedicated Freight Rail Adjacent Route)",
                description="Parallel to DFC / Western Railway tracks on northern alignment.",
                total_length_km=138.5,
                total_land_required_acres=1780.0,
                govt_land_pct=52.0,
                private_land_pct=38.0,
                forest_land_pct=10.0,
                estimated_cost_cr=3550.0,
                compensation_cost_cr=165.0,
                affected_households=820,
                forest_diverted_ha=38.0,
                water_crossings=11,
                legal_risk_score=54,
                delay_probability=0.58,
                expected_delay_days=110,
                project_readiness_score=68,
                employment_potential_jobs=28000,
                connectivity_score=78,
                ai_recommendation_verdict="Moderate delay risk: Railway safety boundary clearances and 6 major ROB (Overbridge) inter-agency approvals required from Ministry of Railways.",
                is_recommended=False,
                coordinates=[[26.8624, 75.6980], [26.8400, 75.5800], [26.7900, 75.3500], [26.7200, 75.2000], [26.6100, 74.8900], [26.4900, 74.7100], [26.2600, 74.2400]]
            )
        ]

    def _populate_action_items(self):
        self.action_items = [
            ActionItem(
                id="ACT-001",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-JPR-P127",
                khasra_no="142/1",
                title="Vacate High Court Stay & Resolve Jamabandi Mutation",
                problem_summary="Interim stay granted in WP(C) 8492/2025 due to title mutation mismatch and bank account hold.",
                risk_level=RiskLevel.CRITICAL,
                impact_delay_days=110,
                recommended_action="1. Tehsildar Sanganer to certify succession mutation.\n2. Submit joint compensation compromise petition in High Court.\n3. Disburse escrowed ₹1.45 Cr solatium.",
                responsible_department=DepartmentType.LEGAL,
                assigned_to_role="Legal Officer & LAO Jaipur",
                due_date="2026-09-20",
                status=ActionStatus.IN_PROGRESS,
                created_at="2026-08-15T10:00:00+05:30",
                updated_at="2026-09-08T14:20:00+05:30"
            ),
            ActionItem(
                id="ACT-002",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-DUD-P201",
                khasra_no="204/1",
                title="Accelerate MoEFCC Parivesh Stage-II Forest Approval",
                problem_summary="Stage-II tree felling clearance pending for 48 days at Regional Empowered Committee.",
                risk_level=RiskLevel.CRITICAL,
                impact_delay_days=95,
                recommended_action="Submit Compensatory Afforestation (CA) GPS boundary verification report to DFO Dudu and deposit Net Present Value (NPV) fund into CAMPA account.",
                responsible_department=DepartmentType.FOREST,
                assigned_to_role="Forest Officer / DFO Dudu",
                due_date="2026-09-25",
                status=ActionStatus.ACTION_REQUIRED,
                created_at="2026-08-10T11:30:00+05:30",
                updated_at="2026-09-07T09:15:00+05:30"
            ),
            ActionItem(
                id="ACT-003",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-AJM-P314",
                khasra_no="112/1",
                title="Disburse Section 77(2) Court Escrow for Commercial Parcel",
                problem_summary="Marble Industrial Association tribunal reference on structural relocation valuation.",
                risk_level=RiskLevel.HIGH,
                impact_delay_days=60,
                recommended_action="Deposit 80% determined compensation in District Commercial Court to enable LAO to issue Section 38 possession order.",
                responsible_department=DepartmentType.LAND_ACQUISITION,
                assigned_to_role="Land Acquisition Officer (LAO) Ajmer",
                due_date="2026-09-30",
                status=ActionStatus.UNDER_REVIEW,
                created_at="2026-08-22T14:00:00+05:30",
                updated_at="2026-09-05T16:00:00+05:30"
            ),
            ActionItem(
                id="ACT-004",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-DUD-P218",
                khasra_no="311/2",
                title="Notify Equal Compensatory Gauchar Grazing Land",
                problem_summary="Gram Panchayat resolution required for diversion of 1.5 acres community grazing land.",
                risk_level=RiskLevel.MEDIUM,
                impact_delay_days=30,
                recommended_action="District Collector to issue notification assigning Khasra 405/2 (Revenue Waste Land) as replacement Gauchar land.",
                responsible_department=DepartmentType.REVENUE,
                assigned_to_role="District Magistrate / Collector Jaipur",
                due_date="2026-10-05",
                status=ActionStatus.NEW,
                created_at="2026-09-01T09:00:00+05:30",
                updated_at="2026-09-01T09:00:00+05:30"
            )
        ]

    def _populate_alerts(self):
        self.alerts = [
            Alert(
                id="ALT-101",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-JPR-P127",
                title="Critical Stay Order Active on Parcel P127",
                message="High Court status quo order issued on physical possession. Immediate hearing listing required before 24-Sep-2026.",
                severity=RiskLevel.CRITICAL,
                department=DepartmentType.LEGAL,
                is_read=False,
                created_at="2026-09-08T09:00:00+05:30"
            ),
            Alert(
                id="ALT-102",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-DUD-P201",
                title="Stage-II Forest Clearance Inactivity Alert",
                message="Parivesh application for 2.9 ha Dudu forest division has had no movement for 48 consecutive days.",
                severity=RiskLevel.CRITICAL,
                department=DepartmentType.FOREST,
                is_read=False,
                created_at="2026-09-07T11:45:00+05:30"
            ),
            Alert(
                id="ALT-103",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id="RJ-AJM-P314",
                title="Compensation Pendency > ₹35 Crore in Kishangarh Sector",
                message="Pending commercial structure compensations are creating friction with local marble logistics associations.",
                severity=RiskLevel.HIGH,
                department=DepartmentType.LAND_ACQUISITION,
                is_read=True,
                created_at="2026-09-06T15:20:00+05:30"
            ),
            Alert(
                id="ALT-104",
                project_id="jaipur-ajmer-nh48",
                project_name="Jaipur–Ajmer Integrated Highway Expansion",
                parcel_id=None,
                title="Delay Risk Score Escalation: 42% → 71%",
                message="Overall project delay risk increased to 71% following 4 new court stay applications and delayed forest clearances.",
                severity=RiskLevel.HIGH,
                department=DepartmentType.PROJECT_AUTHORITY,
                is_read=False,
                created_at="2026-09-05T18:00:00+05:30"
            )
        ]

    def _populate_audit_logs(self):
        self.audit_logs = [
            AuditLog(
                id="AUD-901",
                user_name="Rajendra Meena (LAO Jaipur)",
                user_role="Land Acquisition Officer",
                action_type="UPDATE_COMPENSATION_STATUS",
                target_entity="Parcel Compensation",
                target_id="RJ-JPR-P127",
                previous_value="Disbursement: ₹0 (Pending)",
                new_value="Disbursement: ₹67,50,000 (Escrow Deposited)",
                ip_address="10.244.18.92 (NIC GovNet)",
                timestamp="2026-09-08 14:15:22 IST"
            ),
            AuditLog(
                id="AUD-902",
                user_name="Sanjay Sharma (AAG Rajasthan)",
                user_role="Legal Officer",
                action_type="COURT_CASE_STATUS_CHANGE",
                target_entity="Court Litigation Dossier",
                target_id="CASE-RJ-HC-8492",
                previous_value="Status: Petition Filed",
                new_value="Status: Interim Stay Granted (Hearing: 24-Sep-2026)",
                ip_address="10.244.20.14 (NIC GovNet)",
                timestamp="2026-09-07 17:30:10 IST"
            ),
            AuditLog(
                id="AUD-903",
                user_name="Dr. Jitendra Soni, IAS",
                user_role="District Magistrate / Collector",
                action_type="ASSIGN_ACTION_QUEUE",
                target_entity="Action Item",
                target_id="ACT-001",
                previous_value="Assigned: Unassigned",
                new_value="Assigned: Legal Officer & LAO Jaipur (Due: 20-Sep-2026)",
                ip_address="10.244.12.5 (District Collectorate NIC)",
                timestamp="2026-09-06 10:12:44 IST"
            ),
            AuditLog(
                id="AUD-904",
                user_name="Pooja Verma (Tehsildar Sanganer)",
                user_role="Revenue Officer",
                action_type="MUTATION_VERIFICATION",
                target_entity="Jamabandi RoR Record",
                target_id="Khasra 142/1 Mahapura",
                previous_value="Jamabandi: Unverified",
                new_value="Jamabandi: Succession inquiry underway (Form 12-B issued)",
                ip_address="10.244.19.41 (NIC GovNet)",
                timestamp="2026-09-05 11:45:00 IST"
            )
        ]

    # --- Interface Implementations ---

    def get_all_projects(self) -> List[Project]:
        return list(self.projects.values())

    def get_project_by_id(self, project_id: str) -> Optional[Project]:
        return self.projects.get(project_id)

    def get_parcels_by_project(self, project_id: str) -> List[Parcel]:
        return self.parcels.get(project_id, [])

    def get_parcel_by_id(self, parcel_id: str) -> Optional[Parcel]:
        for p_list in self.parcels.values():
            for p in p_list:
                if p.id == parcel_id:
                    return p
        return None

    def get_parcel_by_khasra(self, district: str, tehsil: str, village: str, khasra_no: str) -> Optional[Parcel]:
        for p_list in self.parcels.values():
            for p in p_list:
                if (p.district.lower() == district.lower() and
                    p.khasra_survey_no == khasra_no):
                    return p
        return None

    def get_routes_for_project(self, project_id: str) -> List[AlternativeRoute]:
        return self.routes.get(project_id, [])

    def get_action_items(self, project_id: Optional[str] = None) -> List[ActionItem]:
        if project_id:
            return [act for act in self.action_items if act.project_id == project_id]
        return self.action_items

    def get_alerts(self, project_id: Optional[str] = None) -> List[Alert]:
        if project_id:
            return [alt for alt in self.alerts if alt.project_id == project_id]
        return self.alerts

    def get_audit_logs(self) -> List[AuditLog]:
        return self.audit_logs

    def get_citizen_tracking_status(self, query: str) -> Optional[CitizenTrackingResponse]:
        """Supports lookup by Parcel ID (e.g. RJ-JPR-P127) or Khasra No (e.g. 142/1) or Owner Name."""
        query_clean = query.strip().upper()
        target_parcel: Optional[Parcel] = None

        for p_list in self.parcels.values():
            for p in p_list:
                if (p.id.upper() == query_clean or
                    p.khasra_survey_no == query.strip() or
                    query_clean in p.owner.name.upper()):
                    target_parcel = p
                    break
            if target_parcel:
                break

        if not target_parcel:
            # Fallback to flagship P127 if query contains 127 or 142
            if "127" in query or "142" in query:
                target_parcel = self.get_parcel_by_id("RJ-JPR-P127")

        if not target_parcel:
            return None

        # Build 5-stage pipeline
        stages = [
            {"stage_no": 1, "title": "Section 11 Preliminary Survey & RoR Verification", "status": "Completed", "date": "15-Dec-2024", "description": "Joint measurement survey completed and published in gazette."},
            {"stage_no": 2, "title": "Section 19 Declaration & Title Verification", "status": "Completed" if target_parcel.acquisition_status != AcquisitionStatus.SECTION_4_NOTIFIED else "In Progress", "date": "10-Feb-2025", "description": "Objections under Section 15 heard and declaration published."},
            {"stage_no": 3, "title": "Compensation Valuation & Section 23 Award", "status": "In Progress" if target_parcel.compensation.disbursement_percentage < 80 else "Completed", "date": "04-Jun-2025", "description": "Market value calculated with 100% Solatium & 12% additional interest."},
            {"stage_no": 4, "title": "Direct Benefit Transfer (DBT) & Escrow Disbursal", "status": "Pending Action" if target_parcel.compensation.disbursement_percentage < 50 else "Completed", "date": "Underway", "description": f"Paid: {target_parcel.compensation.disbursement_percentage:.1f}% | Pending: ₹{target_parcel.compensation.amount_pending_inr/100000:.2f} Lakh"},
            {"stage_no": 5, "title": "Section 38 Physical Possession & Final Mutation", "status": "Completed" if target_parcel.possession_percentage == 100 else "Pending Prior Stages", "date": "Pending", "description": "Handover to executing agency and revenue record update."}
        ]

        current_idx = 3 if target_parcel.delay_risk_level == RiskLevel.CRITICAL else (5 if target_parcel.possession_percentage == 100 else 4)

        return CitizenTrackingResponse(
            parcel_id=target_parcel.id,
            khasra_no=target_parcel.khasra_survey_no,
            village=target_parcel.village,
            tehsil=target_parcel.tehsil,
            district=target_parcel.district,
            state=target_parcel.state,
            owner_name_masked=target_parcel.owner.name[:3] + "****" + target_parcel.owner.name[-2:] if len(target_parcel.owner.name) > 5 else "R***a",
            project_name="Jaipur–Ajmer Integrated Highway Expansion (NH-48 Corridor)",
            project_authority="NHAI PIU Jaipur / Rajasthan LAO",
            current_stage=stages[current_idx - 1]["title"],
            current_stage_index=current_idx,
            stages=stages,
            compensation_status=target_parcel.compensation.payment_status,
            compensation_amount_disbursed_masked=f"₹{target_parcel.compensation.amount_disbursed_inr/100000:.2f} Lakh",
            compensation_amount_pending_masked=f"₹{target_parcel.compensation.amount_pending_inr/100000:.2f} Lakh",
            next_action_for_landowner="Please visit Tehsildar Office Sanganer with updated Jamabandi copy and Aadhaar-seeded Bank Passbook for DBT verification.",
            designated_lao_office="Special Land Acquisition Officer (NH-48), Room 204, Collectorate, Jaipur",
            helpline_number="1800-180-6026 / 0141-2227*** (Toll Free Land Helpdesk)",
            last_updated="08-Sep-2026"
        )
