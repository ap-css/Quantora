import { useState } from 'react';
import { motion } from 'framer-motion';
import { runSimulation } from '../services/api';

const RISK_OPTIONS = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'aggressive', label: 'Aggressive' },
];

const inputClass =
  'w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-[#9CA3AF] focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all duration-300';

export default function SimulationForm({ onResult, onError }) {
  const [age, setAge] = useState(25);
  const [monthlyInvestment, setMonthlyInvestment] = useState(20000);
  const [years, setYears] = useState(20);
  const [targetAmount, setTargetAmount] = useState(20000000);
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const data = {
        age: Number(age),
        monthly_investment: Number(monthlyInvestment),
        risk_level: riskLevel,
        years: Number(years),
        target_amount: Number(targetAmount),
      };
      const result = await runSimulation(data);
      onResult?.(result);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Simulation failed. Please try again.';
      setErrorMessage(message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit}
      className="glass-card p-6 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Age
          </label>
          <input
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Monthly Investment (₹)
          </label>
          <input
            type="number"
            min={1}
            step={1000}
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Years
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Target Amount (₹)
          </label>
          <input
            type="number"
            min={1}
            step={100000}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-3 block text-sm font-medium text-[#9CA3AF]">
          Risk Level
        </label>
        <div className="flex flex-wrap gap-2">
          {RISK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRiskLevel(opt.value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                riskLevel === opt.value
                  ? 'bg-accent text-white shadow-lg shadow-accent/25'
                  : 'bg-white/10 text-[#9CA3AF] hover:bg-white/15 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-accent/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Running simulation…
            </>
          ) : (
            'Run simulation'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
