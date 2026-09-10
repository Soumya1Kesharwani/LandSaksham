"""
National Land & Infrastructure Intelligence System (NLIIS) - FastAPI Main Application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Enable CORS for local React/Vite development and government intranet deployment
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

@app.get("/")
def root():
    return {
        "platform": "National Land & Infrastructure Intelligence System (NLIIS)",
        "status": "Operational",
        "version": "1.0.0",
        "edition": "SIH 2026 Hackathon Prototype",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "nliis-backend"}
