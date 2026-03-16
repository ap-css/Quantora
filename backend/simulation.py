from __future__ import annotations

from typing import Dict, List

import numpy as np

from .config import N_SIMULATIONS, RISK_FREE_RATE, get_risk_profile


def run_simulation(
    age: int,
    monthly_investment: float,
    risk_level: str,
    years: int,
    target_amount: float,
) -> Dict[str, float | List[List[float]]]:
    """
    Run a Monte Carlo portfolio simulation using Geometric Brownian Motion (GBM).

    The process is:
    - Annual time step (dt = 1).
    - Each year, apply contribution at the *start* of the year, then apply GBM return.
    - 10,000 simulation paths, fully vectorized across paths.
    """

    # Retrieve GBM parameters for the selected risk profile
    profile = get_risk_profile(risk_level)
    mu = float(profile.mean_return)
    sigma = float(profile.volatility)

    n_years = int(years)
    if n_years <= 0:
        raise ValueError("Years must be positive.")

    n_paths = N_SIMULATIONS
    annual_contribution = float(monthly_investment) * 12.0

    # Random shocks for GBM: Z ~ N(0, 1)
    # Shape: (n_paths, n_years)
    z = np.random.standard_normal(size=(n_paths, n_years))

    # Annual gross return factors from GBM:
    # S_{t+1} = S_t * exp((mu - 0.5 * sigma^2) * dt + sigma * sqrt(dt) * Z)
    # Here dt = 1 year, sqrt(dt) = 1.
    drift = (mu - 0.5 * sigma**2)
    diffusion = sigma * z
    annual_return_factors = np.exp(drift + diffusion)

    # Portfolio value paths, including initial value at t=0
    # Shape: (n_paths, n_years + 1)
    paths = np.zeros((n_paths, n_years + 1), dtype=np.float64)

    # Current portfolio values at time t (vector for all paths)
    current_values = np.zeros(n_paths, dtype=np.float64)

    # Iterate over years (vectorized over paths)
    for t in range(n_years):
        # Contribution at the start of the year
        current_values += annual_contribution
        # Apply GBM annual return
        current_values *= annual_return_factors[:, t]
        # Store portfolio value at end of year t+1
        paths[:, t + 1] = current_values

    final_values = paths[:, -1]

    # Core distribution statistics
    expected_final_value = float(np.mean(final_values))
    median_final_value = float(np.median(final_values))
    std_deviation = float(np.std(final_values, ddof=0))

    # Tail metrics
    worst_case = float(np.percentile(final_values, 5.0))   # 5th percentile
    best_case = float(np.percentile(final_values, 95.0))   # 95th percentile

    # Probability of achieving the target
    probability_of_reaching_target = float(
        np.mean(final_values >= float(target_amount))
    )

    # Value at Risk at 95% confidence:
    # defined here as the expected "shortfall" relative to the expected value,
    # using the 5th percentile as the loss point.
    value_at_risk_95 = float(max(0.0, expected_final_value - worst_case))

    # Sharpe-like ratio using configured mean/vol and a fixed risk-free rate
    sharpe_estimate = float((mu - RISK_FREE_RATE) / sigma) if sigma > 0 else 0.0

    # Sample subset of paths for visualization
    n_sample = min(200, n_paths)
    sample_paths = paths[:n_sample].tolist()

    return {
        "expected_final_value": expected_final_value,
        "median_final_value": median_final_value,
        "probability_of_reaching_target": probability_of_reaching_target,
        "value_at_risk_95": value_at_risk_95,
        "best_case": best_case,
        "worst_case": worst_case,
        "std_deviation": std_deviation,
        "sharpe_estimate": sharpe_estimate,
        "sample_paths": sample_paths,
    }

