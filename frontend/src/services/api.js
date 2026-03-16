import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

/**
 * Run Monte Carlo portfolio simulation.
 * @param {Object} data - { age, monthly_investment, risk_level, years, target_amount }
 * @returns {Promise<Object>} response.data from backend
 */
export async function runSimulation(data) {
  const response = await axios.post(`${API_BASE}/simulate`, data, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });
  return response.data;
}
