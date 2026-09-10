"""
Priority Action Queue and Workflow endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.schemas import ActionItem, ActionStatus, AuditLog
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/actions", tags=["Action Queue"])

@router.get("", response_model=List[ActionItem])
def get_action_items(project_id: Optional[str] = None, provider: MockDataProvider = Depends(get_data_provider)):
    """Fetch actionable tasks in priority queue."""
    return provider.get_action_items(project_id)

class UpdateStatusRequest(BaseModel):
    new_status: ActionStatus
    user_name: str = "District Collector"
    user_role: str = "District Magistrate / Collector"

@router.patch("/{action_id}/status")
def update_action_status(
    action_id: str,
    payload: Optional[UpdateStatusRequest] = None,
    new_status: Optional[ActionStatus] = None,
    user_name: str = "District Collector",
    user_role: str = "District Magistrate / Collector",
    provider: MockDataProvider = Depends(get_data_provider)
):
    """Transition an action status and log into audit trail."""
    target_action = next((a for a in provider.action_items if a.id == action_id), None)
    if not target_action:
        raise HTTPException(status_code=404, detail="Action item not found")

    if payload:
        new_status = payload.new_status
        user_name = payload.user_name
        user_role = payload.user_role
    elif new_status is None:
        new_status = ActionStatus.IN_PROGRESS

    status_val = new_status.value if hasattr(new_status, "value") else str(new_status)
    prev_val = target_action.status.value if hasattr(target_action.status, "value") else str(target_action.status)
    target_action.status = new_status
    target_action.updated_at = datetime.now().isoformat()

    # Append to audit log
    provider.audit_logs.insert(0, AuditLog(
        id=f"AUD-{len(provider.audit_logs) + 901}",
        user_name=user_name,
        user_role=user_role,
        action_type="UPDATE_ACTION_STATUS",
        target_entity="Priority Action Queue",
        target_id=action_id,
        previous_value=f"Status: {prev_val}",
        new_value=f"Status: {status_val}",
        ip_address="10.244.18.92 (NIC GovNet)",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    ))

    return {"message": "Action updated successfully", "action": target_action}
