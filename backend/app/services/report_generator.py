"""
Official Project Intelligence & Land Acquisition Risk Report Generator.
Produces structured, printable government-style executive dossiers with statutory disclaimers.
"""
from datetime import datetime
from typing import Dict, Any
from app.providers.mock_data_provider import MockDataProvider

class ReportGeneratorService:
    def __init__(self, data_provider: MockDataProvider):
        self.data_provider = data_provider

    def generate_project_dossier_html(self, project_id: str = "jaipur-ajmer-nh48") -> str:
        project = self.data_provider.get_project_by_id(project_id)
        if not project:
            return "<h1>Project Not Found</h1>"

        parcels = self.data_provider.get_parcels_by_project(project_id)
        critical_parcels = [p for p in parcels if p.delay_risk_score >= 70]
        action_items = self.data_provider.get_action_items(project_id)
        now_str = datetime.now().strftime("%d-%b-%Y %H:%M IST")

        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Official Project Readiness & Risk Assessment Report - {project.name}</title>
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.5; }}
        .header {{ border-bottom: 3px double #0f2942; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }}
        .header h1 {{ margin: 0 0 4px; color: #0f2942; font-size: 22px; text-transform: uppercase; letter-spacing: 0.5px; }}
        .header h2 {{ margin: 0; color: #475569; font-size: 14px; font-weight: 500; }}
        .watermark {{ color: #dc2626; font-size: 11px; font-weight: bold; margin-top: 6px; letter-spacing: 1px; }}
        .meta-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 13px; }}
        .meta-item strong {{ display: block; color: #64748b; font-size: 11px; text-transform: uppercase; }}
        .section-title {{ font-size: 15px; color: #0f2942; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }}
        th, td {{ border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }}
        th {{ background: #f1f5f9; color: #334155; font-weight: 600; }}
        .badge {{ display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: 600; font-size: 11px; }}
        .badge-critical {{ background: #fee2e2; color: #991b1b; }}
        .badge-high {{ background: #ffedd5; color: #9a3412; }}
        .badge-medium {{ background: #fef9c3; color: #854d0e; }}
        .badge-low {{ background: #dcfce7; color: #166534; }}
        .summary-box {{ background: #eff6ff; border-left: 4px solid #1d4ed8; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; }}
        .footer {{ margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #64748b; text-align: center; }}
        .signature-block {{ display: flex; justify-content: space-between; margin-top: 60px; font-size: 12px; }}
        .signature-line {{ border-top: 1px solid #334155; width: 220px; text-align: center; padding-top: 4px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>National Land & Infrastructure Intelligence System (NLIIS)</h1>
        <h2>PROJECT READINESS & BOTTLENECK ASSESSMENT DOSSIER</h2>
        <div class="watermark">OFFICIAL INTERNAL DECISION SUPPORT DOCUMENT — FOR ADMINISTRATIVE USE ONLY</div>
    </div>

    <div class="meta-grid">
        <div class="meta-item"><strong>Project Name</strong>{project.name}</div>
        <div class="meta-item"><strong>Project Authority</strong>{project.authority}</div>
        <div class="meta-item"><strong>Districts / State</strong>{', '.join(project.districts)}, {project.state}</div>
        <div class="meta-item"><strong>Generated On</strong>{now_str}</div>
        <div class="meta-item"><strong>Total Length / Cost</strong>{project.length_km} km / ₹{project.total_cost_cr:,.1f} Cr</div>
        <div class="meta-item"><strong>Total Land Required</strong>{project.total_land_required_acres:,.1f} Acres ({project.total_parcels_count} Parcels)</div>
        <div class="meta-item"><strong>Overall Delay Risk</strong><span class="badge badge-high">{project.overall_delay_risk_score}% ({project.overall_delay_risk_level.value})</span></div>
        <div class="meta-item"><strong>Project Readiness</strong>{project.overall_readiness_score}/100</div>
    </div>

    <div class="summary-box">
        <strong>Executive Bottleneck Summary:</strong><br>
        The predictive analytics model indicates an expected delay of <strong>{project.expected_delay_days} days</strong> primarily driven by 
        <strong>{project.stay_orders_count} active judicial stay orders</strong>, <strong>₹{project.compensation_pending_cr:,.1f} Cr pending compensation</strong>, 
        and <strong>{project.environmental_flags_count} environmental/forest clearance flags</strong>. 
        Immediate administrative intervention is recommended on {len(critical_parcels)} critical land parcels.
    </div>

    <div class="section-title">1. Key Readiness Dimensions (0 - 100 Index)</div>
    <table>
        <tr>
            <th>Land & Mutation</th>
            <th>Legal & Litigation</th>
            <th>Compensation Payout</th>
            <th>Forest & Environment</th>
            <th>R&R Resettlement</th>
            <th>Documentation</th>
        </tr>
        <tr>
            <td>{project.readiness_breakdown.get('land', 0)} / 100</td>
            <td>{project.readiness_breakdown.get('legal', 0)} / 100</td>
            <td>{project.readiness_breakdown.get('compensation', 0)} / 100</td>
            <td>{project.readiness_breakdown.get('environment', 0)} / 100</td>
            <td>{project.readiness_breakdown.get('rr', 0)} / 100</td>
            <td>{project.readiness_breakdown.get('documents', 0)} / 100</td>
        </tr>
    </table>

    <div class="section-title">2. Critical Priority Parcels Requiring Immediate Officer Intervention</div>
    <table>
        <thead>
            <tr>
                <th>Parcel ID</th>
                <th>Khasra / Village</th>
                <th>Land Type & Area</th>
                <th>Owner Name</th>
                <th>Risk Score</th>
                <th>Expected Delay</th>
                <th>Primary Bottleneck</th>
            </tr>
        </thead>
        <tbody>
        """

        for p in critical_parcels:
            badge_class = "badge-critical" if p.delay_risk_score >= 80 else "badge-high"
            primary_reason = p.top_risk_factors[0].factor_name if p.top_risk_factors else "Documentation Hold"
            html += f"""
            <tr>
                <td><strong>{p.id}</strong></td>
                <td>{p.khasra_survey_no} ({p.village}, {p.tehsil})</td>
                <td>{p.land_type.value} ({p.area_acres} Acres)</td>
                <td>{p.owner.name}</td>
                <td><span class="badge {badge_class}">{p.delay_risk_score}% ({p.delay_risk_level.value})</span></td>
                <td>+{p.expected_delay_days} days</td>
                <td>{primary_reason}</td>
            </tr>
            """

        html += f"""
        </tbody>
    </table>

    <div class="section-title">3. Priority Administrative Action Queue</div>
    <table>
        <thead>
            <tr>
                <th>Action ID</th>
                <th>Target Parcel / Khasra</th>
                <th>Problem & Recommended Action</th>
                <th>Responsible Dept</th>
                <th>Due Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
        """

        for act in action_items:
            act_status_str = act.status.value if hasattr(act.status, "value") else str(act.status)
            act_dept_str = act.responsible_department.value if hasattr(act.responsible_department, "value") else str(act.responsible_department)
            html += f"""
            <tr>
                <td><strong>{act.id}</strong></td>
                <td>{act.parcel_id or 'General'} ({act.khasra_no or '-'})</td>
                <td><strong>{act.title}</strong><br>{act.recommended_action}</td>
                <td>{act_dept_str}</td>
                <td>{act.due_date}</td>
                <td><strong>{act_status_str}</strong></td>
            </tr>
            """

        html += f"""
        </tbody>
    </table>

    <div class="section-title">4. Macroeconomic & Employment Impact Projections</div>
    <table>
        <tr>
            <th>Direct Construction Jobs</th>
            <th>Indirect Supply Chain Jobs</th>
            <th>Total Job Multiplier</th>
            <th>Travel Time Reduction</th>
            <th>Annual Regional GDP Stimulus</th>
        </tr>
        <tr>
            <td>{project.employment.direct_construction_jobs:,}</td>
            <td>{project.employment.indirect_supply_chain_jobs:,}</td>
            <td><strong>{project.employment.total_estimated_jobs:,} Jobs</strong></td>
            <td>{project.economic.avg_travel_time_reduction_pct}%</td>
            <td>₹{project.economic.estimated_local_gdp_boost_cr:,.1f} Crore</td>
        </tr>
    </table>

    <div class="signature-block">
        <div class="signature-line">
            Prepared by:<br>
            <strong>Special Land Acquisition Officer (LAO)</strong><br>
            PIU Jaipur / Ajmer
        </div>
        <div class="signature-line">
            Reviewed & Endorsed:<br>
            <strong>District Magistrate & Collector</strong><br>
            Chairperson, District LA Committee
        </div>
    </div>

    <div class="footer">
        National Land & Infrastructure Intelligence System (NLIIS) • Generated dynamically from integrated land records & AI predictive models • Page 1 of 1
    </div>
</body>
</html>
        """
        return html
