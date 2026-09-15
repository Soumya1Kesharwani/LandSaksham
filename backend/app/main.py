import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routers import (
    projects, parcels, analytics, routes_simulator,
    actions, copilot, citizen, audit, reports
)

app = FastAPI(
    title="National Land & Infrastructure Intelligence System (NLIIS) API",
    description="Predictive Analytics & Decision Support Platform for Early Detection of Land Acquisition Delays (Smart India Hackathon 2026)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local React/Vite development and cloud deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(projects.router)
app.include_router(parcels.router)
app.include_router(analytics.router)
app.include_router(routes_simulator.router)
app.include_router(actions.router)
app.include_router(copilot.router)
app.include_router(citizen.router)
app.include_router(audit.router)
app.include_router(reports.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "nliis-backend"}

# Check for frontend build artifacts for unified deployment
possible_dist_paths = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist"),
    os.path.join(os.getcwd(), "frontend", "dist"),
    os.path.join(os.getcwd(), "dist"),
]

frontend_dist = next((p for p in possible_dist_paths if os.path.exists(p) and os.path.isdir(p)), None)

if frontend_dist:
    # Mount assets folder
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_or_static(full_path: str = ""):
        if full_path in ["docs", "redoc", "openapi.json", "health"]:
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {
            "platform": "LandSaksham",
            "status": "Operational"
        }
else:
    @app.get("/")
    def root():
        return {
            "platform": "National Land & Infrastructure Intelligence System (NLIIS)",
            "status": "Operational",
            "version": "1.0.0",
            "edition": "SIH 2026 Hackathon Prototype",
            "documentation": "/docs"
        }

