"""
AI Government Officer Copilot endpoints.
"""
from fastapi import APIRouter, Depends, Body
from typing import Dict, Any
from app.services.ai_copilot import AIOfficerCopilotService
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/copilot", tags=["AI Officer Copilot"])

_copilot_service: AIOfficerCopilotService = None

def get_copilot_service(provider: MockDataProvider = Depends(get_data_provider)):
    global _copilot_service
    if _copilot_service is None:
        _copilot_service = AIOfficerCopilotService(provider)
    return _copilot_service

@router.post("/chat")
def chat_with_copilot(
    query: str = Body(..., embed=True),
    project_id: str = Body("jaipur-ajmer-nh48", embed=True),
    language: str = Body("en", embed=True),
    service: AIOfficerCopilotService = Depends(get_copilot_service)
) -> Dict[str, Any]:
    """Ask questions to the RAG-grounded AI Officer Copilot."""
    return service.answer_query(query=query, project_id=project_id, language=language)
