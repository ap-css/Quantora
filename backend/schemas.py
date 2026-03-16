from __future__ import annotations

from typing import List, Literal

from pydantic import BaseModel, Field, validator


RiskLevel = Literal["conservative", "moderate", "aggressive"]


class SimulationRequest(BaseModel):
    age: int = Field(..., ge=0, description="Current age of the investor in years.")
    monthly_investment: float = Field(
        ...,
        gt=0,
        description="Fixed monthly contribution amount.",
    )
    risk_level: RiskLevel = Field(
        ...,
        description="Risk profile to use for the simulation.",
    )
    years: int = Field(
        ...,
        gt=0,
        description="Number of years to simulate (annual time steps).",
    )
    target_amount: float = Field(
        ...,
        gt=0,
        description="Financial goal used to compute probability of success.",
    )

    @validator("age")
    def validate_age(cls, value: int) -> int:
        # Basic sanity bound; can be relaxed if needed
        if value > 120:
            raise ValueError("Age must be realistic (<= 120).")
        return value


class SimulationResponse(BaseModel):
    expected_final_value: float
    median_final_value: float
    probability_of_reaching_target: float
    value_at_risk_95: float
    best_case: float
    worst_case: float
    std_deviation: float
    sharpe_estimate: float
    sample_paths: List[List[float]]

