"""
Predictive analytics, ML delay prediction, SHAP explainability, and risk modeling.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from app.ml.delay_model import LandAcquisitionDelayPredictor
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/analytics", tags=["Analytics & AI"])

@router.post("/predict-delay")
def predict_delay_risk(parcel_features: Dict[str, Any]):
    """Execute ML delay prediction and SHAP calculation on custom feature vector."""
    return LandAcquisitionDelayPredictor.predict_parcel_delay(parcel_features)

@router.get("/project-health/{project_id}")
def get_project_health_breakdown(project_id: str, provider: MockDataProvider = Depends(get_data_provider)) -> Dict[str, Any]:
    """Fetch multi-dimensional readiness vs delay risk matrix."""
    project = provider.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    parcels = provider.get_parcels_by_project(project_id)
    risk_distribution = {
        "CRITICAL": len([p for p in parcels if p.delay_risk_score >= 80]),
        "HIGH": len([p for p in parcels if 60 <= p.delay_risk_score < 80]),
        "MEDIUM": len([p for p in parcels if 35 <= p.delay_risk_score < 60]),
        "LOW": len([p for p in parcels if p.delay_risk_score < 35]),
    }

    land_type_distribution = {
        "Private Agricultural": sum(p.area_acres for p in parcels if "agri" in p.land_type.value.lower()),
        "Government": sum(p.area_acres for p in parcels if "govt" in p.land_type.value.lower() or "government" in p.land_type.value.lower()),
        "Forest": sum(p.area_acres for p in parcels if "forest" in p.land_type.value.lower()),
        "Commercial / Residential": sum(p.area_acres for p in parcels if "commercial" in p.land_type.value.lower() or "residential" in p.land_type.value.lower()),
        "Other / Grazing / Water": sum(p.area_acres for p in parcels if "grazing" in p.land_type.value.lower() or "water" in p.land_type.value.lower())
    }

    return {
        "project_id": project.id,
        "project_name": project.name,
        "overall_delay_risk_score": project.overall_delay_risk_score,
        "overall_readiness_score": project.overall_readiness_score,
        "expected_delay_days": project.expected_delay_days,
        "readiness_breakdown": project.readiness_breakdown,
        "risk_distribution": risk_distribution,
        "land_type_acres_distribution": land_type_distribution,
        "compensation_summary": {
            "total_cr": project.compensation_total_cr,
            "paid_cr": project.compensation_paid_cr,
            "pending_cr": project.compensation_pending_cr,
            "paid_percentage": round((project.compensation_paid_cr / project.compensation_total_cr) * 100, 1) if project.compensation_total_cr > 0 else 0
        }
    }
