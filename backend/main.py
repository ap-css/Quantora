from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import SimulationRequest, SimulationResponse
from .simulation import run_simulation

app = FastAPI(
title="Quantora Backend",
description="AI Portfolio Risk Intelligence – Monte Carlo simulation engine",
version="0.1.0"
)

# Allow frontend requests (Vercel)

app.add_middleware(
CORSMiddleware,
allow_origins=["https://quantora-seven.vercel.app"],  # later you can restrict to your Vercel domain
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
try:
result = run_simulation(
age=request.age,
monthly_investment=request.monthly_investment,
risk_level=request.risk_level,
years=request.years,
target_amount=request.target_amount,
)
return SimulationResponse(**result)

```
except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
```

@app.get("/")
def health_check():
return {"status": "ok", "service": "quantora-backend"}


