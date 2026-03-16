## Quantora Backend – Monte Carlo Simulation Engine

This backend provides the core simulation engine for **Quantora**, an AI Portfolio Risk Intelligence System.  
It exposes a FastAPI endpoint that runs a fully vectorized Monte Carlo simulation using **Geometric Brownian Motion (GBM)** to project portfolio outcomes under different risk profiles.

---

## What is a Monte Carlo Simulation?

A **Monte Carlo simulation** is a computational technique that uses random sampling to estimate the probability distribution of possible outcomes for a process that is difficult to predict precisely.

In the context of investing:

- **Inputs**:
  - Expected return (mean)
  - Volatility (standard deviation of returns)
  - Time horizon
  - Contribution schedule
- **Process**:
  - Simulate many (here: 10,000) possible future paths of portfolio values.
  - Each path represents one possible future, given the randomness of market returns.
- **Outputs**:
  - Distribution of final portfolio values
  - Probabilities of reaching a goal
  - Risk measures such as Value at Risk (VaR)

Monte Carlo allows Quantora to answer questions like *“What is the probability I reach my target amount in 20 years?”* instead of just giving a single deterministic projection.

---

## What is Geometric Brownian Motion (GBM)?

**Geometric Brownian Motion** is a standard mathematical model for asset prices.  
If \( S(t) \) is the portfolio or asset value at time \( t \), then under GBM:

\[
S(t+1) = S(t) \cdot \exp\Big((\mu - 0.5\sigma^2) + \sigma Z\Big)
\]

Where:

- \( \mu \) – expected (mean) annual return
- \( \sigma \) – annual volatility
- \( Z \sim \mathcal{N}(0, 1) \) – a standard normal random variable

This model captures:

- **Compounding** via the exponential term
- **Randomness** via \( Z \)
- **Volatility drag** via the \( -0.5\sigma^2 \) term

In this backend, we:

- Use **annual time steps** (\( \Delta t = 1 \) year).
- Apply GBM per year for each simulation path.
- Add contributions at the **start of each year** before applying the GBM return.

---

## Financial Assumptions

Defined in `config.py`:

- **Conservative**
  - `mean_return = 0.08`
  - `volatility = 0.10`
- **Moderate**
  - `mean_return = 0.12`
  - `volatility = 0.18`
- **Aggressive**
  - `mean_return = 0.15`
  - `volatility = 0.25`

Additional assumptions:

- **Risk-free rate** for Sharpe-like ratio: `0.04`
- **Number of simulations**: `10_000`
- Time step is **annual**.
- Contributions are added as `monthly_investment * 12` **at the start of each year**.

---

## Project Structure

Key files under `backend/`:

- `main.py` – FastAPI application and `/simulate` endpoint.
- `simulation.py` – Vectorized Monte Carlo GBM engine.
- `schemas.py` – Pydantic request/response models.
- `config.py` – Risk profiles and simulation constants.
- `README.md` – This documentation.

---

## Running the Server

From the **project root** (where `backend/` lives), run:

```bash
cd backend
uvicorn main:app --reload
```

By default, FastAPI will be available at `http://127.0.0.1:8000`.

- Interactive API docs (Swagger UI): `http://127.0.0.1:8000/docs`
- Alternative docs (ReDoc): `http://127.0.0.1:8000/redoc`

---

## API Endpoint – `/simulate`

### Request

`POST /simulate`

**Sample JSON body:**

```json
{
  "age": 25,
  "monthly_investment": 20000,
  "risk_level": "moderate",
  "years": 20,
  "target_amount": 20000000
}
```

### Response

On success, the endpoint returns:

```json
{
  "expected_final_value": 0.0,
  "median_final_value": 0.0,
  "probability_of_reaching_target": 0.0,
  "value_at_risk_95": 0.0,
  "best_case": 0.0,
  "worst_case": 0.0,
  "std_deviation": 0.0,
  "sharpe_estimate": 0.0,
  "sample_paths": [[0.0]]
}
```

In a real run, the values will be realistic non-zero numbers based on the Monte Carlo outcomes.  
`sample_paths` contains up to **200 paths**, each as an array of yearly portfolio values from year 0 to `years`.

Field meanings:

- `expected_final_value` – Mean of final portfolio values across 10,000 simulations.
- `median_final_value` – 50th percentile of final values.
- `probability_of_reaching_target` – Fraction of simulations where final value ≥ `target_amount`.
- `value_at_risk_95` – Approximate 95% Value at Risk, modeled as the shortfall between the mean and the 5th percentile outcome.
- `best_case` – 95th percentile of final values.
- `worst_case` – 5th percentile of final values.
- `std_deviation` – Standard deviation of final outcomes.
- `sharpe_estimate` – Sharpe-like ratio \( (\mu - 0.04) / \sigma \) using the configured profile parameters.

---

## Testing the Endpoint with `curl`

With the server running (`uvicorn main:app --reload` from `backend/`), run:

```bash
curl -X POST "http://127.0.0.1:8000/simulate" ^
  -H "Content-Type: application/json" ^
  -d "{\
    \"age\": 25, \
    \"monthly_investment\": 20000, \
    \"risk_level\": \"moderate\", \
    \"years\": 20, \
    \"target_amount\": 20000000 \
  }"
```

On Unix-like shells (bash/zsh), you can use:

```bash
curl -X POST "http://127.0.0.1:8000/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "monthly_investment": 20000,
    "risk_level": "moderate",
    "years": 20,
    "target_amount": 20000000
  }'
```

You should receive a JSON response with realistic financial projections based on the Monte Carlo GBM engine.

