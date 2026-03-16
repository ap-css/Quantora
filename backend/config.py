from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


RISK_FREE_RATE: float = 0.04
N_SIMULATIONS: int = 10_000


@dataclass(frozen=True)
class RiskProfile:
    mean_return: float  # Expected annual return (mu)
    volatility: float   # Annual volatility (sigma)


RISK_PROFILES: Dict[str, RiskProfile] = {
    "conservative": RiskProfile(mean_return=0.08, volatility=0.10),
    "moderate": RiskProfile(mean_return=0.12, volatility=0.18),
    "aggressive": RiskProfile(mean_return=0.15, volatility=0.25),
}


def get_risk_profile(name: str) -> RiskProfile:
    """Return the configured risk profile for a given risk level name."""
    key = name.lower()
    try:
        return RISK_PROFILES[key]
    except KeyError as exc:
        valid = ", ".join(sorted(RISK_PROFILES.keys()))
        raise ValueError(f"Unknown risk level '{name}'. Valid levels: {valid}") from exc

