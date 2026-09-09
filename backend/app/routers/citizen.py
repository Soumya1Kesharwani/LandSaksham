"""
Citizen & Landowner Transparency Portal endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.models.schemas import CitizenTrackingResponse
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/citizen", tags=["Citizen & Landowner Portal"])

@router.get("/track/{query}", response_model=CitizenTrackingResponse)
def track_parcel_status(query: str, provider: MockDataProvider = Depends(get_data_provider)):
    """Public land acquisition progress tracker for citizens/landowners."""
    result = provider.get_citizen_tracking_status(query)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="No acquisition record found matching the provided Khasra number or Parcel ID. Please check your spelling or contact your Tehsil LAO Helpdesk."
        )
    return result
