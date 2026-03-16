from __future__ import annotations

from fastapi import FastAPI, HTTPException

from schemas import SimulationRequest, SimulationResponse
from simulation import run_simulation 


app = FastAPI(
    title="Quantora Backend",
    description="AI Portfolio Risk Intelligence – Monte Carlo simulation engine.",
    version="0.1.0",
)


@app.post(
    "/simulate",
    response_model=SimulationResponse,
    summary="Run Monte Carlo portfolio simulation",
)
def simulate(request: SimulationRequest) -> SimulationResponse:
    """
    Run a Monte Carlo simulation for a given investor profile and portfolio risk level.
    """
    try:
        result = run_simulation(
            age=request.age,
            monthly_investment=request.monthly_investment,
            risk_level=request.risk_level,
            years=request.years,
            target_amount=request.target_amount,
        )
    except Exception as e:  # noqa: BLE001 - surface any internal error as 500
        raise HTTPException(status_code=500, detail=str(e)) from e

    return SimulationResponse(**result)


@app.get("/", tags=["health"])
def health_check() -> dict:
    return {"status": "ok", "service": "quantora-backend"}

