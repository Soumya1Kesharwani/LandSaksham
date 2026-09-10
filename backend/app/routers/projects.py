"""
Project management and overview endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.models.schemas import Project
from app.providers.mock_data_provider import MockDataProvider

router = APIRouter(prefix="/api/projects", tags=["Projects"])

# Singleton data provider instance
_data_provider = MockDataProvider()

def get_data_provider():
    return _data_provider

@router.get("", response_model=List[Project])
def get_all_projects(provider: MockDataProvider = Depends(get_data_provider)):
    """Fetch all active infrastructure projects."""
    return provider.get_all_projects()

@router.get("/{project_id}", response_model=Project)
def get_project_by_id(project_id: str, provider: MockDataProvider = Depends(get_data_provider)):
    """Fetch full intelligence profile for a specific project."""
    project = provider.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=Project)
def create_project(project: Project, provider: MockDataProvider = Depends(get_data_provider)):
    """Create a new infrastructure project profile."""
    provider.projects[project.id] = project
    return project
