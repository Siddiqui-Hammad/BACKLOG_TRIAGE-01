"""
FastAPI Application Entrypoint for Judicial Case Backlog Triage Engine.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db, SessionLocal
from app.data.seed_data import generate_realistic_cases
from app.api.dashboard import router as dashboard_router
from app.api.cases import router as cases_router
from app.api.analysis import router as analysis_router
from app.api.alerts import router as alerts_router
from app.api.feedback import router as feedback_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        generate_realistic_cases(db, count=150)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Judicial Case Backlog Triage Engine API",
    description="Smart India Hackathon (SIH) Prototype: AI-assisted decision-support system for judicial case prioritization and backlog triage.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(cases_router)
app.include_router(analysis_router)
app.include_router(alerts_router)
app.include_router(feedback_router)

@app.get("/")
def root():
    return {
        "system": "Judicial Case Backlog Triage Engine",
        "status": "Online",
        "docs": "/docs",
        "disclaimer": "AI assists in prioritization based on configured rules, case history and predictive analysis. Final decisions remain with the judicial authority."
    }
