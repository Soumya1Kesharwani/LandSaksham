"""
Audit log trail endpoints.
"""
from fastapi import APIRouter, Depends
from typing import List
from app.models.schemas import AuditLog
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLog])
def get_audit_trail(provider: MockDataProvider = Depends(get_data_provider)):
    """Fetch immutable chronological audit log entries."""
    return provider.get_audit_logs()
