📈 Quantora

AI Portfolio Risk Intelligence
Quantora is a Monte Carlo simulation platform that helps investors estimate future wealth and evaluate financial risk with scientific precision.

By leveraging Geometric Brownian Motion (GBM), it generates 10,000+ market scenarios to provide a probabilistic view of investment outcomes.

🚀 Quick Links

🌐 Live Demo: quantora-seven.vercel.app
⚙️ Backend API: quantora-7fpy.onrender.com
📄 API Docs: Swagger UI

✨ Key Features

- 🎲 Monte Carlo Simulations
10,000+ paths generated per request.
- 🛡️ Risk Profiles
Conservative, Moderate, or Aggressive strategies.
- 📊 Financial Metrics
VaR (95%), Sharpe Ratio, and Median outcomes.
- 🎯 Goal Tracking
Real-time probability of reaching targets.
- ⚡ High Performance
Vectorized NumPy simulations for instant responses.

🛠️ Tech Stack

Frontend
- React (Vite)
- TypeScript
- Chart.js & Axios

Backend
- FastAPI (Python)
- NumPy (Vectorized math)
- Pydantic & Uvicorn

Deployment
- Vercel (Frontend)
- Render (Backend)

**### 💻 Local Setup**

1. Clone the Repository

```bash
git clone https://github.com/ap-css/Quantora.git
cd Quantora

2. Backend Setup

cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload

3. Frontend Setup

cd frontend
npm install
npm run dev

🔌 API Reference
Endpoint: POST /simulate

Example Request:

JSON
{
  "age": 25,
  "monthly_investment": 20000,
  "risk_level": "moderate",
  "years": 20,
  "target_amount": 20000000
}

Example Response:

JSON
{
  "expected_final_value": 21328075,
  "prob_of_success": 41.29,
  "value_at_risk_95": 14264758,
  "sharpe_estimate": 0.44
}

👤 Author
Abhinav
github.com/ap-css

📝 License
MIT License
