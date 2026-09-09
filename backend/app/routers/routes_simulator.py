"""
Alternative Route Simulator endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import AlternativeRoute
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/routes", tags=["Route Alternatives"])

@router.get("/{project_id}", response_model=List[AlternativeRoute])
def get_alternative_routes(project_id: str, provider: MockDataProvider = Depends(get_data_provider)):
    """Fetch comparative alignment routes for a project."""
    routes = provider.get_routes_for_project(project_id)
    if not routes:
        raise HTTPException(status_code=404, detail="No alternative routes configured for this project")
    return routes
