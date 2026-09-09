"""
Parcel intelligence, search, filtering, and GIS GeoJSON data endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Dict, Any
from app.models.schemas import Parcel, RiskLevel, LandType, AcquisitionStatus
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/parcels", tags=["Parcels"])

@router.get("", response_model=List[Parcel])
def get_parcels(
    project_id: str = "jaipur-ajmer-nh48",
    risk_level: Optional[RiskLevel] = None,
    land_type: Optional[LandType] = None,
    village: Optional[str] = None,
    tehsil: Optional[str] = None,
    search: Optional[str] = None,
    provider: MockDataProvider = Depends(get_data_provider)
):
    """Query and filter land parcels across a project alignment."""
    parcels = provider.get_parcels_by_project(project_id)

    if risk_level:
        parcels = [p for p in parcels if p.delay_risk_level == risk_level]
    if land_type:
        parcels = [p for p in parcels if p.land_type == land_type]
    if village:
        parcels = [p for p in parcels if p.village.lower() == village.lower()]
    if tehsil:
        parcels = [p for p in parcels if p.tehsil.lower() == tehsil.lower()]
    if search:
        s = search.lower()
        parcels = [
            p for p in parcels
            if s in p.id.lower()
            or s in p.khasra_survey_no.lower()
            or s in p.village.lower()
            or s in p.owner.name.lower()
        ]
    return parcels

@router.get("/{parcel_id}", response_model=Parcel)
def get_parcel_detail(parcel_id: str, provider: MockDataProvider = Depends(get_data_provider)):
    """Fetch complete dossier for a single parcel."""
    parcel = provider.get_parcel_by_id(parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return parcel

@router.get("/geojson/{project_id}")
def get_parcels_geojson(project_id: str = "jaipur-ajmer-nh48", provider: MockDataProvider = Depends(get_data_provider)) -> Dict[str, Any]:
    """Generate GeoJSON FeatureCollection for GIS interactive map rendering."""
    parcels = provider.get_parcels_by_project(project_id)
    features = []

    for p in parcels:
        # Construct polygon coordinates [lng, lat] for standard GeoJSON
        geojson_polygon = [[coord[1], coord[0]] for coord in p.polygon_coordinates]
        if geojson_polygon:
            # Ensure closed ring
            if geojson_polygon[0] != geojson_polygon[-1]:
                geojson_polygon.append(geojson_polygon[0])

        feature = {
            "type": "Feature",
            "properties": {
                "id": p.id,
                "khasra": p.khasra_survey_no,
                "village": p.village,
                "tehsil": p.tehsil,
                "district": p.district,
                "owner": p.owner.name,
                "area_acres": p.area_acres,
                "land_type": p.land_type.value,
                "acquisition_status": p.acquisition_status.value,
                "delay_risk_score": p.delay_risk_score,
                "delay_risk_level": p.delay_risk_level.value,
                "expected_delay_days": p.expected_delay_days,
                "compensation_pending_inr": p.compensation.amount_pending_inr if p.compensation else 0,
                "has_court_case": bool(p.legal_case),
                "has_stay_order": p.legal_case.has_stay_order if p.legal_case else False,
                "recommended_action": p.recommended_action
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [geojson_polygon] if geojson_polygon else []
            }
        }
        features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": features
    }
