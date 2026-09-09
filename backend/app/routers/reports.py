"""
Report generation endpoints.
"""
from fastapi import APIRouter, Depends, Response
from app.services.report_generator import ReportGeneratorService
from app.providers.mock_data_provider import MockDataProvider
from app.routers.projects import get_data_provider

router = APIRouter(prefix="/api/reports", tags=["Reports"])

_report_service: ReportGeneratorService = None

def get_report_service(provider: MockDataProvider = Depends(get_data_provider)):
    global _report_service
    if _report_service is None:
        _report_service = ReportGeneratorService(provider)
    return _report_service

@router.get("/html/{project_id}")
def get_project_report_html(project_id: str = "jaipur-ajmer-nh48", service: ReportGeneratorService = Depends(get_report_service)):
    """Generate printable HTML dossier."""
    html_content = service.generate_project_dossier_html(project_id)
    return Response(content=html_content, media_type="text/html")
